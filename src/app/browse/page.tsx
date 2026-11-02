import type { Metadata } from "next";
import { ProjectGrid } from "@/components/music/ProjectGrid";
import { PageHeader } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Browse", description: "Every project, as an album." };

export default function BrowsePage() {
  return (
    <>
      <PageHeader kicker="browse" title="Browse">
        Every project is an album. Right-click (or long-press) a cover for more options.
      </PageHeader>
      <ProjectGrid />
    </>
  );
}
