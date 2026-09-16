# City climate tracker

A one-city site that shows what the heat, the air and the rain are doing right now, and matches verified local actions to those conditions.

## Stack
- Next.js (App Router) with TypeScript. Tailwind v4 via `@tailwindcss/postcss`. No UI library, no database.
- Hosted on Vercel. Every push to `main` redeploys.
- Live feeds are fetched on the server in `lib/feeds.ts` and cached with `next: { revalidate }`. Nothing is fetched from the browser.

## Files
- `data/city.json`: the city (name, lat/long, timezone). Change this first.
- `data/verified.json`: actions that passed all three checks. The only actions the site shows.
- `data/flagged.json`: actions that failed a check, with a `flag_reason`. Shown on /how-its-checked, never as advice.
- `lib/types.ts`: the data schema. Don't change it without updating the research skill.
- `lib/feeds.ts`: one function per live feed (weather incl. rain, air, flood). Each returns `null` on failure. No keys by default.
- `lib/conditions.ts`: turns readings into levels (good/moderate/high/extreme) and conditions (`heat-high`, `air-high`, `flood-risk`...). Thresholds are documented there.
- `app/page.tsx`: today's readings, matched actions, all actions, checks summary.
- `app/how-its-checked/page.tsx`: the three checks, feed sources, flagged entries.
- `components/`: header, condition panel, action card, client-side action browser.

## Rules
- The default feeds need no keys. If you add a feed that needs one, it lives in `.env.local` (git-ignored) and in Vercel's environment variables. Never in code, never in `NEXT_PUBLIC_*`.
- Feeds are server-side only. A feed that fails must degrade to an "unavailable" panel, never crash the page.
- Don't add a public AI/chat feature. This site has no runtime AI on purpose.
- Style with Tailwind classes only. Colour tokens are in `app/globals.css`; add new ones there rather than hardcoding hex values.
- Keep the schema. If a feature needs a new field, say so and stop.
- Run `npm run build` before pushing. Vercel runs the same build.

## Local
`npm install`, then `npm run dev` and open http://localhost:3000.
