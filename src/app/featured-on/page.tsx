import type { Metadata } from "next";
import { Radio } from "lucide-react";
import { roles } from "@/data/portfolio";
import { GlassCard, PageHeader } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Featured On", description: "Clubs and positions of responsibility." };

export default function FeaturedOnPage() {
  return (
    <>
      <PageHeader kicker="playlist" title="Featured On">
        Clubs and teams I&apos;ve been part of.
      </PageHeader>
      <div className="grid gap-4 md:grid-cols-2">
        {roles.map((r) => (
          <GlassCard key={r.title}>
            <div className="flex items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet to-pink">
                <Radio size={22} />
              </span>
              <div>
                <p className="text-[17px] font-semibold">{r.title}</p>
                <p className="mono-label !text-[10px]">{r.org}</p>
                <p className="mt-2 text-sm text-muted">{r.detail}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </>
  );
}
