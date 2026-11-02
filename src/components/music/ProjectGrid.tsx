"use client";

import { LayoutGroup, motion } from "framer-motion";
import { useState } from "react";
import { projects, type ProjectCategory } from "@/data/portfolio";
import { AlbumCard } from "./AlbumCard";

const filters: ("All" | ProjectCategory)[] = ["All", "Web", "ML", "Systems", "Web3", "Hackathon", "In Progress"];

export function ProjectGrid() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const shown = filter === "All" ? projects : projects.filter((p) => p.categories.includes(filter));

  return (
    <>
      <div role="group" aria-label="Filter albums" className="no-scrollbar -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <LayoutGroup>
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={`relative h-9 shrink-0 rounded-full px-4 text-[14px] font-medium transition-colors ${filter === f ? "text-bg" : "bg-white/5 text-fg/85 hover:bg-white/10"}`}
            >
              {filter === f && <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-fg" transition={{ type: "spring", stiffness: 500, damping: 38 }} />}
              <span className="relative">{f}</span>
            </button>
          ))}
        </LayoutGroup>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 xl:grid-cols-4">
        {shown.map((p) => (
          <AlbumCard key={p.slug} project={p} morph />
        ))}
      </div>
      {shown.length === 0 && <p className="text-muted">Nothing here yet.</p>}
    </>
  );
}
