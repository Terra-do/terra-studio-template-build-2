import city from "@/data/city.json";
import verified from "@/data/verified.json";
import flagged from "@/data/flagged.json";
import type { Action, City } from "./types";

export function getCity(): City {
  return city as City;
}

export function getVerifiedActions(): Action[] {
  return (verified as Action[]).filter((a) => a.verification.status === "verified");
}

export function getFlaggedActions(): Action[] {
  return flagged as Action[];
}

/** Most recent lastChecked date across the verified set, as YYYY-MM-DD. */
export function latestCheckDate(actions: Action[]): string | null {
  const dates = actions.map((a) => a.verification.lastChecked).filter(Boolean).sort();
  return dates.length ? dates[dates.length - 1] : null;
}

export function daysSince(date: string): number {
  const then = new Date(date + "T00:00:00Z").getTime();
  return Math.max(0, Math.floor((Date.now() - then) / 86_400_000));
}
