import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { sortedByRelease } from "@/data/portfolio";
import { projectCover } from "@/lib/covers";
import { CoverArt } from "@/components/music/CoverArt";
import { PageHeader } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Albums", description: "Library of projects, newest first." };

export default function AlbumsPage() {
  return (
    <>
      <PageHeader kicker="library" title="Albums" />
      <ul className="divide-y divide-line/70">
        {sortedByRelease().map((p) => (
          <li key={p.slug}>
            <Link href={`/projects/${p.slug}`} className="group flex items-center gap-4 rounded-xl px-2 py-3 transition-colors hover:bg-white/5">
              <CoverArt {...projectCover(p)} bare className="size-16 shrink-0 !rounded-lg" />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold">{p.title}</span>
                <span className="block truncate text-sm text-muted">{p.subtitle}</span>
                <span className="mono-label mt-0.5 block !text-[10px]">
                  {p.genre} · {p.year ?? "TBA"} · {p.status}
                </span>
              </span>
              <ChevronRight size={18} className="text-faint group-hover:text-fg" />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
