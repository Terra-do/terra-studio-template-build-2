# City climate tracker

What the heat, the air and the rain are doing in one city right now, and what you can do about it today. Live readings from public feeds, matched to a set of local actions that were checked before they went live.

This is the starter for **Build 2** in Terra Studio, Week 7. It ships with Toronto so you can see it working. You'll swap in your own city and your own verified actions.

**Start your own:** click **Use this template → Create a new repository** at the top of [this repo](https://github.com/Terra-do/terra-studio-template-build-2). That gives you your own copy on GitHub. Clone *your* repo, not this one, so your pushes go to your site.

**Live example:** [terra-studio-template-build-2.vercel.app](https://terra-studio-template-build-2.vercel.app/), Terra's Toronto version.

## What's in it

- **Today:** three panels, heat, air, and rain and flood, with a plain-language read of each and the time the reading was taken.
- **What to do today:** actions matched to the current conditions come first, then the ones that always apply.
- **All actions:** every verified program, filterable by category, searchable.
- **How it's checked:** the three checks, where the live data comes from, and the entries that failed a check, with reasons.

No AI runs on the site. AI did the research (Cowork) and wrote the code (Claude Code). The site itself is plain and fast.

## Where the live data comes from

| Panel | Source | Key needed |
|---|---|---|
| Heat | [Open-Meteo](https://open-meteo.com/) forecast API: current and feels-like temperature, today's peak | No |
| Air | [Open-Meteo](https://open-meteo.com/) air quality API: US AQI and PM2.5 from a global model | No |
| Rain and flood | Open-Meteo forecast API (today's rain) and [flood API](https://open-meteo.com/en/docs/flood-api) (river discharge vs normal, from the GloFAS model) | No |

All three cover any location on Earth. Readings are fetched on the server and cached (an hour for weather and air, six hours for the river signal). The first visitor after that triggers a fresh pull.

Want a fourth panel, like your grid's carbon intensity or your city's bike share? Follow the pattern in `lib/feeds.ts` and `lib/conditions.ts`. If the feed needs a key, put it in `.env.local` and in Vercel, never in code.

## Run it locally

You need Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000. All three panels work immediately; nothing to configure.

## Make it your city

1. Edit `data/city.json`: name, country, latitude, longitude and timezone.
2. Run the City Climate Tracker research skill in Cowork for your city. It produces `verified.json` and `flagged.json` in the format this site expects, with each action tagged to the conditions it applies to.
3. Replace the two files in `data/`.
4. `npm run dev` and check the page.

## Deploy

1. Push to a public GitHub repository.
2. At [vercel.com](https://vercel.com), sign in with GitHub, choose **Add New → Project**, import the repo, and deploy. Vercel detects Next.js; leave the defaults.

Every later push to `main` updates the live site.

## Data format

Each action in `data/verified.json`:

```json
{
  "id": "toronto-heat-01",
  "city": "Toronto",
  "category": "Heat",
  "title": "Find a cool space near you",
  "summary": "One or two sentences: what this is and who it's for.",
  "details": ["Two to five steps or specifics"],
  "when": ["heat-high", "heat-extreme"],
  "sources": [{ "title": "City of Toronto: Cool Spaces Near You", "url": "https://..." }],
  "verification": { "status": "verified", "lastChecked": "2026-09-16", "method": "schema+spot+freshness" }
}
```

`when` values: `any`, `heat-high`, `heat-extreme`, `cold-extreme`, `air-moderate`, `air-high`, `rain-heavy`, `flood-risk`. Flagged entries use `"status": "flagged"` and add `"flag_reason"`.

## About the Toronto data

Checked against official pages on 2026-09-16. Programs change; treat the entries as an example of the format and check the source before relying on one.
