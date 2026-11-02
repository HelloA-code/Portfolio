"use client";

import { ListMusic, MicVocal, Play, SkipForward } from "lucide-react";
import { getTrack, profile } from "@/data/portfolio";
import { trackCover } from "@/lib/covers";
import { currentTrackId, usePlayer } from "@/store/player";
import { CoverArt } from "@/components/music/CoverArt";
import { EqualizerIcon } from "@/components/music/EqualizerIcon";
import { Controls, PlayPauseIcon, VolumeControl } from "@/components/music/PlayerControls";
import { IconButton } from "@/components/ui/primitives";

/** The persistent player: top-centre bar on desktop, mini-player above the tab bar on mobile. */
export function NowPlayingBar() {
  const id = usePlayer(currentTrackId);
  const status = usePlayer((s) => s.status);
  const toggle = usePlayer((s) => s.toggle);
  const next = usePlayer((s) => s.next);
  const setSheet = usePlayer((s) => s.setSheet);
  const setQueueOpen = usePlayer((s) => s.setQueueOpen);
  const position = usePlayer((s) => s.position);
  const duration = usePlayer((s) => s.duration);
  const track = getTrack(id);
  if (!track) return null;
  const idle = status === "idle";
  const playing = status === "playing";

  const label = idle ? (
    <>
      <span className="mono-label block truncate !text-[10px] text-cyan">{"// currently building"}</span>
      <span className="block truncate text-[13px] font-semibold">{profile.currentlyBuilding}</span>
    </>
  ) : (
    <>
      <span className="flex items-center gap-2 truncate text-[13px] font-semibold">
        <EqualizerIcon playing={playing} className="shrink-0" />
        <span className="truncate">{track.title}</span>
      </span>
      <span className="block truncate text-[12px] text-muted">{profile.name} — ADITYA.EXE</span>
    </>
  );

  return (
    <>
      {/* Desktop */}
      <div className="fixed left-[calc(240px+24px)] right-6 top-3 z-40 hidden justify-center lg:flex">
        <div className="glass glow-border flex h-[60px] w-full max-w-[860px] items-center gap-4 rounded-2xl bg-black/50 px-3" data-active={playing}>
          <Controls />
          <button
            type="button"
            onClick={() => (idle ? toggle() : setSheet(true))}
            className="flex min-w-0 flex-1 items-center gap-3 rounded-lg px-1 text-left"
            aria-label={idle ? "Play my resume" : "Open Now Playing"}
          >
            <CoverArt {...trackCover(track)} bare className="size-10 shrink-0 !rounded-md" />
            <span className="min-w-0 flex-1">
              {label}
              {!idle && (
                <span className="mt-1 block h-[3px] overflow-hidden rounded-full bg-white/15">
                  <span className="block h-full bg-gradient-to-r from-cyan via-violet to-pink" style={{ width: `${duration ? (position / duration) * 100 : 0}%` }} />
                </span>
              )}
            </span>
          </button>
          <IconButton label="Lyrics" onClick={() => setSheet(true)}>
            <MicVocal size={17} />
          </IconButton>
          <IconButton
            label="Up Next"
            onClick={() => {
              setQueueOpen(true);
              setSheet(true);
            }}
          >
            <ListMusic size={17} />
          </IconButton>
          <VolumeControl className="hidden xl:flex" />
        </div>
      </div>

      {/* Mobile mini-player */}
      <div className="fixed inset-x-2 bottom-[calc(max(env(safe-area-inset-bottom),8px)+58px)] z-40 lg:hidden">
        <div className="glass relative flex h-14 items-center gap-3 overflow-hidden rounded-2xl bg-black/60 pl-2 pr-1">
          <button
            type="button"
            onClick={() => (idle ? toggle() : setSheet(true))}
            className="flex min-w-0 flex-1 items-center gap-3 text-left"
            aria-label={idle ? "Play my resume" : "Open Now Playing"}
          >
            <CoverArt {...trackCover(track)} bare className="size-10 shrink-0 !rounded-md" />
            <span className="min-w-0 flex-1">{label}</span>
          </button>
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Pause" : "Play"}
            className={`grid size-10 place-items-center rounded-full ${idle ? "play-glow bg-pink text-white" : "text-fg"}`}
          >
            {idle ? <Play size={18} fill="currentColor" /> : <PlayPauseIcon size={20} />}
          </button>
          <IconButton label="Next track" onClick={() => next()}>
            <SkipForward size={18} fill="currentColor" />
          </IconButton>
          {!idle && (
            <span className="absolute inset-x-3 bottom-0 h-[2px] bg-white/10">
              <span className="block h-full bg-pink" style={{ width: `${duration ? (position / duration) * 100 : 0}%` }} />
            </span>
          )}
        </div>
      </div>
    </>
  );
}
