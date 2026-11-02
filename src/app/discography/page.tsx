import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { education, projects, semesters } from "@/data/portfolio";
import { projectCover } from "@/lib/covers";
import { CoverArt } from "@/components/music/CoverArt";
import { PageHeader } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Discography", description: "Education and releases on a timeline." };

type Entry = { year: number | null; kind: "Education" | "Release"; node: ReactNode; key: string };

export default function DiscographyPage() {
  const entries: Entry[] = [
    ...education.map((e) => ({
      key: e.title,
      year: e.end ?? e.start,
      kind: "Education" as const,
      node: (
        <>
          <p className="text-[17px] font-semibold">{e.title}</p>
          <p className="text-muted">{e.school}</p>
          <p className="mt-1 font-display text-[22px] font-bold text-cyan">{e.score}</p>
          {e.title.startsWith("B.Tech") && (
            <div className="mt-2 flex flex-wrap gap-2">
              {semesters.map((s) => (
                <span key={s.label} className="rounded-full border border-line bg-white/5 px-2.5 py-1 font-mono text-[11px]">
                  {s.label} · {s.cgpa}
                </span>
              ))}
            </div>
          )}
          <p className="mono-label mt-2">
            {e.start && e.end ? `${e.start}–${e.end}` : e.start ? `${e.start}–present · graduation TBA` : `Class of ${e.end}`}
          </p>
        </>
      ),
    })),
    ...projects.map((p) => ({
      key: p.slug,
      year: p.year,
      kind: "Release" as const,
      node: (
        <Link href={`/projects/${p.slug}`} className="group flex items-center gap-4">
          <CoverArt {...projectCover(p)} bare className="size-16 shrink-0 !rounded-lg" />
          <span>
            <span className="block text-[17px] font-semibold group-hover:text-pink">{p.title}</span>
            <span className="block text-muted">{p.subtitle}</span>
            <span className="mono-label block !text-[10px]">{p.status}</span>
          </span>
        </Link>
      ),
    })),
  ];

  const byYear = new Map<string, Entry[]>();
  for (const e of [...entries].sort((a, b) => (b.year ?? 0) - (a.year ?? 0))) {
    const k = e.year ? String(e.year) : "Undated";
    byYear.set(k, [...(byYear.get(k) ?? []), e]);
  }

  return (
    <>
      <PageHeader kicker="timeline" title="Discography">
        Every release, newest first.
      </PageHeader>
      <ol className="relative ml-3 border-l border-violet/40 pl-8">
        {[...byYear].map(([year, items]) => (
          <li key={year} className="mb-10">
            <span aria-hidden className="absolute -left-[7px] mt-2 size-3.5 rounded-full border-2 border-bg bg-pink shadow-[0_0_12px_rgba(255,45,117,0.8)]" />
            <h2 className="font-display text-[28px] font-bold tracking-tight">{year}</h2>
            <ul className="mt-3 space-y-3">
              {items.map((e) => (
                <li key={e.key} className="glass glow-border rounded-[var(--radius-card)] p-4">
                  <p className="mono-label mb-2 !text-[10px]">{`// ${e.kind}`}</p>
                  {e.node}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </>
  );
}
