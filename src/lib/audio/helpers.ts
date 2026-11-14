/** Shared Tone.js building blocks for both album scores (music-app and horror). */
import type * as ToneNS from "tone";

type Tone = typeof ToneNS;
type Disposable = { dispose(): unknown };
type Mono = {
  triggerAttackRelease(note: string, duration: string | number, time?: number, velocity?: number): unknown;
};
type Poly = {
  triggerAttackRelease(notes: string[], duration: string | number, time?: number, velocity?: number): unknown;
};
export type Osc = "fatsawtooth" | "fattriangle" | "fatsquare" | "sawtooth" | "triangle" | "square" | "sine";
export type Dest = ToneNS.InputNode;

export type Ctx = {
  T: Tone;
  out: ToneNS.Gain;
  add: <N extends Disposable>(node: N) => N;
};

export type TrackSpec = { swing?: number; build: (c: Ctx) => void };

/* ------------------------------ helpers ------------------------------ */

export const REST = ".";

export function seq<V>(c: Ctx, events: V[], sub: string, fn: (time: number, v: V) => void, start: string | number = 0, stop?: string) {
  const s = c.add(new c.T.Sequence<V>((time, v) => fn(time, v), events, sub));
  s.start(start);
  if (stop) s.stop(stop);
  return s;
}

/** Drum-style trigger pattern ("x..X") */
export function hits(c: Ctx, pattern: string, fn: (time: number, accent: boolean) => void, start: string | number = 0, stop?: string) {
  seq(c, [...pattern], "16n", (t, ch) => ch !== REST && fn(t, ch === "X"), start, stop);
}

/** Note line: space separated notes, "." for rests */
export function line(c: Ctx, synth: Mono, notes: string, sub: string, dur: string, start: string | number = 0, stop?: string, vel = 0.8) {
  seq(c, notes.trim().split(/\s+/), sub, (t, n) => n !== REST && synth.triggerAttackRelease(n, dur, t, vel), start, stop);
}

export function chords(c: Ctx, synth: Poly, prog: string[][], every: string, dur: string, start: string | number = 0, stop?: string, vel = 0.6) {
  seq(c, prog.map((_, i) => i), every, (t, i) => synth.triggerAttackRelease(prog[i], dur, t, vel), start, stop);
}

export const up = (c: Ctx, note: string, semis: number) => c.T.Frequency(note).transpose(semis).toNote();
export const lift = (c: Ctx, prog: string[][], semis: number) => prog.map((ch) => ch.map((n) => up(c, n, semis)));

export function delay(c: Ctx, dest: Dest, time = "8n.", feedback = 0.35, wet = 0.3) {
  const d = c.add(new c.T.FeedbackDelay(time, feedback));
  d.wet.value = wet;
  d.connect(dest);
  return d;
}

/**
 * The signature sound: a slow pitch wobble (old tape) into a big hall reverb.
 * Returns the bus input; route melodic parts here.
 */
export function dreamBus(c: Ctx, room = 0.88, wet = 0.42) {
  const verb = c.add(new c.T.Freeverb({ roomSize: room, dampening: 2600 }));
  verb.wet.value = wet;
  verb.connect(c.out);
  const tape = c.add(new c.T.Vibrato(0.45, 0.06));
  tape.connect(verb);
  return tape;
}

export function poly(c: Ctx, osc: Osc, vol: number, env: Partial<ToneNS.EnvelopeOptions>, cutoff: number, dest: Dest) {
  const filter = c.add(new c.T.Filter(cutoff, "lowpass"));
  filter.connect(dest);
  const s = c.add(new c.T.PolySynth(c.T.Synth, { oscillator: { type: osc }, envelope: env } as Partial<ToneNS.SynthOptions>));
  s.maxPolyphony = 24;
  s.volume.value = vol;
  s.connect(filter);
  return s;
}

export function mono(c: Ctx, osc: Osc, vol: number, env: Partial<ToneNS.EnvelopeOptions>, dest: Dest = c.out) {
  const s = c.add(new c.T.Synth({ oscillator: { type: osc }, envelope: env } as Partial<ToneNS.SynthOptions>));
  s.volume.value = vol;
  s.connect(dest);
  return s;
}

/** Slow-attack string section */
export const strings = (c: Ctx, dest: Dest, vol = -19, cutoff = 1100) =>
  poly(c, "fatsawtooth", vol, { attack: 1.4, decay: 0.6, sustain: 0.8, release: 3 }, cutoff, dest);

/** Soft felt piano */
export const piano = (c: Ctx, dest: Dest, vol = -11) => poly(c, "triangle", vol, { attack: 0.004, decay: 1.6, sustain: 0.12, release: 1.6 }, 2600, dest);

/** Plucked harp */
export const harp = (c: Ctx, dest: Dest, vol = -13) => mono(c, "triangle", vol, { attack: 0.002, decay: 0.7, sustain: 0, release: 0.8 }, dest);

/** Glockenspiel / music-box bells */
export function bells(c: Ctx, dest: Dest, vol = -18) {
  const s = c.add(
    new c.T.FMSynth({
      harmonicity: 3.01,
      modulationIndex: 12,
      envelope: { attack: 0.001, decay: 1.4, sustain: 0, release: 1.4 },
      modulationEnvelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.3 },
    } as Partial<ToneNS.FMSynthOptions>),
  );
  s.volume.value = vol;
  s.connect(dest);
  return s;
}

/** Warm sub bass */
export function sub(c: Ctx, vol = -8) {
  const s = c.add(
    new c.T.MonoSynth({
      oscillator: { type: "sine" },
      envelope: { attack: 0.01, decay: 0.4, sustain: 0.7, release: 0.5 },
      filterEnvelope: { attack: 0.01, decay: 0.2, sustain: 0.5, release: 0.4, baseFrequency: 300, octaves: 1.5 },
    } as Partial<ToneNS.MonoSynthOptions>),
  );
  s.volume.value = vol;
  return s.connect(c.out);
}

export type Kit = { kick: ToneNS.MembraneSynth; snare: ToneNS.NoiseSynth; hat: ToneNS.NoiseSynth };

/** Slow, dusty hip-hop kit with a roomy snare */
export function kit(c: Ctx, opts: { kick?: number; snare?: number; hat?: number; drive?: number; room?: Dest } = {}) {
  const kick = c.add(
    new c.T.MembraneSynth({ pitchDecay: 0.05, octaves: 5, envelope: { attack: 0.001, decay: 0.5, sustain: 0, release: 0.2 } }),
  );
  kick.volume.value = opts.kick ?? -5;
  if (opts.drive) kick.connect(c.add(new c.T.Distortion(opts.drive)).connect(c.out));
  else kick.connect(c.out);

  const snare = c.add(new c.T.NoiseSynth({ noise: { type: "pink" }, envelope: { attack: 0.002, decay: 0.28, sustain: 0 } }));
  snare.volume.value = opts.snare ?? -13;
  const snareFilter = c.add(new c.T.Filter(1400, "bandpass")).connect(c.out);
  if (opts.room) snareFilter.connect(opts.room);
  snare.connect(snareFilter);

  const hat = c.add(new c.T.NoiseSynth({ noise: { type: "white" }, envelope: { attack: 0.001, decay: 0.05, sustain: 0 } }));
  hat.volume.value = opts.hat ?? -28;
  hat.connect(c.add(new c.T.Filter(8000, "highpass")).connect(c.out));
  return { kick, snare, hat } satisfies Kit;
}

export function beat(c: Ctx, k: Kit, p: { kick?: string; snare?: string; hat?: string }, start: string | number = 0, stop?: string) {
  if (p.kick) hits(c, p.kick, (t, a) => k.kick.triggerAttackRelease("A0", "8n", t, a ? 1 : 0.8), start, stop);
  if (p.snare) hits(c, p.snare, (t, a) => k.snare.triggerAttackRelease("8n", t, a ? 1 : 0.75), start, stop);
  if (p.hat) hits(c, p.hat, (t, a) => k.hat.triggerAttackRelease("32n", t, a ? 0.8 : 0.45), start, stop);
}

/** Vinyl crackle that follows the transport */
export function crackle(c: Ctx, vol = -40) {
  const hp = c.add(new c.T.Filter(2500, "highpass")).connect(c.out);
  const n = c.add(new c.T.Noise("pink"));
  n.volume.value = vol;
  n.connect(hp);
  n.sync().start(0);
}

/** Arpeggio over a progression, `per` sixteenths per chord */
export function arp(c: Ctx, prog: string[][], per: number, octaveUp: number, shape: "up" | "updown" | "rise") {
  const out: string[] = [];
  for (const chord of prog) {
    const tones = chord.map((n) => up(c, n, octaveUp * 12));
    const cycle = shape === "updown" ? [...tones, ...tones.slice(1, -1).reverse()] : tones;
    for (let i = 0; i < per; i++) {
      const oct = shape === "rise" ? Math.min(2, Math.floor(i / tones.length)) : 0;
      out.push(up(c, cycle[i % cycle.length], oct * 12));
    }
  }
  return out;
}

/** One sustained note per bar (bass lines etc.) */
export const roots = (prog: string[][], octave: number) => prog.map((ch) => ch[0].replace(/\d/, String(octave))).join(" ");

