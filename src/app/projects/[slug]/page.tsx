import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { CodeXml, Play } from "lucide-react";
import { getProject, profile, projects, skills } from "@/data/portfolio";
import { projectCover } from "@/lib/covers";
import { paletteFor } from "@/lib/seed";
import { AlbumCard } from "@/components/music/AlbumCard";
import { CoverArt } from "@/components/music/CoverArt";
import { PlayTrackButton } from "@/components/music/PlayerControls";
import { ShareMenu } from "@/components/music/ShareMenu";
import { TrackList } from "@/components/music/TrackList";
import { Avatar } from "@/components/ui/Avatar";
import { Chip, GlassCard, pill, SectionTitle } from "@/components/ui/primitives";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return { title: p.title, description: `${p.subtitle}. ${p.description}`, openGraph: { title: `${p.title} · ${profile.name}`, description: p.description } };
}

const genreFor = (skill: string) => skills.find((g) => g.skills.includes(skill));

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const palette = paletteFor(p.slug, p.cover?.hue);
  const more = projects.filter((x) => x.slug !== p.slug);

  return (
    <div className="relative">
      {/* dominant cover colour fading into the page */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-10 -top-32 -z-10 h-[620px]"
        style={{ background: `radial-gradient(80% 70% at 30% 20%, ${palette.base}, transparent 70%), linear-gradient(to bottom, hsl(${palette.hue} 60% 20% / 0.6), transparent)` }}
      />

      <section className="grid items-end gap-6 md:grid-cols-[minmax(0,280px)_1fr] md:gap-10">
        <ViewTransition name={`cover-${p.slug}`} share="morph" default="none">
          <CoverArt {...projectCover(p)} priority className="w-full max-w-[280px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] max-md:mx-auto" />
        </ViewTransition>
        <div className="min-w-0">
          <p className="mono-label mb-2">{`// album · ${p.status === "In progress" ? "sys.status: building" : "released"}`}</p>
          <h1 className="page-title text-[clamp(34px,6vw,56px)]">{p.title}</h1>
          <p className="mt-1 text-lg text-muted">{p.subtitle}</p>
          <div className="mt-3 flex items-center gap-2.5">
            <Avatar size={26} />
            <span className="font-semibold text-pink">{profile.name}</span>
          </div>
          <p className="mono-label mt-2">
            {p.genre} · {p.year ?? "TBA"} · {p.status}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {p.live ? (
              <a href={p.live} target="_blank" rel="noopener noreferrer" className={pill.primary}>
                <Play size={17} fill="currentColor" /> Live Demo
              </a>
            ) : (
              <span className={`${pill.primary} cursor-not-allowed opacity-50`} aria-disabled="true">
                <Play size={17} fill="currentColor" /> Demo coming soon
              </span>
            )}
            {p.github ? (
              <a href={p.github} target="_blank" rel="noopener noreferrer" className={pill.secondary}>
                <CodeXml size={17} /> GitHub
              </a>
            ) : (
              <span className={`${pill.secondary} cursor-not-allowed opacity-50`} aria-disabled="true">
                <CodeXml size={17} /> GitHub soon
              </span>
            )}
            {p.trackId && <PlayTrackButton trackId={p.trackId} label="Play Track" className={pill.secondary} />}
            <ShareMenu title={p.title} />
          </div>
        </div>
      </section>

      <p className="mt-8 max-w-3xl text-[17px] leading-relaxed text-fg/90">{p.description}</p>

      <section className="mt-8">
        <SectionTitle kicker="// tracks" title="Track List" />
        <TrackList features={p.features} seed={p.slug} />
        <p className="mono-label mt-3">
          {p.features.length} tracks · {p.year ?? "TBA"}
        </p>
      </section>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <p className="mono-label mb-3">{"// credits"}</p>
          {p.credits.length ? (
            <div className="flex flex-wrap gap-2">
              {p.credits.map((c) => {
                const g = genreFor(c);
                return (
                  <Chip key={c} href={g ? `/genres/${g.slug}` : undefined}>
                    {c}
                  </Chip>
                );
              })}
            </div>
          ) : (
            <p className="text-muted">Credits coming soon.</p>
          )}
        </GlassCard>
        <GlassCard>
          <p className="mono-label mb-3">{"// liner notes"}</p>
          <dl className="space-y-3 text-[14px]">
            {(
              [
                ["Problem", p.linerNotes.problem],
                ["Approach", p.linerNotes.approach],
                ["What I learned", p.linerNotes.learned],
              ] as const
            ).map(([k, v]) => (
              <div key={k}>
                <dt className="font-semibold">{k}</dt>
                <dd className="text-muted">{v.startsWith("TODO") ? "Coming soon." : v}</dd>
              </div>
            ))}
          </dl>
        </GlassCard>
      </div>

      <section className="mt-12">
        <SectionTitle title={`More by ${profile.shortName}`} href="/albums" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {more.map((x) => (
            <AlbumCard key={x.slug} project={x} />
          ))}
        </div>
      </section>
      <p className="mt-10 text-center">
        <Link href="/browse" className="text-sm text-pink hover:underline">
          Browse all albums
        </Link>
      </p>
    </div>
  );
}
