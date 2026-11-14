"use client";

import { usePlayer } from "@/store/player";

/** Scrolling ECG line; beats faster while audio plays. */
export function Vitals({ className = "" }: { className?: string }) {
  const playing = usePlayer((s) => s.status === "playing");
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 100 24" className="h-5 w-16" aria-hidden>
        <path
          d="M0 12 H18 L22 4 L26 20 L30 12 H48 L52 6 L56 18 L60 12 H78 L82 3 L86 21 L90 12 H100"
          fill="none"
          stroke="var(--color-h-green)"
          strokeWidth="1.6"
          strokeDasharray="100 100"
          style={{ animation: `ecg ${playing ? 1.2 : 2.6}s linear infinite`, filter: "drop-shadow(0 0 3px rgba(127,191,106,0.8))" }}
        />
      </svg>
      <span className="h-label !text-[10px] !text-h-green">Stable</span>
    </span>
  );
}
