import type { Metadata } from "next";
import { skills } from "@/data/portfolio";
import { GenreTile } from "@/components/music/GenreTile";
import { PageHeader } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Genres", description: "Skills, grouped like music genres." };

export default function GenresPage() {
  return (
    <>
      <PageHeader kicker="skills" title="Genres">
        Pick a genre to see the skills in it and the albums that use them.
      </PageHeader>
      <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-3">
        {skills.map((g) => (
          <GenreTile key={g.slug} genre={g} />
        ))}
      </div>
    </>
  );
}
