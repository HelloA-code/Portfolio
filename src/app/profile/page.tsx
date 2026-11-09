import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Download, MapPin, Plus } from "lucide-react";
import { education, profile, projects, roles, skills, socials, sortedByRelease } from "@/data/portfolio";
import { projectCover } from "@/lib/covers";
import { AlbumCard } from "@/components/music/AlbumCard";
import { CoverArt } from "@/components/music/CoverArt";
import { PlayTrackButton } from "@/components/music/PlayerControls";
import { ResumeTracklist } from "@/components/music/ResumeTracklist";
import { ShareMenu } from "@/components/music/ShareMenu";
import { Avatar } from "@/components/ui/Avatar";
import { GlassCard, pill, SectionTitle } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Profile",
  description: `${profile.name}: ${profile.tagline}.`,
};

const shelf = "shelf -mx-4 px-4 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0 [grid-auto-columns:minmax(150px,42%)] sm:[grid-auto-columns:200px]";

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
    <div className="space-y-12">
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

      {/* Stats */}
      <section aria-label="Highlights" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="glass glow-border rounded-[var(--radius-card)] px-4 py-3">
            <p className="font-display text-[30px] font-bold leading-none tracking-tight">{s.value}</p>
            <p className="mono-label mt-1.5 !text-[10px]">{s.label}</p>
          </div>
        ))}
      </section>

      {/* Latest release + top songs */}
      <section className="grid gap-8 lg:grid-cols-[300px_1fr]">
        <div>
          <SectionTitle kicker="// latest release" title="Latest Release" />
          <Link href={`/projects/${latest.slug}`} className="group glass glow-border flex items-center gap-4 rounded-[var(--radius-card)] p-3 lg:flex-col lg:items-start">
            <CoverArt {...projectCover(latest)} className="w-24 shrink-0 lg:w-full" />
            <span className="min-w-0">
              <span className="mono-label block !text-[10px]">{latest.released ? new Date(`${latest.released}-01`).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "TBA"}</span>
              <span className="block truncate text-[17px] font-semibold group-hover:text-pink">{latest.title}</span>
              <span className="block truncate text-sm text-muted">{latest.status === "In progress" ? "In the studio" : latest.subtitle}</span>
            </span>
          </Link>
        </div>
        <div className="min-w-0">
          <SectionTitle kicker="// ADITYA.EXE" title="Top Songs" href="/" />
          <ResumeTracklist limit={5} columns={1} />
        </div>
      </section>

      <section>
        <SectionTitle kicker="// discography" title="Albums" href="/albums" />
        <div className={shelf}>
          {projects.map((p) => (
            <AlbumCard key={p.slug} project={p} />
          ))}
        </div>
      </section>

      {/* About */}
      <section>
        <SectionTitle kicker="// about" title={`About ${profile.shortName}`} />
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <Link href="/about" className="group glass glow-border hud relative overflow-hidden rounded-[var(--radius-card)] p-5 sm:p-6">
            <div className="flex items-center gap-4">
              <Avatar size={64} />
              <div>
                <p className="text-[17px] font-semibold">{profile.name}</p>
                <p className="text-sm text-muted">{degree.title}</p>
              </div>
            </div>
            <p className="mt-4 line-clamp-4 text-[15px] leading-relaxed text-fg/85">{profile.bio.slice(1, 5).join(" ")}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-pink">
              Read the lyrics <ChevronRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
          <GlassCard>
            <dl className="space-y-3 text-[14px]">
              {(
                [
                  ["Based in", profile.location],
                  ["Studying", `${degree.title}, ${degree.school} (${degree.start}–${degree.end})`],
                  ["Currently building", profile.currentlyBuilding],
                  ["Genres", skills.map((g) => g.name).join(" · ")],
                ] as const
              ).map(([k, v]) => (
                <div key={k}>
                  <dt className="mono-label !text-[10px]">{k}</dt>
                  <dd className="mt-0.5">{v}</dd>
                </div>
              ))}
            </dl>
          </GlassCard>
        </div>
      </section>

      <section>
        <SectionTitle kicker="// featured on" title="Appears On" href="/featured-on" />
        <div className="grid gap-3 sm:grid-cols-2">
          {roles.map((r) => (
            <div key={r.title} className="glass flex items-center gap-4 rounded-[var(--radius-card)] p-4">
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
      </section>
    </div>
  );
}
