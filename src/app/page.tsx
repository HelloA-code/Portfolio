import { Download } from "lucide-react";
import { albumTitle, profile, projects, skills, sortedByRelease } from "@/data/portfolio";
import { formatTime, trackDuration, visibleTracks } from "@/lib/audio/meta";
import { albumCover } from "@/lib/covers";
import { AlbumCard } from "@/components/music/AlbumCard";
import { CoverArt } from "@/components/music/CoverArt";
import { GenreTile } from "@/components/music/GenreTile";
import { PlayTrackButton } from "@/components/music/PlayerControls";
import { ResumeTracklist } from "@/components/music/ResumeTracklist";
import { pill, SectionTitle } from "@/components/ui/primitives";
import { Avatar } from "@/components/ui/Avatar";

const shelf = "shelf -mx-4 px-4 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0 [grid-auto-columns:minmax(150px,42%)] sm:[grid-auto-columns:200px]";

export default function Home() {
  const tracks = visibleTracks(false);
  const total = tracks.reduce((s, t) => s + trackDuration(t.id), 0);
  const featured = projects.filter((p) => p.featured);
  const recent = sortedByRelease().filter((p) => p.released);
  const studio = projects.filter((p) => p.status === "In progress");

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="glass hud relative overflow-hidden rounded-[24px] p-5 sm:p-8">
        <div aria-hidden className="absolute -right-24 -top-24 size-96 rounded-full bg-pink/25 blur-[100px]" />
        <div aria-hidden className="absolute -bottom-32 left-10 size-96 rounded-full bg-cyan/15 blur-[100px]" />
        <div className="relative grid items-center gap-6 md:grid-cols-[minmax(0,300px)_1fr] md:gap-10">
          <CoverArt {...albumCover} priority className="w-full max-w-[300px] shadow-[0_30px_80px_-20px_rgba(139,92,246,0.6)] max-md:mx-auto" />
          <div className="min-w-0">
            <p className="mono-label mb-3 text-cyan">{"// featured album · now available"}</p>
            <h1 className="page-title text-[clamp(40px,7vw,64px)]">{albumTitle}</h1>
            <div className="mt-3 flex items-center gap-3">
              <Avatar size={36} />
              <p className="text-[17px] font-semibold">{profile.name}</p>
            </div>
            <p className="mt-3 max-w-xl text-muted">{profile.tagline}</p>
            <p className="mono-label mt-3">
              {tracks.length} tracks · {formatTime(total)} · {profile.location}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <PlayTrackButton trackId="boot-sequence" label="Play My Resume" className={`${pill.primary} play-glow`} />
              <a href={profile.resume} download className={pill.secondary}>
                <Download size={17} /> Download Resume (PDF)
              </a>
            </div>
          </div>
        </div>
      </section>

      <section>
        <SectionTitle kicker="// tracklist" title={`${albumTitle}: The Album`} />
        <ResumeTracklist />
      </section>

      <section>
        <SectionTitle kicker="// curated" title="Top Picks for Recruiters" href="/browse" />
        <div className={shelf}>
          {featured.map((p) => (
            <AlbumCard key={p.slug} project={p} morph />
          ))}
        </div>
      </section>

      <section>
        <SectionTitle kicker="// new" title="Recently Released" href="/albums" />
        <div className={shelf}>
          {recent.map((p) => (
            <AlbumCard key={p.slug} project={p} />
          ))}
        </div>
      </section>

      {studio.length > 0 && (
        <section>
          <SectionTitle kicker="// sys.status: building" title="Currently in the Studio" />
          <div className={shelf}>
            {studio.map((p) => (
              <AlbumCard key={p.slug} project={p} />
            ))}
          </div>
        </section>
      )}

      <section>
        <SectionTitle kicker="// skills" title="Genres" href="/genres" />
        <div className="shelf -mx-4 px-4 [grid-auto-columns:minmax(200px,62%)] sm:-mx-8 sm:px-8 sm:[grid-auto-columns:240px] lg:mx-0 lg:px-0">
          {skills.map((g) => (
            <GenreTile key={g.slug} genre={g} />
          ))}
        </div>
      </section>
    </div>
  );
}
