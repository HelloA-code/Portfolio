import { albumTitle, getProject, type Project, type ResumeTrack } from "@/data/portfolio";
import { paletteFor } from "./seed";

export type CoverProps = { seed: string; title: string; label?: string; hue?: number; image?: string; variant?: "album" | "holo" };

export const projectCover = (p: Project): CoverProps => ({
  seed: p.slug,
  title: p.title,
  label: p.year ? `AKS · ${p.year}` : "AKS",
  hue: p.cover?.hue,
  image: p.cover?.image,
});

export const albumCover: CoverProps = { seed: "aditya-exe", title: albumTitle, label: "The Album", hue: 280, variant: "holo" };

/** Tracks tied to a project reuse its cover; the rest get their own. */
export function trackCover(t: ResumeTrack): CoverProps {
  const project = t.project ? getProject(t.project) : undefined;
  if (project) return projectCover(project);
  return { seed: t.id, title: t.title.replace(/\s*\(.*\)/, ""), label: albumTitle };
}

export const coverHue = (c: CoverProps) => paletteFor(c.seed, c.hue).hue;
