import type { Metadata } from "next";
import Link from "next/link";
import { achievements, education, roles, semesters } from "@/data/portfolio";

export const metadata: Metadata = { title: "Case Files", description: "Education, records and roles as recovered documents." };

type Doc = { no: string; kind: string; title: string; lines: string[]; stamp: string; href?: string };

export default function FilesPage() {
  const docs: Doc[] = [
    ...education.map((e, i) => ({
      no: `ED-${String(i + 1).padStart(2, "0")}`,
      kind: "Academic record",
      title: e.title,
      lines: [
        e.school,
        `Result: ${e.score}`,
        e.start && e.end ? `Period: ${e.start}–${e.end}${e.ongoing ? " (ongoing)" : ""}` : `Year: ${e.end}`,
        ...(e.title.startsWith("B.Tech") ? [semesters.map((s) => `${s.label} ${s.cgpa}`).join(" · ")] : []),
      ],
      stamp: e.ongoing ? "Ongoing" : "Verified",
    })),
    // skip achievements that just repeat an education record
    ...achievements.filter((a) => !education.some((e) => e.title === a.title)).map((a, i) => ({
      no: `RC-${String(i + 1).padStart(2, "0")}`,
      kind: "Field record",
      title: a.title,
      lines: [a.detail],
      stamp: a.tag,
      href: a.href ? a.href.replace("/projects/", "/mission/inventory/") : undefined,
    })),
    ...roles.map((r, i) => ({
      no: `RL-${String(i + 1).padStart(2, "0")}`,
      kind: "Assignment",
      title: r.title,
      lines: [r.org, r.detail],
      stamp: "Filed",
    })),
  ];

  return (
    <>
      <header className="mb-8">
        <p className="h-label">Files</p>
        <h1 className="h-title mt-1 text-[clamp(30px,5vw,48px)]">Case files</h1>
        <p className="mt-2 max-w-2xl text-[14px] text-h-dim">Recovered documents: education, field records and assignments.</p>
      </header>

      <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {docs.map((d, i) => {
          const tilt = ["rotate-[-1.2deg]", "rotate-[0.8deg]", "rotate-[-0.4deg]", "rotate-[1.1deg]"][i % 4];
          const paper = (
            <article className={`h-paper flex h-full flex-col p-5 transition-transform duration-300 hover:rotate-0 hover:scale-[1.02] ${tilt}`}>
              <div className="flex items-start justify-between gap-3">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#6b543b]">
                  File {d.no} · {d.kind}
                </p>
                <span className="h-stamp shrink-0 text-[11px]">{d.stamp}</span>
              </div>
              <h2 className="h-title mt-3 text-[19px] text-[#2b221a]">{d.title}</h2>
              <div className="mt-3 space-y-1.5 border-t border-dashed border-[#8a7556]/60 pt-3">
                {d.lines.map((l) => (
                  <p key={l} className="text-[14px] leading-snug text-[#3b2f24]">
                    {l}
                  </p>
                ))}
              </div>
              {d.href && <p className="mt-auto pt-4 text-[12px] uppercase tracking-[0.16em] text-[#8a1d18]">See related item →</p>}
            </article>
          );
          return <li key={d.no}>{d.href ? <Link href={d.href}>{paper}</Link> : paper}</li>;
        })}
      </ul>
    </>
  );
}
