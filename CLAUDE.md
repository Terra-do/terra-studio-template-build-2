# City climate tracker

A one-city site that shows what the heat, the air and the rain are doing right now, and matches verified local actions to those conditions.

This repo is Terra Studio's reference for Build 2. If a learner has pointed you here from their own empty project, read START-HERE.md and the Learning mode section below, and write their code fresh rather than copying these files.

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

## Learning mode (for anyone building their own version)
This repo is the reference for Terra Studio's Build 2. Learners build their own tracker from scratch in an empty folder and point Claude Code here for patterns. If you are helping someone do that:
- Copy these rules and this section into the learner's own CLAUDE.md in the first step, so they carry through the whole build.
- Before each step, say in two or three lines what you're about to do and why, then wait for the learner to say go.
- After each step, name the files you created or changed, and ask one short question that checks they understood the step (for example "Which file would you change to move the tracker to another city?"). Don't quiz more than once per step.
- If the learner asks you to just do it, do it, and still name what changed.
- Use this repo for the data schema, the feed pattern and the rules. Don't clone it or copy files wholesale; write the learner's code fresh and let their design differ.
- Use the package manager the learner chose. Tell them the command to start the dev server and let them run it in their own terminal.
