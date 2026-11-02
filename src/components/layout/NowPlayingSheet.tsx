"use client";

import { AnimatePresence, motion, useDragControls, useReducedMotion } from "framer-motion";
import { ChevronDown, ListMusic, MicVocal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getTrack, profile } from "@/data/portfolio";
import { formatTime, lyricTimes, trackDuration } from "@/lib/audio/meta";
import { coverHue, trackCover } from "@/lib/covers";
import { currentTrackId, usePlayer } from "@/store/player";
import { CoverArt } from "@/components/music/CoverArt";
import { EqualizerIcon } from "@/components/music/EqualizerIcon";
import { LyricsView } from "@/components/music/LyricsView";
import { Controls, SeekBar, VolumeControl } from "@/components/music/PlayerControls";
import { VisualizerRing } from "@/components/music/VisualizerRing";
import { IconButton } from "@/components/ui/primitives";

/** Full-screen Now Playing: cover with visualizer ring, synced resume lyrics, Up Next queue. */
export function NowPlayingSheet() {
  const open = usePlayer((s) => s.sheetOpen);
  const setSheet = usePlayer((s) => s.setSheet);
  const reduce = useReducedMotion();
  const drag = useDragControls();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSheet(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, setSheet]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Now Playing"
          className="fixed inset-0 z-[60] flex flex-col overflow-hidden bg-bg"
          initial={reduce ? { opacity: 0 } : { y: "100%" }}
          animate={reduce ? { opacity: 1 } : { y: 0 }}
          exit={reduce ? { opacity: 0 } : { y: "100%" }}
          transition={{ type: "spring", stiffness: 320, damping: 34 }}
          drag="y"
          dragListener={false}
          dragControls={drag}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.7 }}
          onDragEnd={(_, info) => {
            if (info.offset.y > 140 || info.velocity.y > 700) setSheet(false);
          }}
        >
          <SheetBody onHandle={(e) => drag.start(e)} onClose={() => setSheet(false)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SheetBody({ onHandle, onClose }: { onHandle: (e: React.PointerEvent) => void; onClose: () => void }) {
  const id = usePlayer(currentTrackId);
  const position = usePlayer((s) => s.position);
  const seek = usePlayer((s) => s.seek);
  const queueOpen = usePlayer((s) => s.queueOpen);
  const setQueueOpen = usePlayer((s) => s.setQueueOpen);
  const reduce = useReducedMotion();
  // phones show either the cover or the lyrics/queue; desktop shows both side by side
  const [mobileView, setMobileView] = useState<"cover" | "side">("cover");
  const track = getTrack(id);
  const times = useMemo(() => (track ? lyricTimes(track) : []), [track]);
  if (!track) return null;

  const cover = trackCover(track);
  const hue = coverHue(cover);
  let active = 0;
  times.forEach((t, i) => {
    if (position >= t) active = i;
  });

  return (
    <>
      {/* colour-matched, slowly drifting background */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div
          className="absolute -left-1/4 -top-1/4 size-[90vmax] rounded-full blur-[120px]"
          style={{ background: `radial-gradient(closest-side, hsl(${hue} 80% 45% / 0.55), transparent)`, animation: "aurora 26s ease-in-out infinite alternate" }}
        />
        <div
          className="absolute -bottom-1/3 -right-1/4 size-[80vmax] rounded-full blur-[120px]"
          style={{ background: `radial-gradient(closest-side, hsl(${(hue + 60) % 360} 85% 50% / 0.45), transparent)`, animation: "aurora 34s ease-in-out -10s infinite alternate-reverse" }}
        />
        <div className="absolute inset-0 bg-black/45" />
      </div>

      <header className="flex touch-none items-center justify-between px-4 pb-2 pt-[max(env(safe-area-inset-top),12px)] sm:px-6" onPointerDown={onHandle}>
        <IconButton label="Close Now Playing" onClick={onClose}>
          <ChevronDown size={22} />
        </IconButton>
        <span className="mx-auto h-1.5 w-10 rounded-full bg-white/30 lg:hidden" aria-hidden />
        <p className="mono-label hidden lg:block">{"// now playing · ADITYA.EXE"}</p>
        <div className="flex gap-1">
          <IconButton
            label="Lyrics"
            active={!queueOpen}
            onClick={() => {
              setMobileView(!queueOpen && mobileView === "side" ? "cover" : "side");
              setQueueOpen(false);
            }}
          >
            <MicVocal size={18} />
          </IconButton>
          <IconButton
            label="Up Next"
            active={queueOpen}
            onClick={() => {
              setMobileView(queueOpen && mobileView === "side" ? "cover" : "side");
              setQueueOpen(true);
            }}
          >
            <ListMusic size={18} />
          </IconButton>
        </div>
      </header>

      <div className="mx-auto grid min-h-0 w-full max-w-6xl flex-1 gap-6 px-5 pb-6 sm:px-8 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-14 lg:pb-10">
        <section className={`flex flex-col items-center justify-center gap-5 ${mobileView === "side" ? "max-lg:hidden" : ""}`}>
          <div className="relative w-[min(62vw,34vh,360px)] lg:w-[min(100%,36vh)]">
            <VisualizerRing className="absolute -inset-[22%] h-[144%] w-[144%]" />
            <motion.div key={track.id} initial={reduce ? false : { scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 24 }}>
              <CoverArt {...cover} className="shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]" />
            </motion.div>
          </div>
          <div className="w-full max-w-[420px]">
            <h2 className="truncate text-xl font-bold tracking-tight">{track.title}</h2>
            <p className="truncate text-muted">
              {profile.name} · <span className="font-mono text-xs uppercase">{track.mood}</span>
            </p>
            <div className="mt-4">
              <SeekBar />
            </div>
            <div className="mt-2 flex justify-center">
              <Controls big />
            </div>
            <VolumeControl className="mt-3 hidden justify-center sm:flex" />
          </div>
        </section>

        <section className={`flex min-h-0 flex-col ${mobileView === "cover" ? "max-lg:hidden" : ""}`}>
          <div className="min-h-0 flex-1">
            {queueOpen ? (
              <UpNext />
            ) : (
              <LyricsView lines={track.lyrics} active={active} onSelect={(i) => seek(times[i])} follow={!reduce} className="h-full max-h-[calc(100dvh-120px)] max-lg:max-h-[calc(100dvh-260px)]" />
            )}
          </div>
          <div className="mt-4 lg:hidden">
            <p className="truncate font-semibold">{track.title}</p>
            <SeekBar />
            <div className="mt-1 flex justify-center">
              <Controls />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

function UpNext() {
  const queue = usePlayer((s) => s.queue);
  const index = usePlayer((s) => s.index);
  const playing = usePlayer((s) => s.status === "playing");
  const playTrack = usePlayer((s) => s.playTrack);
  const upcoming = [...queue.slice(index), ...queue.slice(0, index)];

  return (
    <div className="no-scrollbar h-full max-h-[calc(100dvh-120px)] overflow-y-auto">
      <p className="mono-label mb-3">{"// up next"}</p>
      <ol className="space-y-1">
        {upcoming.map((id, i) => {
          const t = getTrack(id);
          if (!t) return null;
          const current = i === 0;
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => void playTrack(id)}
                className={`flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-white/10 ${current ? "bg-white/10" : ""}`}
              >
                <CoverArt {...trackCover(t)} bare className="size-11 shrink-0 !rounded-md" />
                <span className="min-w-0 flex-1">
                  <span className={`block truncate font-medium ${current ? "text-pink" : ""}`}>{t.title}</span>
                  <span className="block truncate text-sm text-muted">{t.about}</span>
                </span>
                {current ? <EqualizerIcon playing={playing} /> : <span className="font-mono text-xs text-muted">{formatTime(trackDuration(id))}</span>}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
