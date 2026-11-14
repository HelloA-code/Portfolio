import type { Metadata } from "next";
import { projectsForGenre, skills } from "@/data/portfolio";

export const metadata: Metadata = { title: "Upgrades", description: "Skills, grouped like an upgrade sheet." };

/** Segmented meter. Values are real counts, never invented ratings. */
function Meter({ value, max, label }: { value: number; max: number; label: string }) {
  return (
    <div>
      <div className="flex justify-between text-[11px] uppercase tracking-[0.14em] text-h-faint">
        <span>{label}</span>
        <span className="text-h-ink">{value}</span>
      </div>
      <div className="mt-1 flex gap-[3px]" role="meter" aria-label={label} aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
        {Array.from({ length: max }, (_, i) => (
          <span key={i} className={`h-2 flex-1 ${i < value ? "bg-h-amber shadow-[0_0_6px_rgba(214,162,74,0.6)]" : "bg-white/10"}`} />
        ))}
      </div>
    </div>
  );
}

export default function UpgradesPage() {
  const maxSkills = Math.max(...skills.map((g) => g.skills.length));
  const maxUse = Math.max(1, ...skills.map((g) => projectsForGenre(g).length));

  return (
    <>
      <header className="mb-8">
        <p className="h-label">Upgrades</p>
        <h1 className="h-title mt-1 text-[clamp(30px,5vw,48px)]">Upgrade sheet</h1>
        <p className="mt-2 max-w-2xl text-[14px] text-h-dim">
          <span className="text-h-ink">Arsenal</span> is how many skills are in a group. <span className="text-h-ink">Field use</span> is how many projects in the case
          use them.
        </p>
      </header>

      <ul className="grid gap-4 md:grid-cols-2">
        {skills.map((g, i) => {
          const used = projectsForGenre(g);
          return (
            <li key={g.slug} className="h-panel flex flex-col p-5">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="h-title text-[20px]">{g.name}</h2>
                <span className="text-[11px] uppercase tracking-[0.16em] text-h-blood">Lv. {String(i + 1).padStart(2, "0")}</span>
              </div>
              <div className="mt-4 grid gap-3">
                <Meter label="Arsenal" value={g.skills.length} max={maxSkills} />
                <Meter label="Field use" value={used.length} max={maxUse} />
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {g.skills.map((s) => (
                  <span key={s} className="border border-h-line bg-black/40 px-2 py-0.5 text-[12px] text-h-ink">
                    {s}
                  </span>
                ))}
              </div>
              {used.length > 0 && <p className="mt-auto pt-4 text-[12px] text-h-faint">Used in: {used.map((p) => p.title).join(", ")}</p>}
            </li>
          );
        })}
      </ul>
    </>
  );
}
