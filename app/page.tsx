import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { ConditionPanel } from "@/components/ConditionPanel";
import { ActionCard } from "@/components/ActionCard";
import { ActionBrowser } from "@/components/ActionBrowser";
import { getCity, getFlaggedActions, getVerifiedActions, latestCheckDate, daysSince } from "@/lib/data";
import { fetchAir, fetchFlood, fetchWeather } from "@/lib/feeds";
import { activeConditions, airPanel, heatPanel, rainPanel } from "@/lib/conditions";

// Re-render at most once an hour. Feeds have their own cache windows too.
export const revalidate = 3600;

export default async function HomePage() {
  const city = getCity();
  const actions = getVerifiedActions();
  const flagged = getFlaggedActions();

  const [weather, air, flood] = await Promise.all([fetchWeather(city), fetchAir(city), fetchFlood(city)]);
  const panels = [heatPanel(weather), airPanel(air), rainPanel(weather, flood)];
  const active = activeConditions(panels);

  // Actions that match a live condition (not "any") come first.
  const matched = actions.filter((a) => a.when.some((w) => w !== "any" && active.includes(w)));
  const always = actions.filter((a) => a.when.includes("any") && !matched.includes(a));
  const today = [...matched, ...always].slice(0, 6);

  const checked = latestCheckDate(actions);
  const today_str = new Date().toLocaleDateString("en-CA", { timeZone: city.timezone, weekday: "long", month: "long", day: "numeric" });

  return (
    <>
      <SiteHeader city={city} current="home" />
      <main className="mx-auto max-w-5xl px-4 pb-20">
        <section className="pt-12 pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{today_str}</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">{city.name}, right now</h1>
          <p className="mt-3 max-w-2xl text-lg text-muted">{city.tagline}</p>
        </section>

        <section className="grid gap-4 md:grid-cols-3" aria-label="Live conditions">
          {panels.map((p) => (
            <ConditionPanel key={p.key} panel={p} />
          ))}
        </section>

        <section className="mt-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">What to do today</h2>
              <p className="mt-1 text-sm text-muted">
                {matched.length > 0
                  ? `${matched.length} action${matched.length === 1 ? "" : "s"} matched to today's conditions, then the ones that always apply.`
                  : "Nothing unusual today. These are the actions that always apply."}
              </p>
            </div>
            <a href="#actions" className="hidden text-sm text-accent underline underline-offset-4 md:block">See all {actions.length}</a>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {today.map((a) => (
              <ActionCard key={a.id} action={a} highlight={matched.includes(a)} />
            ))}
          </div>
        </section>

        <section id="actions" className="mt-16 scroll-mt-8">
          <h2 className="text-2xl font-semibold tracking-tight">All actions</h2>
          <p className="mt-1 mb-5 text-sm text-muted">
            Everything researched for {city.name}, {actions.length} programs across {new Set(actions.map((a) => a.category)).size} categories. Actions tied to a condition are labelled, and dimmed when that condition isn&apos;t happening today.
          </p>
          <ActionBrowser actions={actions} active={active} />
        </section>

        <section className="mt-16 rounded-2xl border border-line bg-card p-6">
          <h2 className="text-lg font-semibold">How this guide is checked</h2>
          <p className="mt-2 text-sm text-ink/80">
            Live readings come from public feeds and refresh about hourly. The actions were researched and put through three checks
            (schema, spot, freshness) before they went live.
            {checked && ` Last verified ${checked}, ${daysSince(checked)} days ago.`}
            {flagged.length > 0 && ` ${flagged.length} ${flagged.length === 1 ? "entry" : "entries"} failed a check and ${flagged.length === 1 ? "is" : "are"} listed, with reasons.`}
          </p>
          <Link href="/how-its-checked" className="mt-3 inline-block text-sm text-accent underline underline-offset-4">
            See the checks and the flagged entries
          </Link>
        </section>
      </main>
      <footer className="border-t border-line">
        <div className="mx-auto max-w-5xl px-4 py-6 text-xs text-muted">
          Built in Terra Studio. Every action links to its source. Check the source before you act on it.
        </div>
      </footer>
    </>
  );
}
