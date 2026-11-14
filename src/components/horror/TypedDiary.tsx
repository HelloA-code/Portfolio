"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const CHAR_MS = 28;
const LINE_PAUSE_MS = 450;

/** Types the lines out one character at a time, like a typewriter. Shows everything at once with reduced motion. */
export function TypedDiary({ lines }: { lines: string[] }) {
  const reduce = useReducedMotion();
  const [line, setLine] = useState(0);
  const [chars, setChars] = useState(0);
  const done = reduce || line >= lines.length;

  useEffect(() => {
    if (done) return;
    const current = lines[line];
    const t =
      chars < current.length
        ? setTimeout(() => setChars((c) => c + 1), CHAR_MS)
        : setTimeout(() => {
            setLine((l) => l + 1);
            setChars(0);
          }, LINE_PAUSE_MS);
    return () => clearTimeout(t);
  }, [chars, line, lines, done]);

  return (
    <div>
      {/* full text for screen readers, the animation is decoration */}
      <p className="sr-only">{lines.join(" ")}</p>
      <div aria-hidden className="space-y-3">
        {lines.map((l, i) => {
          if (!done && i > line) return null;
          const text = done || i < line ? l : l.slice(0, chars);
          return (
            <p key={i} className={`text-[16px] leading-relaxed text-[#2f251c] sm:text-[17px] ${!done && i === line ? "h-caret" : ""}`}>
              {text}
            </p>
          );
        })}
      </div>
      {!done && (
        <button type="button" onClick={() => setLine(lines.length)} className="mt-5 text-[12px] uppercase tracking-[0.16em] text-[#8a1d18] hover:underline">
          Skip
        </button>
      )}
    </div>
  );
}
