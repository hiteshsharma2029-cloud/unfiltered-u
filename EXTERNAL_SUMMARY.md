# External Review Summary — setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in:
   - `TAVILY_API_KEY` (web search, tavily.com)
   - `GEMINI_API_KEY` (summaries, aistudio.google.com/apikey)
3. Terminal 1: `npm run server`  (API on :8787)
   Terminal 2: `npm run dev`     (Vite proxies /api to :8787)

Without keys the UI shows "Not connected" and no results.
Production: deploy `server/` somewhere with the env vars set, route `/api` to it
(or set `VITE_API_BASE` to its URL and allow CORS). Replace the in-memory
rate limit/cache in `server/index.js` with Redis or similar.
