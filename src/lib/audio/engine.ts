/**
 * Thin wrapper around Tone.js. Tone and the track builders are imported lazily
 * on the first play, so they never touch the initial page load.
 */
import type * as ToneNS from "tone";
import { trackMeta } from "./meta";
import type { TrackSpec } from "./helpers";

/** Which score plays: the music-app album or the horror-mode re-score */
export type ScoreVariant = "music" | "horror";

type Tone = typeof ToneNS;

let T: Tone | null = null;
let specs: Record<ScoreVariant, Record<string, TrackSpec>> | null = null;
let master: ToneNS.Compressor | null = null;
let fft: ToneNS.Analyser | null = null;
let wave: ToneNS.Analyser | null = null;
let current: { id: string; out: ToneNS.Gain; nodes: { dispose(): unknown }[] } | null = null;
let volume = { level: 0.8, muted: false };

const GAIN = 0.9;

async function load(): Promise<Tone> {
  if (!T) {
    const [tone, music, horror] = await Promise.all([import("tone"), import("./tracks"), import("./horrorTracks")]);
    T = tone;
    specs = { music: music.tracks, horror: horror.horrorTracks };
    const limiter = new T.Limiter(-1).toDestination();
    master = new T.Compressor(-20, 3).connect(limiter);
    fft = new T.Analyser("fft", 64);
    wave = new T.Analyser("waveform", 256);
    limiter.connect(fft);
    limiter.connect(wave);
    applyVolume();
  }
  await T.start();
  return T;
}

function applyVolume() {
  if (!T) return;
  const dest = T.getDestination();
  dest.volume.value = volume.level <= 0.001 ? -Infinity : 20 * Math.log10(volume.level);
  dest.mute = volume.muted;
}

function disposeCurrent() {
  if (!current) return;
  for (const n of current.nodes) n.dispose();
  current = null;
}

export const engine = {
  get loaded() {
    return T !== null;
  },

  async play(id: string, onEnded: () => void, variant: ScoreVariant = "music") {
    const tone = await load();
    if (!specs || !master) return;
    const tr = tone.getTransport();
    tr.stop();
    tr.cancel(0);
    disposeCurrent();

    const meta = trackMeta[id];
    const spec = specs[variant][id];
    tr.bpm.value = meta.bpm;
    tr.swing = spec.swing ?? 0;
    tr.swingSubdivision = "16n";
    tr.position = 0;

    const out = new tone.Gain(GAIN).connect(master);
    const nodes: { dispose(): unknown }[] = [out];
    spec.build({
      T: tone,
      out,
      add: (n) => {
        nodes.push(n);
        return n;
      },
    });
    tr.scheduleOnce((time) => tone.getDraw().schedule(onEnded, time), `${meta.bars}m`);
    current = { id, out, nodes };
    tr.start("+0.05");
  },

  pause() {
    if (!T || !current) return;
    current.out.gain.rampTo(0, 0.08);
    T.getTransport().pause("+0.08");
  },

  resume() {
    if (!T || !current) return;
    current.out.gain.rampTo(GAIN, 0.05);
    T.getTransport().start("+0.02");
  },

  stop() {
    if (!T) return;
    const tr = T.getTransport();
    tr.stop();
    tr.cancel(0);
    disposeCurrent();
  },

  seek(seconds: number) {
    if (!T || !current) return;
    T.getTransport().seconds = Math.max(0, seconds);
  },

  position() {
    return T && current ? T.getTransport().seconds : 0;
  },

  setVolume(level: number, muted: boolean) {
    volume = { level, muted };
    applyVolume();
  },

  /** FFT (dB per bin) and waveform (-1..1) of the master output, or null before the first play */
  levels(): { fft: Float32Array; wave: Float32Array } | null {
    if (!fft || !wave) return null;
    return { fft: fft.getValue() as Float32Array, wave: wave.getValue() as Float32Array };
  },

  /** 0..1 bass energy, for the aurora pulse */
  bass(): number {
    if (!fft) return 0;
    const bins = fft.getValue() as Float32Array;
    let sum = 0;
    for (let i = 1; i < 5; i++) sum += Math.max(0, (bins[i] + 90) / 90);
    return Math.min(1, sum / 4);
  },
};
