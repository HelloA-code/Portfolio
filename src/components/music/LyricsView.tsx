"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Lyric } from "@/data/portfolio";

type Props = {
  lines: Lyric[];
  active: number;
  onSelect?: (index: number) => void;
  /** keep the active line centred */
  follow?: boolean;
  className?: string;
};

/**
 * Apple-style synced lyrics: the active line is big and bright, past lines dim,
 * upcoming lines soft-blurred. Lines can carry links.
 */
export function LyricsView({ lines, active, onSelect, follow = true, className = "" }: Props) {
  const box = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = box.current;
    const line = el?.children[active] as HTMLElement | undefined;
    if (!el || !line || !follow) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ top: line.offsetTop - el.clientHeight / 2 + line.clientHeight / 2, behavior: reduce ? "auto" : "smooth" });
  }, [active, follow]);

  return (
    <ol
      ref={box}
      aria-label="Lyrics"
      className={`no-scrollbar relative overflow-y-auto py-[30vh] [mask-image:linear-gradient(transparent,black_20%,black_80%,transparent)] ${className}`}
    >
      {lines.map((l, i) => {
        const state = i === active ? "now" : i < active ? "past" : "next";
        return (
          <li
            key={i}
            aria-current={state === "now" ? "true" : undefined}
            onClick={() => onSelect?.(i)}
            className={`cursor-pointer py-2.5 font-display text-[26px] font-bold leading-tight tracking-tight transition-all duration-500 sm:text-[34px] ${
              state === "now"
                ? "text-fg [text-shadow:0_0_24px_rgba(255,255,255,0.35)]"
                : state === "past"
                  ? "text-fg/30 hover:text-fg/60"
                  : "text-fg/40 blur-[1.5px] hover:text-fg/70 hover:blur-0"
            }`}
          >
            {l.href ? (
              <Link
                href={l.href}
                onClick={(e) => e.stopPropagation()}
                className="underline decoration-pink/60 decoration-2 underline-offset-[6px] hover:decoration-pink"
              >
                {l.text}
              </Link>
            ) : (
              l.text
            )}
          </li>
        );
      })}
    </ol>
  );
}
