"use client";

import { AnimatePresence, motion } from "framer-motion";
import { getTrack } from "@/data/portfolio";
import { lyricTimes } from "@/lib/audio/meta";
import { currentTrackId, usePlayer } from "@/store/player";

/** The resume lyrics, shown like in-game subtitles while a track plays. */
export function Subtitles() {
  const id = usePlayer(currentTrackId);
  const position = usePlayer((s) => s.position);
  const active = usePlayer((s) => s.status === "playing" || s.status === "paused");
  const track = getTrack(id);
  if (!track || !active) return null;

  const times = lyricTimes(track);
  let i = 0;
  times.forEach((t, n) => {
    if (position >= t) i = n;
  });
  const line = track.lyrics[i]?.text ?? "";

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-[calc(max(env(safe-area-inset-bottom),8px)+72px)] z-30 flex justify-center px-4 lg:bottom-8">
      <AnimatePresence mode="wait">
        <motion.p
          key={`${id}-${i}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="max-w-2xl rounded bg-black/70 px-4 py-2 text-center font-type text-[15px] leading-snug text-h-ink shadow-[0_0_30px_rgba(0,0,0,0.8)] sm:text-[17px]"
        >
          {line}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
