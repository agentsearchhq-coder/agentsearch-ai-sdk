# Changelog

## 0.1.0 (2026-11-13)

First release. Vercel AI SDK (ai 5-7) tools for AgentSearch: `agentsearch_search` (free, no key), `agentsearch_extract` and `agentsearch_render` (free no-wallet trial, then x402), and pay-per-call `agentsearch_search_and_read` ($0.009), `agentsearch_news_search` ($0.008) and `agentsearch_screenshot` ($0.010, image bytes kept out of model context via `toModelOutput`). `agentSearchTools()` / `agentSearchFreeTools()` return a ToolSet; single tools via `webSearch()`, `extractPage()`, `renderPage()`, `searchAndRead()`, `newsSearch()`, `screenshot()`. Payment code shared with @agentsearchhq/langchain 0.5.0.
