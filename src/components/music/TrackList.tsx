"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Play } from "lucide-react";
import { useState } from "react";
import type { Feature } from "@/data/portfolio";
import { hashString } from "@/lib/seed";

/** Project features as a numbered track list; click a track to expand its explanation. */
export function TrackList({ features, seed }: { features: Feature[]; seed: string }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <ol className="divide-y divide-line/70 border-y border-line/70">
      {features.map((f, i) => {
        // playful, stable fake durations
        const secs = 120 + (hashString(seed + f.title) % 140);
        const expanded = open === i;
        return (
          <li key={f.title}>
            <button
              type="button"
              aria-expanded={expanded}
              onClick={() => setOpen(expanded ? null : i)}
              className="group flex w-full items-center gap-4 px-2 py-3 text-left transition-colors hover:bg-white/5"
            >
              <span className="grid w-6 place-items-center font-display text-[15px] text-muted">
                <span className="group-hover:hidden">{i + 1}</span>
                <Play size={14} fill="currentColor" className="hidden text-pink group-hover:block" />
              </span>
              <span className={`flex-1 text-[15px] font-medium ${expanded ? "text-pink" : ""}`}>{f.title}</span>
              <span className="font-mono text-xs text-muted">
                {Math.floor(secs / 60)}:{String(secs % 60).padStart(2, "0")}
              </span>
            </button>
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.p
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 36 }}
                  className="overflow-hidden pl-12 pr-4 text-[14px] text-muted"
                >
                  <span className="block pb-4">{f.detail}</span>
                </motion.p>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ol>
  );
}
