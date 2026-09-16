import Link from "next/link";
import type { City } from "@/lib/types";

export function SiteHeader({ city, current }: { city: City; current: "home" | "checked" }) {
  const link = "text-sm text-muted hover:text-ink";
  const active = "text-sm text-ink underline underline-offset-4";
  return (
    <header className="border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-semibold tracking-tight">
          {city.name} <span className="text-muted font-normal">climate tracker</span>
        </Link>
        <nav className="flex gap-5">
          <Link href="/" className={current === "home" ? active : link}>Today</Link>
          <Link href="/#actions" className={link}>All actions</Link>
          <Link href="/how-its-checked" className={current === "checked" ? active : link}>How it&apos;s checked</Link>
        </nav>
      </div>
    </header>
  );
}
