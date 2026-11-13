# @agentsearchhq/ai-sdk

[Vercel AI SDK](https://ai-sdk.dev) tools for [AgentSearch](https://agentsearchhq.com/?utm_source=agentsearchhq-ai-sdk&utm_medium=package): live web search, page extraction and a headless browser for agents. **Search is free with no API key**, extract and render have a small no-wallet free trial, and everything else is pay-per-call in USDC on Base via x402 (no account, no API key).

Works with `generateText`, `streamText` and agents in AI SDK 5, 6 and 7.

| Tool name | Cost |
|---|---|
| `agentsearch_search` | **Free** by default (up to 25 searches/day per IP, subject to shared daily capacity; up to 5 results; no key). Paid search only when you opt in (`mode: "paid"` or `AGENTSEARCH_MODE=paid`), $0.008/call |
| `agentsearch_extract` | URL to clean markdown/text. **Free trial** with no wallet (5 calls/day per IP), then $0.004/call |
| `agentsearch_render` | Headless browser for JavaScript pages. **Free trial** with no wallet (3 calls/day per IP, no screenshots), then $0.010/call |
| `agentsearch_search_and_read` | Search plus the top pages' text in one call, $0.009 (charged only when at least one page returns text) |
| `agentsearch_news_search` | Recent news with publish dates, $0.008 (not charged when there are no results) |
| `agentsearch_screenshot` | PNG/JPEG page screenshot, $0.010. The image bytes stay in the tool result; the model only sees the metadata |

## Install

```bash
npm install @agentsearchhq/ai-sdk ai zod
```

## Quick start (free, no key)

```ts
import { generateText, stepCountIs } from "ai";
import { openai } from "@ai-sdk/openai";
import { agentSearchFreeTools } from "@agentsearchhq/ai-sdk";

const { text } = await generateText({
  model: openai("gpt-4.1-mini"),
  tools: agentSearchFreeTools(),   // agentsearch_search (free) + extract/render (free trial)
  stopWhen: stepCountIs(5),        // AI SDK 7: isStepCount(5)
  prompt: "What changed in the latest Vercel AI SDK release? Read the release notes and cite URLs.",
});
console.log(text);
```

All six tools (paid ones answer with a setup hint until a wallet is configured):

```ts
import { agentSearchTools } from "@agentsearchhq/ai-sdk";

const tools = agentSearchTools();   // { agentsearch_search, agentsearch_extract, agentsearch_render, agentsearch_search_and_read, agentsearch_news_search, agentsearch_screenshot }
```

Or pick single tools: `webSearch()`, `extractPage()`, `renderPage()`, `searchAndRead()`, `newsSearch()`, `screenshot()`.

```ts
import { webSearch, extractPage } from "@agentsearchhq/ai-sdk";

const tools = { search: webSearch(), read: extractPage() };
```

Tool results are JSON objects. A failed call returns `{ error: "..." }` instead of throwing, so the model can recover (for example, the free-search limit message explains how to continue).

## Search modes

The model only sees `agentsearch_search({ query, max_results })`; it can never choose paid search. The mode is a developer setting: `webSearch({ mode: "paid" })` or `agentSearchTools({ mode: "paid" })`.

- `free` (default): the free relay.
- `paid`: paid search ($0.008/call). Falls back to free with a console warning if no wallet key is set.
- `auto`: paid if a wallet key is set, otherwise free.

`AGENTSEARCH_MODE` (`free` / `paid` / `auto`) takes precedence over the `mode` option. A wallet key on its own never switches search to paid.

**Search filters** (paid search, news and search-and-read; the free tier ignores them): `freshness` (`day`, `week`, `month`, `year`) or `date_from`/`date_to` (YYYY-MM-DD), `country` (e.g. `us`), `language` (e.g. `en`), `include_domains` and `exclude_domains` (up to 5 each).

`agentsearch_extract` accepts `formats` (`markdown`, `text`, `html`, `links`), `max_chars` (up to 50000 on the direct API), `include_links` and `render_fallback` (retry thin, JavaScript-heavy pages with render; that is a second call).

**Free trial (no wallet):** extract and render work without a wallet through the AgentSearch free relay: 5 extracts and 3 renders per day per IP (resets 00:00 UTC, subject to shared daily capacity, no screenshots). Set `AGENTSEARCH_FREE_TRIAL=0` to turn it off.

## Paid tools (x402, no account)

Set `AGENTSEARCH_WALLET_PRIVATE_KEY` to the private key of a **new wallet made only for this**, funded with a little USDC on Base (e.g. $1; no ETH needed). Calls are paid per request over x402 directly to AgentSearch's own API (`https://api.agentsearchhq.com`), settled only on success: search $0.008, news $0.008, extract $0.004, render $0.010, screenshot $0.010, search-and-read $0.009 ([pricing](https://agentsearchhq.com/pricing?utm_source=agentsearchhq-ai-sdk&utm_medium=package), [x402 docs](https://agentsearchhq.com/docs/x402?utm_source=agentsearchhq-ai-sdk&utm_medium=package)). Wallet setup takes about two minutes: [guide](https://agentsearchhq.com/wallet-setup?utm_source=agentsearchhq-ai-sdk&utm_medium=package).

| Env var | Default |
|---|---|
| `AGENTSEARCH_WALLET_PRIVATE_KEY` / `POCKET_PRIVATE_KEY` | unset (paid tools disabled; extract/render use the free trial) |
| `AGENTSEARCH_MAX_TOTAL_ATOMIC` | `1000000` ($1.00 per process) |
| `AGENTSEARCH_MAX_PER_CALL_ATOMIC` | `20000` on the direct route (can only be lowered) |
| `AGENTSEARCH_PAYMENT_ROUTE` | `direct`; `pocket` = Pocket Network Agentic Portal at $0.005/call (search, extract, render only) |
| `AGENTSEARCH_MODE` | unset (`free`, `paid` or `auto`) |
| `AGENTSEARCH_FREE_TRIAL` | on; `0` turns off the no-wallet trial |
| `AGENTSEARCH_TIMEOUT_MS` | `30000` |
| `AGENTSEARCH_NO_CLIENT_TAG` | unset (`1` = don't send the anonymous `X-Agent-Client: @agentsearchhq/ai-sdk/<version>` header) |

Spending caps are checked before anything is signed. The key is only used to sign and never appears in tool output or errors. Paid results include a `payment` object (amount, transaction, explorer link). Track spend with `sessionSpentAtomic()` and reset it with `resetSessionBudget()`.

**Screenshots:** `agentsearch_screenshot` returns `{ summary, result }`. The model sees only `summary` (metadata, no image bytes); your app reads `result.screenshot.base64` from the tool result.

## Input checks

Inputs are checked before any request: an empty `query`, or a URL that isn't a full public `http(s)` URL (no credentials, localhost, private IPs or single-label hosts), returns an error without a request, so it never counts against the free limit and nothing is signed.

## Links

- Guide: [Add web search to the Vercel AI SDK](https://agentsearchhq.com/blog/add-web-search-to-vercel-ai-sdk?utm_source=agentsearchhq-ai-sdk&utm_medium=package)
- Agent guide: https://agentsearchhq.com/agents.md?utm_source=agentsearchhq-ai-sdk&utm_medium=package
- MCP server (Claude, Cursor): `npx -y @agentsearchhq/agentsearch-mcp`

MIT. Release notes: [CHANGELOG.md](CHANGELOG.md).
