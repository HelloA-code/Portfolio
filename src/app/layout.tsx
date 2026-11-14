import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { profile, socials } from "@/data/portfolio";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { PlayerBootstrap } from "@/components/layout/PlayerBootstrap";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const space = Space_Grotesk({ variable: "--font-space", subsets: ["latin"], weight: ["500", "700"] });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], weight: ["400", "500"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? profile.siteUrl;
const description = `${profile.name}: ${profile.tagline}. Press play on ADITYA.EXE, a resume you can listen to.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${profile.name} · The Discography`, template: `%s · ${profile.name}` },
  description,
  applicationName: "ADITYA.EXE",
  authors: [{ name: profile.name }],
  openGraph: { type: "website", siteName: profile.name, title: `${profile.name} · The Discography`, description, url: "/" },
  twitter: { card: "summary_large_image", title: `${profile.name} · The Discography`, description },
};

export const viewport: Viewport = {
  themeColor: "#05050a",
  colorScheme: "dark",
  viewportFit: "cover",
};

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: siteUrl,
  email: `mailto:${profile.email}`,
  jobTitle: "Software Engineering Student",
  ...(profile.photo ? { image: `${siteUrl}${profile.photo}` } : {}),
  address: { "@type": "PostalAddress", addressLocality: "Pune", addressRegion: "Maharashtra", addressCountry: "IN" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "VIT Pune" },
  sameAs: socials.flatMap((s) => (s.href && s.href.startsWith("http") ? [s.href] : [])),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${space.variable} ${jetbrains.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
        <a href="#main" className="sr-only z-[100] rounded-lg bg-fg px-4 py-2 text-bg focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          Skip to content
        </a>
        {children}
        <CommandPalette />
        <PlayerBootstrap />
      </body>
    </html>
  );
}
