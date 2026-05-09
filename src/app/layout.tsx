import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://indiskaai.com"),
  title: {
    default: "IndiskaAI — Generative Intelligence for Molecular Discovery",
    template: "%s — IndiskaAI",
  },
  description:
    "IndiskaAI builds AI systems for structural biology and drug discovery — accelerating the path from sequence to therapeutic.",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "IndiskaAI",
    description:
      "Generative intelligence for molecular discovery. Structural biology, foundation models, and rational design.",
    type: "website",
    siteName: "IndiskaAI",
  },
  twitter: {
    card: "summary_large_image",
    title: "IndiskaAI",
    description:
      "Generative intelligence for molecular discovery.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
