import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { achievements } from "@/data/portfolio";
import { PageHeader } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Charts", description: "Achievements, ranked." };

export default function ChartsPage() {
  return (
    <>
      <PageHeader kicker="top charts" title="Charts">
        Hackathons, contests and milestones.
      </PageHeader>
      <ol className="space-y-2">
        {achievements.map((a, i) => {
          const body = (
            <>
              <span
                className={`w-14 shrink-0 text-center font-display text-[44px] font-bold leading-none tracking-tighter ${
                  i === 0 ? "bg-gradient-to-b from-pink to-violet bg-clip-text text-transparent drop-shadow-[0_0_14px_rgba(255,45,117,0.45)]" : "text-fg/85"
                }`}
              >
                {i + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[17px] font-semibold">{a.title}</span>
                <span className="block text-sm text-muted">{a.detail}</span>
              </span>
              <span className="mono-label hidden rounded-full border border-line px-2.5 py-1 !text-[10px] sm:block">{a.tag}</span>
              {a.href && <ChevronRight size={18} className="text-faint" />}
            </>
          );
          const cls = "glass glow-border flex items-center gap-4 rounded-[var(--radius-card)] p-4";
          return (
            <li key={a.title}>
              {a.href ? (
                <Link href={a.href} className={`${cls} transition-colors hover:bg-white/10`}>
                  {body}
                </Link>
              ) : (
                <div className={cls}>{body}</div>
              )}
            </li>
          );
        })}
      </ol>
    </>
  );
}
