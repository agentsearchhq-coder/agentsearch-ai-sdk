# Changelog

## 0.1.2 (2026-11-15)
- Direct x402 list prices now match the live API (approved 2026-11-15): search and news $0.003, extract $0.002, render $0.005, screenshot $0.004, search_and_read $0.005. Runtime price constants, tool text, docs and tests updated. Pocket route remains $0.005. The per-call ceiling stays $0.020.

## 0.1.1 (2026-11-13)

Fix: one-character queries are now rejected client-side (the free relay answers them with HTTP 400 `QUERY_TOO_SHORT`), so agents no longer burn requests on them, and any relay 4xx now comes back as a clear "fix the input, don't retry unchanged" message instead of a bare HTTP error.

## 0.1.0 (2026-11-13)

First release. Vercel AI SDK (ai 5-7) tools for AgentSearch: `agentsearch_search` (free, no key), `agentsearch_extract` and `agentsearch_render` (free no-wallet trial, then x402), and pay-per-call `agentsearch_search_and_read` ($0.009), `agentsearch_news_search` ($0.008) and `agentsearch_screenshot` ($0.010, image bytes kept out of model context via `toModelOutput`). `agentSearchTools()` / `agentSearchFreeTools()` return a ToolSet; single tools via `webSearch()`, `extractPage()`, `renderPage()`, `searchAndRead()`, `newsSearch()`, `screenshot()`. Payment code shared with @agentsearchhq/langchain 0.5.0.
