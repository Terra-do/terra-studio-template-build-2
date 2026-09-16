import type { Action, Condition } from "@/lib/types";
import { daysSince } from "@/lib/data";
import { CONDITION_LABELS, primaryCondition } from "@/lib/conditions";

export function ActionCard({
  action,
  highlight = false,
  active,
}: {
  action: Action;
  highlight?: boolean;
  /** Conditions active right now. When given, cards for conditions not in the list are dimmed. */
  active?: Condition[];
}) {
  const age = daysSince(action.verification.lastChecked);
  const stale = age > 90;
  // "any" means the action applies whatever the weather; a condition alongside
  // it only promotes the action on that day. Actions tagged solely to
  // conditions are labelled, and dimmed when none of those conditions is active.
  const primary = primaryCondition(action.when);
  const conditional = !action.when.includes("any");
  const appliesNow = !active || !conditional || action.when.some((w) => active.includes(w));
  return (
    <article className={`flex flex-col gap-3 rounded-2xl border bg-card p-5 ${highlight ? "border-accent/40 shadow-[0_1px_0_0_rgba(0,0,0,0.03)]" : "border-line"} ${appliesNow ? "" : "opacity-60"}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-muted">
            <span>{action.category}</span>
            {conditional && (
              <span className={`rounded-full px-2 py-0.5 normal-case tracking-normal ${appliesNow ? "bg-high-bg text-high" : "bg-unknown-bg text-muted"}`}>
                {CONDITION_LABELS[primary]}{active && !appliesNow ? " · not today" : ""}
              </span>
            )}
          </p>
          <h3 className="mt-1 text-lg font-semibold leading-snug">{action.title}</h3>
        </div>
        <span
          className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] ${stale ? "border-moderate/40 bg-moderate-bg text-moderate" : "border-line text-muted"}`}
          title={`Last verified ${action.verification.lastChecked}`}
        >
          {age === 0 ? "Verified today" : age === 1 ? "Verified yesterday" : `Verified ${age} days ago`}
        </span>
      </div>
      <p className="text-sm text-ink/85">{action.summary}</p>
      {action.details.length > 0 && (
        <details className="group">
          <summary className="cursor-pointer select-none text-sm font-medium text-accent">How to do it</summary>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink/80">
            {action.details.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </details>
      )}
      <p className="text-xs text-muted">
        {action.sources.map((s, i) => (
          <span key={s.url}>
            {i > 0 && " · "}
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ink">
              {s.title}
            </a>
          </span>
        ))}
      </p>
    </article>
  );
}
