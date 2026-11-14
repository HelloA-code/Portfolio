"use client";

import { LayoutGroup, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { ArrowDownUp, Search } from "lucide-react";
import { projects, type Project } from "@/data/portfolio";
import { projectCover } from "@/lib/covers";
import { CoverArt } from "@/components/music/CoverArt";
import { HPlayButton } from "./HPlayButton";

/** Big items take 3×2 cells, the rest 2×2; the grid packs them densely like a case. */
const span = (p: Project) => (p.featured ? "col-span-2 row-span-2 sm:col-span-3" : "col-span-2 row-span-2");

export function InventoryCase() {
  const [order, setOrder] = useState(projects.map((p) => p.slug));
  const [selected, setSelected] = useState(projects[0].slug);
  const item = projects.find((p) => p.slug === selected) ?? projects[0];

  const organize = () => {
    // biggest first, like tidying the case
    const sorted = [...projects].sort((a, b) => Number(b.featured) - Number(a.featured) || a.title.localeCompare(b.title)).map((p) => p.slug);
    setOrder(sorted.join() === order.join() ? [...order].reverse() : sorted);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="h-panel p-3 sm:p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="h-label">Case · {projects.length} items</p>
          <button type="button" onClick={organize} className="flex items-center gap-1.5 text-[12px] uppercase tracking-[0.14em] text-h-dim hover:text-h-amber">
            <ArrowDownUp size={14} /> Organize
          </button>
        </div>
        <LayoutGroup>
          <ul
            className="h-case grid grid-flow-dense grid-cols-4 gap-0 p-px [--cell:72px] [grid-auto-rows:var(--cell)] sm:grid-cols-8 sm:[--cell:78px]"
            aria-label="Inventory items"
          >
            {order.map((slug) => {
              const p = projects.find((x) => x.slug === slug)!;
              const active = p.slug === selected;
              return (
                <motion.li key={p.slug} layout transition={{ type: "spring", stiffness: 380, damping: 32 }} className={`${span(p)} p-1`}>
                  <Link
                    href={`/mission/inventory/${p.slug}`}
                    onMouseEnter={() => setSelected(p.slug)}
                    onFocus={() => setSelected(p.slug)}
                    className={`group relative flex h-full w-full flex-col overflow-hidden rounded-sm border bg-black/50 transition-[border-color,box-shadow] ${
                      active ? "border-h-amber shadow-[0_0_0_1px_rgba(214,162,74,0.6),0_0_24px_rgba(214,162,74,0.25)]" : "border-h-line hover:border-h-amber/60"
                    }`}
                  >
                    <span className="relative min-h-0 flex-1">
                      <CoverArt {...projectCover(p)} bare className="absolute inset-0 !aspect-auto h-full !rounded-none opacity-80 [filter:saturate(0.55)_contrast(1.1)] transition-opacity group-hover:opacity-100" />
                      {p.status === "In progress" && (
                        <span className="absolute right-1.5 top-1.5 bg-black/70 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.14em] text-h-amber">Building</span>
                      )}
                    </span>
                    <span className="truncate border-t border-h-line bg-black/80 px-2 py-1 text-[11px] uppercase tracking-[0.12em] text-h-ink">{p.title}</span>
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </LayoutGroup>
      </div>

      {/* Examine panel */}
      <aside className="h-panel flex flex-col p-5" aria-live="polite">
        <p className="h-label">Examine</p>
        <h2 className="h-title mt-2 text-[24px] text-h-ink">{item.title}</h2>
        <p className="mt-1 text-[13px] text-h-amber">{item.subtitle}</p>
        <p className="mt-4 text-[14px] leading-relaxed text-h-dim">{item.description}</p>
        {item.credits.length > 0 && (
          <div className="mt-4">
            <p className="h-label !text-[10px]">Parts</p>
            <p className="mt-1 text-[13px] text-h-ink">{item.credits.join(" · ")}</p>
          </div>
        )}
        <div className="mt-auto flex flex-wrap gap-2 pt-6">
          <Link href={`/mission/inventory/${item.slug}`} className="h-btn h-btn-blood flex-1">
            <Search size={15} /> Inspect
          </Link>
          {item.trackId && <HPlayButton trackId={item.trackId} label="Use" className="h-btn flex-1" />}
        </div>
      </aside>
    </div>
  );
}
