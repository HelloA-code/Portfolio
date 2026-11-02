import { resumeAlbum, type ResumeTrack } from "@/data/portfolio";

/** Tempo, length and key for each track. Kept separate from the Tone.js code so it loads instantly. */
export const trackMeta: Record<string, { bpm: number; bars: number; key: string }> = {
  "boot-sequence": { bpm: 66, bars: 10, key: "A minor" },
  "nine-twenty-five": { bpm: 72, bars: 12, key: "F major" },
  "out-of-band": { bpm: 80, bars: 14, key: "D minor" },
  lumina: { bpm: 76, bars: 14, key: "C major" },
  "rep-counter": { bpm: 84, bars: 14, key: "E minor" },
  "on-chain": { bpm: 78, bars: 14, key: "B minor" },
  fleetmind: { bpm: 92, bars: 16, key: "D minor" },
  "stack-overflow": { bpm: 80, bars: 16, key: "A minor" },
  "off-the-clock": { bpm: 64, bars: 10, key: "D major" },
  "hire-me": { bpm: 70, bars: 14, key: "D major" },
  "debug-mode": { bpm: 88, bars: 12, key: "B minor" },
};

export const secondsPerBar = (id: string) => (240 / trackMeta[id].bpm);

export const trackDuration = (id: string) => trackMeta[id].bars * secondsPerBar(id);

/** Lyric start times in seconds, spread across the track and snapped to bars (unless pinned with `bar`). */
export function lyricTimes(track: ResumeTrack): number[] {
  const { bars } = trackMeta[track.id];
  const spb = secondsPerBar(track.id);
  const usable = bars - 1; // leave the last bar for the final line to breathe
  return track.lyrics.map((l, i) => (l.bar ?? Math.floor((i * usable) / track.lyrics.length)) * spb);
}

export const formatTime = (s: number) => {
  const t = Math.max(0, Math.floor(s));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
};

export const visibleTracks = (bonusUnlocked: boolean) =>
  resumeAlbum.filter((t) => !t.hidden || bonusUnlocked);
