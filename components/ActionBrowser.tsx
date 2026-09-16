"use client";

import { useMemo, useState } from "react";
import type { Action, Condition } from "@/lib/types";
import { ActionCard } from "./ActionCard";

export function ActionBrowser({ actions, active }: { actions: Action[]; active: Condition[] }) {
  const categories = useMemo(() => [...new Set(actions.map((a) => a.category))], [actions]);
  const [category, setCategory] = useState<string>("All");
  const [query, setQuery] = useState("");

  const shown = actions.filter((a) => {
    if (category !== "All" && a.category !== category) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return [a.title, a.summary, ...a.details, a.category].join(" ").toLowerCase().includes(q);
  });

  const chip = (label: string, count: number) => {
    const on = category === label;
    return (
      <button
        key={label}
        type="button"
        onClick={() => setCategory(label)}
        className={`rounded-full border px-3 py-1 text-sm transition-colors ${on ? "border-ink bg-ink text-paper" : "border-line bg-card text-ink hover:border-ink/40"}`}
      >
        {label} <span className={on ? "text-paper/70" : "text-muted"}>{count}</span>
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {chip("All", actions.length)}
          {categories.map((c) => chip(c, actions.filter((a) => a.category === c).length))}
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search actions"
          className="w-full rounded-full border border-line bg-card px-4 py-1.5 text-sm outline-none focus:border-ink/40 md:w-64"
        />
      </div>
      {shown.length === 0 ? (
        <p className="rounded-2xl border border-line bg-card p-5 text-sm text-muted">Nothing matches. Try another word or category.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {shown.map((a) => (
            <ActionCard key={a.id} action={a} active={active} />
          ))}
        </div>
      )}
    </div>
  );
}
