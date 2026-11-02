import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGenre, projectsForGenre, skills } from "@/data/portfolio";
import { AlbumCard } from "@/components/music/AlbumCard";
import { Chip, PageHeader, SectionTitle } from "@/components/ui/primitives";

export function generateStaticParams() {
  return skills.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/genres/[slug]">): Promise<Metadata> {
  const g = getGenre((await params).slug);
  return g ? { title: g.name, description: `${g.name}: ${g.skills.join(", ")}` } : {};
}

export default async function GenrePage({ params }: PageProps<"/genres/[slug]">) {
  const g = getGenre((await params).slug);
  if (!g) notFound();
  const albums = projectsForGenre(g);

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-10 -top-32 -z-10 h-[420px]"
        style={{ background: `radial-gradient(70% 70% at 20% 10%, hsl(${g.hue} 70% 35% / 0.8), transparent 70%)` }}
      />
      <PageHeader kicker="genre" title={g.name} />
      <div className="flex flex-wrap gap-2">
        {g.skills.map((s) => (
          <Chip key={s}>{s}</Chip>
        ))}
      </div>

      <section className="mt-10">
        <SectionTitle title={albums.length ? "Albums in this genre" : "No albums tagged yet"} />
        {albums.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
            {albums.map((p) => (
              <AlbumCard key={p.slug} project={p} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <SectionTitle title="Other genres" />
        <div className="flex flex-wrap gap-2">
          {skills
            .filter((x) => x.slug !== g.slug)
            .map((x) => (
              <Chip key={x.slug} href={`/genres/${x.slug}`}>
                {x.name}
              </Chip>
            ))}
        </div>
      </section>
      <p className="mt-8">
        <Link href="/genres" className="text-sm text-pink hover:underline">
          All genres
        </Link>
      </p>
    </div>
  );
}
