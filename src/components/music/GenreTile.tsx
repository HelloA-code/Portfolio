import Link from "next/link";
import type { SkillGenre } from "@/data/portfolio";

/** Colourful category tile, like a browse category */
export function GenreTile({ genre, className = "" }: { genre: SkillGenre; className?: string }) {
  const h = genre.hue;
  return (
    <Link
      href={`/genres/${genre.slug}`}
      className={`group glow-border relative flex min-h-[132px] flex-col justify-between overflow-hidden rounded-[var(--radius-card)] p-4 transition-transform hover:-translate-y-0.5 ${className}`}
      style={{ background: `linear-gradient(135deg, hsl(${h} 75% 45%), hsl(${(h + 40) % 360} 80% 30%) 60%, hsl(${(h + 80) % 360} 70% 18%))` }}
    >
      <span>
        <span className="block text-[18px] font-bold leading-tight tracking-tight [text-shadow:0_1px_8px_rgba(0,0,0,0.35)]">{genre.name}</span>
        <span className="mt-1 block text-[12px] font-medium text-white/80">
          {genre.skills.length} skill{genre.skills.length === 1 ? "" : "s"}
        </span>
      </span>
      <span className="mt-4 line-clamp-2 font-mono text-[11px] leading-relaxed text-white/85">{genre.skills.join(" · ")}</span>
      <span aria-hidden className="pointer-events-none absolute -bottom-10 -right-10 size-28 rounded-full bg-white/10 blur-2xl transition-transform group-hover:scale-125" />
    </Link>
  );
}
