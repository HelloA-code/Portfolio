"use client";

import { useReducedMotion } from "framer-motion";
import { ChevronDown, ChevronUp, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/portfolio";
import { LyricsView } from "@/components/music/LyricsView";
import { IconButton } from "@/components/ui/primitives";

const STEP_MS = 3200;

/** Bio as time-synced lyrics: auto-advances, pauses on hover/focus, wheel and ↑/↓ driven. */
export function AboutLyrics() {
  const lines = profile.bio.map((text) => ({ text }));
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState(false);
  const [auto, setAuto] = useState(true);
  const box = useRef<HTMLDivElement>(null);
  const running = auto && !hover && !reduce;

  const go = (d: number) => setActive((a) => Math.min(lines.length - 1, Math.max(0, a + d)));

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setActive((a) => (a + 1) % lines.length), STEP_MS);
    return () => clearInterval(t);
  }, [running, lines.length]);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let last = 0;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (now - last < 350 || Math.abs(e.deltaY) < 8) return;
      last = now;
      go(e.deltaY > 0 ? 1 : -1);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        go(1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        go(-1);
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      el.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative">
      <div aria-hidden className="pointer-events-none absolute -inset-x-10 -top-32 -z-10 h-[110%] overflow-hidden">
        <div className="absolute left-0 top-0 size-[70vmax] rounded-full blur-[120px]" style={{ background: "radial-gradient(closest-side, rgba(139,92,246,0.55), transparent)", animation: "aurora 24s ease-in-out infinite alternate" }} />
        <div className="absolute bottom-0 right-0 size-[60vmax] rounded-full blur-[120px]" style={{ background: "radial-gradient(closest-side, rgba(255,45,117,0.4), transparent)", animation: "aurora 30s ease-in-out -6s infinite alternate-reverse" }} />
      </div>

      <div className="mb-2 flex items-center justify-between gap-4">
        <div>
          <p className="mono-label">{"// about me · lyrics"}</p>
          <h1 className="page-title text-[34px] sm:text-[40px]">About Me</h1>
        </div>
        <div className="flex items-center gap-1">
          <IconButton label="Previous line" onClick={() => go(-1)}>
            <ChevronUp size={20} />
          </IconButton>
          <IconButton label={running ? "Pause lyrics" : "Play lyrics"} onClick={() => setAuto(!auto)} active={running}>
            {running ? <Pause size={18} /> : <Play size={18} />}
          </IconButton>
          <IconButton label="Next line" onClick={() => go(1)}>
            <ChevronDown size={20} />
          </IconButton>
        </div>
      </div>

      <div ref={box} onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)} onFocus={() => setHover(true)} onBlur={() => setHover(false)}>
        <LyricsView lines={lines} active={active} onSelect={setActive} follow={!reduce} className="h-[64vh] !py-[24vh] [&_li]:sm:!text-[44px]" />
      </div>
      <p className="mono-label mt-2 text-center">scroll, ↑ ↓, or click a line</p>
    </div>
  );
}
