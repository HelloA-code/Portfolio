"use client";

import { Pause, Play } from "lucide-react";
import { currentTrackId, usePlayer } from "@/store/player";

/** Plays one track of the horror score (or pauses it if it's the one playing). */
export function HPlayButton({ trackId, label, className = "h-btn" }: { trackId: string; label: string; className?: string }) {
  const playTrack = usePlayer((s) => s.playTrack);
  const toggle = usePlayer((s) => s.toggle);
  const isCurrent = usePlayer((s) => currentTrackId(s) === trackId && s.status !== "idle");
  const playing = usePlayer((s) => currentTrackId(s) === trackId && s.status === "playing");
  return (
    <button type="button" onClick={() => (isCurrent ? toggle() : void playTrack(trackId))} className={className}>
      {playing ? <Pause size={16} /> : <Play size={16} />}
      {playing ? "Pause" : label}
    </button>
  );
}
