import { SiteHeader } from "@/components/SiteHeader";
import { getCity, getFlaggedActions, getVerifiedActions, latestCheckDate, daysSince } from "@/lib/data";

export const metadata = { title: "How it's checked" };

export default function HowItsCheckedPage() {
  const city = getCity();
  const verified = getVerifiedActions();
  const flagged = getFlaggedActions();
  const checked = latestCheckDate(verified);
  const stale = verified.filter((a) => daysSince(a.verification.lastChecked) > 90).length;

  const stat = (n: string | number, label: string) => (
    <div className="rounded-2xl border border-line bg-card p-5">
      <p className="text-3xl font-semibold tracking-tight">{n}</p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  );

  return (
    <>
      <SiteHeader city={city} current="checked" />
      <main className="mx-auto max-w-5xl px-4 pb-20">
        <section className="pt-12 pb-8">
          <h1 className="text-4xl font-semibold tracking-tight">How this guide is checked</h1>
          <p className="mt-3 max-w-2xl text-lg text-muted">
            A guide is only useful if the things in it are real and still running. Here is what was checked, and what didn&apos;t make it.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          {stat(verified.length, "actions passed all checks")}
          {stat(flagged.length, "flagged and kept out")}
          {stat(checked ? `${daysSince(checked)}d` : "–", "since the last check")}
          {stat(stale, "older than 90 days")}
        </section>

        <section className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            ["Schema", "Every entry has all the required fields: title, summary, steps, sources, and when it applies. A missing field means the app can't use it."],
            ["Spot", "Each program was looked up on its official page. The title, who it's for, and what it offers had to match."],
            ["Freshness", "Is it still running? Closed, cancelled, or replaced programs get flagged, even if the page still exists."],
          ].map(([name, body]) => (
            <div key={name} className="rounded-2xl border border-line bg-card p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{name} check</p>
              <p className="mt-2 text-sm text-ink/85">{body}</p>
            </div>
          ))}
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold tracking-tight">Live readings</h2>
          <p className="mt-2 max-w-2xl text-sm text-ink/80">
            Heat, air and rain come from Open-Meteo, a public weather service that covers any location, and the river signal comes from its
            global flood model. No keys, no accounts. Each reading is cached for about an hour, and the page shows when it was taken. When a feed is down,
            its panel says so instead of showing an old number.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold tracking-tight">Flagged entries</h2>
          <p className="mt-2 mb-5 text-sm text-muted">Real programs that failed a check. They stay here so the record is visible.</p>
          {flagged.length === 0 ? (
            <p className="rounded-2xl border border-line bg-card p-5 text-sm text-muted">Nothing flagged yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {flagged.map((f) => (
                <article key={f.id} className="rounded-2xl border border-high/30 bg-card p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-semibold">{f.title}</h3>
                    <span className="text-xs text-muted">{f.category} · checked {f.verification.lastChecked}</span>
                  </div>
                  <p className="mt-2 text-sm text-high">{f.verification.flag_reason}</p>
                  <p className="mt-2 text-xs text-muted">
                    {f.sources.map((s, i) => (
                      <span key={s.url}>
                        {i > 0 && " · "}
                        <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{s.title}</a>
                      </span>
                    ))}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
