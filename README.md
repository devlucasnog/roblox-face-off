# Roblox Face-Off

Compare two Roblox players side by side and see who wins the face-off. Type two
usernames, and the app pulls their public stats — friends, followers, following
and groups — scores each category and declares a winner.

> **Screenshot:** _add one here once you're happy with the final design._

## Stack

| Tool | Why |
|---|---|
| **React 19** | `useActionState` handles the form submission, pending state and result in one place, without a manual `onSubmit` + `preventDefault` dance |
| **TypeScript** | The Roblox API returns deeply nested data from five different hosts — types catch shape mistakes at write time instead of runtime |
| **Vite** | Fast dev server and build |
| **Tailwind CSS 4** | Configured through `@tailwindcss/vite`, no `postcss.config` needed |
| **Motion** | `AnimatePresence` + `layout` for the form ↔ result transition |
| **Vercel Functions** | Serverless proxy for the Roblox API (see below) |

## Running locally

The app has a serverless function at `api/battle.ts`, which plain `vite` does
not know how to execute. Use the Vercel CLI so the frontend and the API run
together:

```bash
npm install
npx vercel link   # first time only
npm run dev:api   # Vite + serverless functions
```

`npm run dev` still works for pure UI work, but `/api/battle` will 404.

| Script | What it does |
|---|---|
| `npm run dev` | Vite only — frontend, no API |
| `npm run dev:api` | `vercel dev` — frontend **and** the serverless function |
| `npm run build` | Production build |
| `npm run lint` | ESLint |

## Architecture decisions

**Why a serverless function instead of calling Roblox from the browser.**
The Roblox API does not send CORS headers, so a direct `fetch` from the page is
blocked. A Vite dev proxy would fix development but disappears in the production
build, so the call lives in a Vercel Function — server-to-server requests have
no CORS restriction, and the same code works locally and in production.

**Why the API responses are validated.**
Roblox answers failed requests with `{ errors: [...] }` and a non-2xx status,
while still returning valid JSON. Without checking `response.ok`, a missing
field silently falls back to `0` and the UI confidently displays wrong numbers.
`fetchJson` in `api/_lib/roblox.ts` turns those into real errors instead.

**Why `mode="popLayout"` on `AnimatePresence`.**
The form and the result card have different heights, so swapping them moves the
header. With the default `mode="wait"` the outgoing card holds its space until
its exit finishes, so the container resizes in a single frame and the header
snaps. `popLayout` takes the exiting card out of the layout immediately, letting
the `layout` animation interpolate the real distance.

## Project structure

```
api/
  battle.ts          # HTTP handler: validates input, maps errors to statuses
  _lib/roblox.ts     # Roblox API client (ignored by Vercel routing via `_`)
src/
  components/        # Presentational components
  hooks/useBattle.ts # Form state, validation and the request to /api/battle
  utils/             # Pure functions: score calculation, number formatting
  types/player.ts    # Types shared between the function and the frontend
```

## Known limitations

- **Badges are not shown.** `badges.roblox.com` started requiring
  authentication (`401 Authentication token is missing`), and there is no public
  alternative, so the badge count was replaced by the "Following" stat.
- **No caching.** Every battle makes 12 requests to Roblox (6 per player).
  Roblox rate-limits aggressively, so heavy use can hit a 502.
