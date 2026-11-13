import { tool as aiTool, type Tool } from "ai";
import type { z } from "zod";

type Cfg<S> = { name: string; description: string; schema: S; responseFormat?: "content" | "content_and_artifact" };

function toOutput(r: unknown): unknown {
  if (typeof r !== "string") return r;
  if (r.startsWith("Error: ")) return { error: r.slice(7) };
  try { return JSON.parse(r); } catch { return { text: r }; }
}

/** Adapts the shared tool bodies (LangChain-style fn + config) to a Vercel AI SDK tool (ai v5-v7).
 *  The returned tool carries `toolName` so agentSearchTools() can key the ToolSet. */
export function tool<S extends z.ZodTypeAny>(fn: (input: z.infer<S>) => Promise<unknown>, cfg: Cfg<S>): Tool<z.infer<S>, unknown> & { toolName: string } {
  type I = z.infer<S>;
  const artifact = cfg.responseFormat === "content_and_artifact";
  const t = aiTool({
    description: cfg.description,
    inputSchema: cfg.schema as never,
    execute: async (input: I) => {
      const r = await fn(input);
      if (artifact && Array.isArray(r)) {
        const [text, full] = r as [string, unknown];
        return full ? { summary: text, result: full } : { error: String(text).replace(/^Error: /, "") };
      }
      return toOutput(r);
    },
    ...(artifact
      ? {
          // Keep base64 image bytes out of the model's context: the model sees the summary text, the app keeps the full result.
          // ai v5 passes the output directly; v6+ passes { toolCallId, input, output }.
          toModelOutput: (arg: unknown) => {
            const o = (arg && typeof arg === "object" && "toolCallId" in (arg as object) ? (arg as { output: unknown }).output : arg) as
              | { summary?: string; error?: string }
              | undefined;
            return { type: "text", value: o?.summary ?? `Error: ${o?.error ?? "unknown"}` };
          },
        }
      : {}),
  } as never) as unknown as Tool<I, unknown>;
  return Object.assign(t, { toolName: cfg.name });
}
