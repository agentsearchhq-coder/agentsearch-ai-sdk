// Test-only adapter: gives AI SDK tools a LangChain-like invoke() so the shared test suite can run unchanged.
import * as lib from "../dist/index.js";
export * from "../dist/index.js";

const opts = { toolCallId: "c1", messages: [] };
export function wrap(t, name) {
  const w = Object.create(t);
  w.name = name ?? t.toolName;
  w.invoke = async (arg) => {
    if (arg && arg.type === "tool_call") {
      const out = await t.execute(arg.args, opts);
      const mo = await t.toModelOutput({ toolCallId: "c1", input: arg.args, output: out });
      return { content: mo.value, artifact: out.result ?? null };
    }
    const out = await t.execute(arg, opts);
    return out && typeof out === "object" && "error" in out && Object.keys(out).length === 1 ? `Error: ${out.error}` : JSON.stringify(out);
  };
  return w;
}
const f = (fn) => { const g = (...a) => wrap(fn(...a)); Object.defineProperty(g, "name", { value: fn.name }); return g; };
export const AgentSearchTool = f(lib.AgentSearchTool);
export const AgentSearchExtractTool = f(lib.AgentSearchExtractTool);
export const AgentSearchRenderTool = f(lib.AgentSearchRenderTool);
export const AgentSearchSearchAndReadTool = f(lib.AgentSearchSearchAndReadTool);
export const AgentSearchNewsTool = f(lib.AgentSearchNewsTool);
export const AgentSearchScreenshotTool = f(lib.AgentSearchScreenshotTool);
export const agentSearchTools = (o) => Object.entries(lib.agentSearchTools(o)).map(([k, t]) => wrap(t, k));
