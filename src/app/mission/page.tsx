import Image from "next/image";
import Link from "next/link";
import { Briefcase, Check, Paperclip } from "lucide-react";
import { achievements, education, profile, projects, skills } from "@/data/portfolio";
import { HPlayButton } from "@/components/horror/HPlayButton";

export default function BriefingPage() {
  const degree = education[0];
  const objectives = [
    { done: true, text: `${degree.title}, ${degree.school} · ${degree.score}` },
    ...achievements.filter((a) => a.href).map((a) => ({ done: true, text: `${a.title}: ${a.detail}` })),
    { done: false, text: `In progress: ${profile.currentlyBuilding}` },
  ];
  const stats = [
    { k: "Items", v: projects.length },
    { k: "Skills", v: skills.reduce((n, g) => n + g.skills.length, 0) },
    { k: "CGPA", v: degree.score.replace("CGPA ", "") },
  ];

  return (
    <div className="space-y-10">
      {/* Title card */}
      <section className="relative pt-6 text-center sm:pt-14">
        <p className="h-label">Case file AKS-0001 · {profile.location}</p>
        <h1 className="h-title mx-auto mt-4 max-w-4xl text-[clamp(38px,8vw,92px)] text-h-ink [text-shadow:0_0_40px_rgba(163,32,28,0.45),0_4px_20px_rgba(0,0,0,0.9)]">
          {profile.name}
        </h1>
        <div className="mx-auto mt-4 h-px w-48 bg-gradient-to-r from-transparent via-h-blood to-transparent" />
        <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-h-dim sm:text-base">{profile.tagline}</p>
        <p className="mt-6 text-[13px] uppercase tracking-[0.2em] text-h-amber">Objective: recruit this engineer</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/mission/inventory" className="h-btn h-btn-blood">
            <Briefcase size={16} /> Begin mission
          </Link>
          <HPlayButton trackId="boot-sequence" label="Play briefing" />
        </div>
      </section>

      {/* Dossier + objectives */}
      <section className="grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
        <div className="h-paper p-5 sm:p-6">
          <Paperclip aria-hidden size={34} className="absolute -top-4 left-8 rotate-[-20deg] text-zinc-400 drop-shadow" />
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#5a4632]">Subject</p>
              <p className="h-title mt-1 text-[22px] text-[#2b221a]">{profile.name}</p>
            </div>
            <span className="h-stamp text-[13px]">Recruit</span>
          </div>
          {profile.photo && (
            <div className="relative mx-auto mt-5 aspect-square w-full max-w-[260px] overflow-hidden border-[6px] border-[#f2ead8] shadow-lg">
              <Image src={profile.photo} alt={`Photo of ${profile.name}`} fill sizes="260px" className="object-cover [filter:sepia(0.45)_contrast(1.05)_saturate(0.75)]" />
            </div>
          )}
          <dl className="mt-5 grid grid-cols-3 gap-2 text-center">
            {stats.map((s) => (
              <div key={s.k} className="border border-[#8a7556]/40 py-2">
                <dd className="h-title text-[22px] text-[#2b221a]">{s.v}</dd>
                <dt className="text-[10px] uppercase tracking-[0.18em] text-[#5a4632]">{s.k}</dt>
              </div>
            ))}
          </dl>
        </div>

        <div className="h-panel p-5 sm:p-7">
          <p className="h-label">Mission objectives</p>
          <ul className="mt-4 space-y-3">
            {objectives.map((o) => (
              <li key={o.text} className="flex items-start gap-3 border-b border-h-line/60 pb-3 last:border-0">
                <span
                  className={`mt-0.5 grid size-5 shrink-0 place-items-center border ${o.done ? "border-h-green/70 text-h-green" : "border-h-amber/60 text-h-amber"}`}
                  aria-label={o.done ? "Complete" : "In progress"}
                >
                  {o.done ? <Check size={13} /> : <span className="size-1.5 animate-pulse rounded-full bg-h-amber" />}
                </span>
                <span className={`text-[15px] leading-snug ${o.done ? "text-h-ink" : "text-h-amber"}`}>{o.text}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { href: "/mission/inventory", label: "Open inventory", note: `${projects.length} items` },
              { href: "/mission/files", label: "Read case files", note: "Education & records" },
              { href: "/mission/safe-room", label: "Safe room", note: "Save resume · contact" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="group border border-h-line bg-black/30 p-3 transition-colors hover:border-h-amber/60 hover:bg-black/50">
                <span className="block text-[13px] uppercase tracking-[0.14em] text-h-ink group-hover:text-h-amber">{l.label}</span>
                <span className="block text-[12px] text-h-faint">{l.note}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
