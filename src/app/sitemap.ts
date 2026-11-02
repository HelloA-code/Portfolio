import type { MetadataRoute } from "next";
import { profile, projects, skills } from "@/data/portfolio";
import { allNavItems } from "@/lib/nav";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? profile.siteUrl;

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...allNavItems.map((n) => n.href),
    ...projects.map((p) => `/projects/${p.slug}`),
    ...skills.map((g) => `/genres/${g.slug}`),
  ];
  return paths.map((path) => ({ url: `${base}${path === "/" ? "" : path}`, changeFrequency: "monthly", priority: path === "/" ? 1 : 0.7 }));
}
