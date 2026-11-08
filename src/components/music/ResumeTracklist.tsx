"use client";

import { Play } from "lucide-react";
import { formatTime, trackDuration, visibleTracks } from "@/lib/audio/meta";
import { currentTrackId, usePlayer } from "@/store/player";
import { EqualizerIcon } from "./EqualizerIcon";

/** The ADITYA.EXE tracklist; click a row to play it. */
export function ResumeTracklist({ limit, columns = 2 }: { limit?: number; columns?: 1 | 2 }) {
  const bonus = usePlayer((s) => s.bonusUnlocked);
  const current = usePlayer(currentTrackId);
  const status = usePlayer((s) => s.status);
  const playTrack = usePlayer((s) => s.playTrack);
  const toggle = usePlayer((s) => s.toggle);
  const tracks = visibleTracks(bonus).slice(0, limit);

  return (
    <ol className={`grid gap-x-8 ${columns === 2 ? "md:grid-cols-2" : ""}`}>
      {tracks.map((t, i) => {
        const isCurrent = t.id === current && status !== "idle";
        return (
          <li key={t.id} className="border-b border-line/60">
            <button
              type="button"
              onClick={() => (isCurrent ? toggle() : void playTrack(t.id))}
              className="group flex w-full items-center gap-4 rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-white/5"
              aria-label={`Play ${t.title}`}
            >
              <span className="grid w-6 place-items-center font-display text-[15px] text-muted">
                {isCurrent ? (
                  <EqualizerIcon playing={status === "playing"} />
                ) : (
                  <>
                    <span className="group-hover:hidden">{i + 1}</span>
                    <Play size={14} fill="currentColor" className="hidden text-fg group-hover:block" />
                  </>
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className={`block truncate text-[15px] font-medium ${isCurrent ? "text-pink" : ""}`}>{t.title}</span>
                <span className="block truncate text-[13px] text-muted">{t.about}</span>
              </span>
              <span className="font-mono text-xs text-muted">{formatTime(trackDuration(t.id))}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
