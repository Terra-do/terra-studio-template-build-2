// Live feeds. Each function fetches on the server and Next.js caches the
// result for `revalidate` seconds. The first visitor after the window
// triggers a fresh pull; everyone else gets the cached copy.
//
// Every function returns null on failure so one dead feed never breaks
// the page. The UI shows "unavailable" instead.

import type { City } from "./types";

const HOUR = 3600;

export interface AirReading {
  usAqi: number;
  pm25: number;
  time: string; // ISO, local to the city
}

export interface WeatherReading {
  temperature: number;
  feelsLike: number;
  feelsLikeMaxToday: number;
  rainTodayMm: number; // forecast total for today
  rainChanceMax: number | null; // % chance, max over today
  time: string;
}

export interface FloodReading {
  discharge: number; // m³/s, today
  dischargeMean: number; // long-term mean for this day of year
  date: string; // YYYY-MM-DD
}

export async function fetchAir(city: City): Promise<AirReading | null> {
  const url =
    `https://air-quality-api.open-meteo.com/v1/air-quality` +
    `?latitude=${city.latitude}&longitude=${city.longitude}` +
    `&current=us_aqi,pm2_5&timezone=${encodeURIComponent(city.timezone)}`;
  try {
    const res = await fetch(url, { next: { revalidate: HOUR } });
    if (!res.ok) return null;
    const json = await res.json();
    return {
      usAqi: Math.round(json.current.us_aqi),
      pm25: json.current.pm2_5,
      time: json.current.time,
    };
  } catch {
    return null;
  }
}

export async function fetchWeather(city: City): Promise<WeatherReading | null> {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${city.latitude}&longitude=${city.longitude}` +
    `&current=temperature_2m,apparent_temperature` +
    `&daily=apparent_temperature_max,precipitation_sum,precipitation_probability_max&forecast_days=1` +
    `&timezone=${encodeURIComponent(city.timezone)}`;
  try {
    const res = await fetch(url, { next: { revalidate: HOUR } });
    if (!res.ok) return null;
    const json = await res.json();
    return {
      temperature: json.current.temperature_2m,
      feelsLike: json.current.apparent_temperature,
      feelsLikeMaxToday: json.daily.apparent_temperature_max[0],
      rainTodayMm: json.daily.precipitation_sum?.[0] ?? 0,
      rainChanceMax: json.daily.precipitation_probability_max?.[0] ?? null,
      time: json.current.time,
    };
  } catch {
    return null;
  }
}

/**
 * River flood signal from Open-Meteo's flood API (GloFAS model, global).
 * Compares today's modelled river discharge near the city with the
 * long-term mean for this day of year. No key needed.
 */
export async function fetchFlood(city: City): Promise<FloodReading | null> {
  const url =
    `https://flood-api.open-meteo.com/v1/flood` +
    `?latitude=${city.latitude}&longitude=${city.longitude}` +
    `&daily=river_discharge,river_discharge_mean&forecast_days=1`;
  try {
    const res = await fetch(url, { next: { revalidate: 6 * HOUR } });
    if (!res.ok) return null;
    const json = await res.json();
    const d = json.daily?.river_discharge?.[0];
    const m = json.daily?.river_discharge_mean?.[0];
    if (typeof d !== "number" || typeof m !== "number") return null;
    return { discharge: d, dischargeMean: m, date: json.daily.time[0] };
  } catch {
    return null;
  }
}
