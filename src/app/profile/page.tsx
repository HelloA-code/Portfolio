import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight, Download, MapPin, Plus } from "lucide-react";
import { education, profile, projects, roles, skills, socials, sortedByRelease } from "@/data/portfolio";
import { projectCover } from "@/lib/covers";
import { AlbumCard } from "@/components/music/AlbumCard";
import { CoverArt } from "@/components/music/CoverArt";
import { PlayTrackButton } from "@/components/music/PlayerControls";
import { ResumeTracklist } from "@/components/music/ResumeTracklist";
import { ShareMenu } from "@/components/music/ShareMenu";
import { Avatar } from "@/components/ui/Avatar";
import { pill } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Profile",
  description: `${profile.name}: ${profile.tagline}.`,
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const releaseLabel = (iso: string | null) => (iso ? `${MONTHS[Number(iso.slice(5, 7)) - 1]} ${iso.slice(0, 4)}` : "TBA");

/** Card with its heading inside, so every block on the page lines up */
function Panel({ kicker, title, href, className = "", children }: { kicker: string; title: string; href?: string; className?: string; children: ReactNode }) {
  return (
    <section className={`glass hud flex min-w-0 flex-col rounded-[var(--radius-card)] p-5 sm:p-6 ${className}`}>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="mono-label !text-[10px]">{kicker}</p>
          <h2 className="mt-0.5 text-[20px] font-bold tracking-tight">{title}</h2>
        </div>
        {href && (
          <Link href={href} className="shrink-0 text-sm font-medium text-pink hover:underline">
            See All
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

/** Artist page: big portrait hero, stats, top songs, latest release, albums, about. */
export default function ProfilePage() {
  const degree = education[0];
  const linkedin = socials.find((s) => s.label === "LinkedIn")?.href;
  const latest = sortedByRelease().find((p) => p.released && p.status === "Released") ?? projects[0];
  const hackathons = projects.filter((p) => p.categories.includes("Hackathon")).length;
  const portrait = profile.portrait ?? profile.photo;

  const stats = [
    { value: degree.score.replace("CGPA ", ""), label: "CGPA" },
    { value: String(projects.length), label: "Albums" },
    { value: String(hackathons), label: "Hackathon builds" },
    { value: String(skills.reduce((n, g) => n + g.skills.length, 0)), label: "Skills" },
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Hero */}
      <section className="relative -mx-4 -mt-6 overflow-hidden sm:-mx-8 lg:mx-0 lg:-mt-2 lg:rounded-[28px]">
        <div className="relative h-[min(78vh,640px)] lg:h-[480px]">
          {portrait && (
            <div className="absolute inset-0 lg:left-auto lg:w-[62%] lg:[mask-image:linear-gradient(to_right,transparent,black_35%)]">
              <Image src={portrait} alt={`Photo of ${profile.name}`} fill priority sizes="(max-width: 1024px) 100vw, 700px" className="object-cover object-[50%_25%]" />
            </div>
          )}
          {/* fades into the page, like a music app artist header */}
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
          <div aria-hidden className="absolute inset-0 hidden bg-gradient-to-r from-bg via-bg/70 to-transparent lg:block" />
          <div aria-hidden className="absolute -left-20 bottom-0 size-96 rounded-full bg-violet/30 blur-[100px]" />

          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 lg:max-w-[58%] lg:p-10">
            <p className="mono-label mb-2 flex items-center gap-1.5 !text-fg/80">
              <span className="rounded-full bg-pink px-2 py-0.5 !text-[10px] font-semibold tracking-wider text-white">Artist</span>
              <MapPin size={12} /> {profile.location}
            </p>
            <h1 className="page-title text-[clamp(42px,9vw,72px)] lg:text-[clamp(48px,5vw,68px)] [text-shadow:0_4px_30px_rgba(0,0,0,0.5)]">{profile.name}</h1>
            <p className="mt-2 max-w-xl text-[15px] text-fg/80 sm:text-base">{profile.tagline}</p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <PlayTrackButton trackId="boot-sequence" label="Play" className={`${pill.primary} play-glow`} />
              {linkedin && (
                <a href={linkedin} target="_blank" rel="noopener noreferrer" className={pill.secondary}>
                  <Plus size={17} /> Follow
                </a>
              )}
              <a href={profile.resume} download aria-label="Download resume" className="glass grid size-11 place-items-center rounded-full hover:bg-white/10">
                <Download size={18} />
              </a>
              <ShareMenu title={profile.name} />
            </div>
          </div>
        </div>
      </section>

      {/* Highlights: one strip with hairline dividers */}
      <section aria-label="Highlights" className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-[#0a0a12] px-5 py-4">
            <p className="font-display text-[32px] font-bold leading-none tracking-tight">{s.value}</p>
            <p className="mono-label mt-2 !text-[10px]">{s.label}</p>
          </div>
        ))}
      </section>

      {/* Bento grid: rows of equal-height cards */}
      <div className="grid gap-4 lg:grid-cols-12 lg:gap-5">
        <Panel kicker="// ADITYA.EXE" title="Top Songs" href="/" className="lg:col-span-7">
          <ResumeTracklist limit={5} columns={1} />
        </Panel>

        <Panel kicker="// latest release" title="Latest Release" className="lg:col-span-5">
          <Link href={`/projects/${latest.slug}`} className="group flex flex-1 items-center gap-5 sm:flex-col sm:items-start lg:flex-row lg:items-center xl:flex-col xl:items-start">
            <CoverArt {...projectCover(latest)} className="w-28 shrink-0 sm:w-44 lg:w-36 xl:w-44" />
            <span className="min-w-0">
              <span className="mono-label block !text-[10px]">{releaseLabel(latest.released)}</span>
              <span className="mt-1 block text-[20px] font-bold leading-tight tracking-tight group-hover:text-pink">{latest.title}</span>
              <span className="mt-1 line-clamp-2 block text-sm text-muted">{latest.subtitle}</span>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-pink">
                Open album <ChevronRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </span>
          </Link>
        </Panel>

        <Panel kicker="// discography" title="Albums" href="/albums" className="lg:col-span-12">
          <div className="shelf -mx-5 px-5 [grid-auto-columns:minmax(140px,42%)] sm:-mx-6 sm:px-6 sm:[grid-auto-columns:170px] lg:mx-0 lg:grid-flow-row lg:grid-cols-3 lg:gap-5 lg:overflow-visible lg:px-0 xl:grid-cols-6">
            {projects.map((p) => (
              <AlbumCard key={p.slug} project={p} />
            ))}
          </div>
        </Panel>

        <Panel kicker="// about" title={`About ${profile.shortName}`} className="lg:col-span-7">
          <Link href="/about" className="group flex flex-1 flex-col">
            <div className="flex items-center gap-4">
              <Avatar size={60} />
              <div className="min-w-0">
                <p className="truncate text-[17px] font-semibold">{profile.name}</p>
                <p className="truncate text-sm text-muted">{degree.title}</p>
              </div>
            </div>
            <p className="mt-4 line-clamp-5 text-[15px] leading-relaxed text-fg/85">{profile.bio.slice(1, 5).join(" ")}</p>
            <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-pink">
              Read the lyrics <ChevronRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </Panel>

        <Panel kicker="// artist info" title="Details" className="lg:col-span-5">
          <dl className="divide-y divide-line/70 text-[14px]">
            {(
              [
                ["Based in", profile.location],
                ["Studying", `${degree.title}, ${degree.school}`],
                ["Years", `${degree.start}–${degree.end}`],
                ["Building", profile.currentlyBuilding],
              ] as const
            ).map(([k, v]) => (
              <div key={k} className="grid grid-cols-[96px_minmax(0,1fr)] gap-3 py-2.5 first:pt-0 last:pb-0">
                <dt className="mono-label pt-0.5 !text-[10px]">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {skills.map((g) => (
              <Link key={g.slug} href={`/genres/${g.slug}`} className="rounded-full border border-line bg-white/5 px-2.5 py-1 text-[12px] hover:bg-white/10">
                {g.name}
              </Link>
            ))}
          </div>
        </Panel>

        <Panel kicker="// featured on" title="Appears On" href="/featured-on" className="lg:col-span-12">
          <div className="grid gap-3 sm:grid-cols-2">
            {roles.map((r) => (
              <div key={r.title} className="flex items-center gap-4 rounded-xl border border-line bg-white/[0.03] p-3">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-cyan via-violet to-pink font-display text-lg font-bold">
                  {r.org[0]}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{r.title}</span>
                  <span className="block truncate text-sm text-muted">{r.org}</span>
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
