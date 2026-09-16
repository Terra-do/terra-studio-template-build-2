import type { Panel } from "@/lib/conditions";

const tone: Record<Panel["level"], { ring: string; chip: string; dot: string }> = {
  good: { ring: "border-good/30 bg-good-bg", chip: "bg-good text-white", dot: "bg-good" },
  moderate: { ring: "border-moderate/30 bg-moderate-bg", chip: "bg-moderate text-white", dot: "bg-moderate" },
  high: { ring: "border-high/30 bg-high-bg", chip: "bg-high text-white", dot: "bg-high" },
  extreme: { ring: "border-extreme/30 bg-extreme-bg", chip: "bg-extreme text-white", dot: "bg-extreme" },
  unknown: { ring: "border-line bg-unknown-bg", chip: "bg-unknown text-white", dot: "bg-unknown" },
};

export function ConditionPanel({ panel }: { panel: Panel }) {
  const t = tone[panel.level];
  return (
    <section className={`flex flex-col gap-3 rounded-2xl border p-5 ${t.ring}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">{panel.label}</span>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${t.chip}`}>{panel.headline}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-5xl font-semibold tracking-tight">{panel.value}</span>
        <span className="text-sm text-muted">{panel.unit}</span>
      </div>
      <p className="text-sm text-ink/80">{panel.detail}</p>
      {panel.note && <p className="text-xs text-muted">{panel.note}</p>}
      {panel.observedAt && (
        <p className="text-xs text-muted">
          <span className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle ${t.dot}`} />
          Reading from {formatObserved(panel.observedAt)}
        </p>
      )}
    </section>
  );
}

function formatObserved(iso: string): string {
  // Open-Meteo returns local time without an offset; the flood feed returns a date.
  const m = iso.match(/T(\d{2}:\d{2})/);
  return m ? `${m[1]} local` : iso;
}
