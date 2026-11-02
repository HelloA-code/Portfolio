import Link from "next/link";
import type { SkillGenre } from "@/data/portfolio";

/** Colourful category tile, like a browse category */
export function GenreTile({ genre, className = "" }: { genre: SkillGenre; className?: string }) {
  const h = genre.hue;
  return (
    <Link
      href={`/genres/${genre.slug}`}
      className={`group glow-border relative block aspect-[16/10] overflow-hidden rounded-[var(--radius-card)] p-4 transition-transform hover:-translate-y-0.5 ${className}`}
      style={{ background: `linear-gradient(135deg, hsl(${h} 75% 45%), hsl(${(h + 40) % 360} 80% 30%) 60%, hsl(${(h + 80) % 360} 70% 18%))` }}
    >
      <span className="relative z-10 block text-[19px] font-bold tracking-tight [text-shadow:0_1px_8px_rgba(0,0,0,0.35)]">{genre.name}</span>
      <span className="relative z-10 mt-1 block text-[12px] font-medium text-white/85">{genre.skills.length} skills</span>
      <span
        aria-hidden
        className="absolute -bottom-4 -right-3 rotate-[18deg] rounded-lg bg-black/25 px-3 py-2 font-mono text-[13px] text-white/80 shadow-xl transition-transform group-hover:rotate-[10deg]"
      >
        {genre.skills.slice(0, 3).join(" · ")}
      </span>
    </Link>
  );
}
