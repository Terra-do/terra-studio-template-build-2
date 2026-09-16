import type { Metadata } from "next";
import "./globals.css";
import { getCity } from "@/lib/data";

const city = getCity();

export const metadata: Metadata = {
  title: `${city.name}, right now`,
  description: city.tagline,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-paper text-ink antialiased">{children}</body>
    </html>
  );
}
