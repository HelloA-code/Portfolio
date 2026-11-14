import type { Metadata } from "next";
import { CodeXml, Dumbbell, Feather, Gamepad2 } from "lucide-react";
import { hobbies } from "@/data/portfolio";
import { GlassCard, PageHeader } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Liner Notes", description: "Life beyond code." };

const icons = { dumbbell: Dumbbell, badminton: Feather, gamepad: Gamepad2, code: CodeXml };

export default function LinerNotesPage() {
  return (
    <>
      <PageHeader kicker="playlist" title="Liner Notes">
        What happens off the clock.
      </PageHeader>
      <div className="grid grid-cols-1 gap-4 xs:grid-cols-2">
        {hobbies.map((h, i) => {
          const Icon = icons[h.icon];
          return (
            <GlassCard key={h.title}>
              <Icon size={26} className={["text-pink", "text-cyan", "text-violet", "text-pink"][i % 4]} />
              <p className="mt-3 text-[17px] font-semibold">{h.title}</p>
              <p className="text-sm text-muted">{h.detail}</p>
            </GlassCard>
          );
        })}
      </div>
    </>
  );
}
