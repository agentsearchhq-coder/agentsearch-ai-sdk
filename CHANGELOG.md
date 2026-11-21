# Changelog

## 0.2.2 (2026-11-21)

- News, Search + Read and Screenshot use the free relay by default (10 free calls per IP in total each). Paid x402 only when a wallet is set and AGENTSEARCH_MODE=paid (or mode: "paid").

## 0.2.1 (2026-11-20)
- Free search wording: the free relay now allows **25 free searches per IP in total** (a lifetime allowance since 2026-11-19, not per day), then pay per call via x402 on Base ($0.003 per search at https://api.agentsearchhq.com; wallet setup https://agentsearchhq.com/wallet-setup). The search tool description, the free-limit (HTTP 429) message, `searchModeLabel()` and the README no longer say "25 searches/day per IP", "resets daily" or "daily limit". The extract/render free trial is unchanged (5 extract and 3 render calls per day per IP). No behavior change.

## 0.2.0 (2026-11-19)
- **With a wallet, search pays by default.** The search mode now defaults to `auto`: when a wallet is configured, `agentsearch_search` pays $0.003 per call over x402 to AgentSearch's own API ($0.005 with `AGENTSEARCH_PAYMENT_ROUTE=pocket`). With no wallet it uses the free relay exactly as before. `mode: "free"` or `AGENTSEARCH_MODE=free` is the opt-out. Spend caps are unchanged.
- **Reuse an existing wallet:** `AGENTSEARCH_WALLET_FILE` (64-hex key file or JSON with `privateKey`; `agentcash` = `~/.agentcash/wallet.json`). Read only when signing; never logged.
- **Mode is visible:** search results carry `agentsearch_mode`; `searchModeLabel()` is exported; one stderr line when a tool is created with paid search.
- README: search price in the tool table fixed to $0.003 (was $0.005). `X-Agent-Client` now reports the real version.

## 0.1.3 (2026-11-16)
- Docs only: README tool table: news $0.003 and screenshot $0.004 (were still $0.005). Live direct prices: search and news $0.003, extract $0.002, render $0.005, screenshot $0.004, search_and_read $0.005; Pocket route unchanged at $0.005. No code or behavior change.

## 0.1.2 (2026-11-15)
- Direct x402 list prices now match the live API (approved 2026-11-15): search and news $0.003, extract $0.002, render $0.005, screenshot $0.004, search_and_read $0.005. Runtime price constants, tool text, docs and tests updated. Pocket route remains $0.005. The per-call ceiling stays $0.020.

## 0.1.1 (2026-11-13)

Fix: one-character queries are now rejected client-side (the free relay answers them with HTTP 400 `QUERY_TOO_SHORT`), so agents no longer burn requests on them, and any relay 4xx now comes back as a clear "fix the input, don't retry unchanged" message instead of a bare HTTP error.

## 0.1.0 (2026-11-13)

First release. Vercel AI SDK (ai 5-7) tools for AgentSearch: `agentsearch_search` (free, no key), `agentsearch_extract` and `agentsearch_render` (free no-wallet trial, then x402), and pay-per-call `agentsearch_search_and_read` ($0.009), `agentsearch_news_search` ($0.008) and `agentsearch_screenshot` ($0.010, image bytes kept out of model context via `toModelOutput`). `agentSearchTools()` / `agentSearchFreeTools()` return a ToolSet; single tools via `webSearch()`, `extractPage()`, `renderPage()`, `searchAndRead()`, `newsSearch()`, `screenshot()`. Payment code shared with @agentsearchhq/langchain 0.5.0.
