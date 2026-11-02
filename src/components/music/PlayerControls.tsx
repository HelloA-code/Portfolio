"use client";

import { Loader2, Pause, Play, Repeat, Repeat1, Shuffle, SkipBack, SkipForward, Volume1, Volume2, VolumeX } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { formatTime } from "@/lib/audio/meta";
import { currentTrackId, usePlayer } from "@/store/player";
import { IconButton } from "@/components/ui/primitives";

export function PlayPauseIcon({ size = 20 }: { size?: number }) {
  const status = usePlayer((s) => s.status);
  if (status === "loading") return <Loader2 size={size} className="animate-spin" />;
  return status === "playing" ? <Pause size={size} fill="currentColor" /> : <Play size={size} fill="currentColor" className="translate-x-[1px]" />;
}

export function Controls({ big }: { big?: boolean }) {
  const { toggle, next, prev, shuffle, toggleShuffle, repeat, cycleRepeat, status } = usePlayer(
    useShallow((s) => ({ toggle: s.toggle, next: s.next, prev: s.prev, shuffle: s.shuffle, toggleShuffle: s.toggleShuffle, repeat: s.repeat, cycleRepeat: s.cycleRepeat, status: s.status })),
  );
  const s = big ? 26 : 18;
  return (
    <div className={`flex items-center ${big ? "gap-5" : "gap-1"}`}>
      <IconButton label={shuffle ? "Shuffle on" : "Shuffle off"} active={shuffle} onClick={toggleShuffle}>
        <Shuffle size={big ? 20 : 16} />
      </IconButton>
      <IconButton label="Previous track" onClick={prev} className={big ? "size-12" : ""}>
        <SkipBack size={s} fill="currentColor" />
      </IconButton>
      <button
        type="button"
        onClick={toggle}
        aria-label={status === "playing" ? "Pause" : "Play"}
        className={`grid place-items-center rounded-full bg-fg text-bg transition-transform active:scale-95 ${
          big ? "size-16" : "size-9"
        } ${status === "idle" ? "play-glow" : ""}`}
      >
        <PlayPauseIcon size={big ? 28 : 16} />
      </button>
      <IconButton label="Next track" onClick={() => next()} className={big ? "size-12" : ""}>
        <SkipForward size={s} fill="currentColor" />
      </IconButton>
      <IconButton label={`Repeat ${repeat}`} active={repeat !== "off"} onClick={cycleRepeat}>
        {repeat === "one" ? <Repeat1 size={big ? 20 : 16} /> : <Repeat size={big ? 20 : 16} />}
      </IconButton>
    </div>
  );
}

export function SeekBar({ compact }: { compact?: boolean }) {
  const position = usePlayer((s) => s.position);
  const duration = usePlayer((s) => s.duration);
  const seek = usePlayer((s) => s.seek);
  const idle = usePlayer((s) => s.status === "idle");
  const pct = duration ? Math.min(100, (position / duration) * 100) : 0;

  return (
    <div className="w-full">
      <input
        type="range"
        aria-label="Seek"
        min={0}
        max={duration}
        step={0.1}
        value={position}
        disabled={idle}
        onChange={(e) => seek(Number(e.target.value))}
        className="range w-full"
        style={{ "--pct": `${pct}%` } as React.CSSProperties}
      />
      {!compact && (
        <div className="mt-1.5 flex justify-between font-mono text-[11px] text-muted">
          <span>{formatTime(position)}</span>
          <span>-{formatTime(duration - position)}</span>
        </div>
      )}
    </div>
  );
}

export function VolumeControl({ className = "" }: { className?: string }) {
  const { volume, muted, setVolume, toggleMute } = usePlayer(
    useShallow((s) => ({ volume: s.volume, muted: s.muted, setVolume: s.setVolume, toggleMute: s.toggleMute })),
  );
  const level = muted ? 0 : volume;
  const Icon = level === 0 ? VolumeX : level < 0.5 ? Volume1 : Volume2;
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <IconButton label={muted ? "Unmute (M)" : "Mute (M)"} active={muted} onClick={toggleMute}>
        <Icon size={17} />
      </IconButton>
      <input
        type="range"
        aria-label="Volume"
        min={0}
        max={1}
        step={0.01}
        value={level}
        onChange={(e) => setVolume(Number(e.target.value))}
        className="range w-24"
        style={{ "--pct": `${level * 100}%` } as React.CSSProperties}
      />
    </div>
  );
}

/** ▶ button that plays a specific track (or pauses it if it is the one playing) */
export function PlayTrackButton({ trackId, label = "Play", className = "" }: { trackId: string; label?: string; className?: string }) {
  const playTrack = usePlayer((s) => s.playTrack);
  const toggle = usePlayer((s) => s.toggle);
  const isCurrent = usePlayer((s) => currentTrackId(s) === trackId && s.status !== "idle");
  const playing = usePlayer((s) => currentTrackId(s) === trackId && s.status === "playing");
  return (
    <button type="button" onClick={() => (isCurrent ? toggle() : void playTrack(trackId))} className={className}>
      {playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
      {playing ? "Pause" : label}
    </button>
  );
}
