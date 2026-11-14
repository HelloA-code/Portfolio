/**
 * The horror-mode score for "ADITYA.EXE". Same track ids, tempo and length as ./tracks.ts
 * (so lyrics stay in sync), but a survival-horror sound: drones, wind, distant bells,
 * a detuned music box, heartbeats, string clusters and war drums. All original, all synthesised.
 */
import type * as ToneNS from "tone";
import { rng, hashString } from "@/lib/seed";
import { REST, chords, delay, hits, line, mono, poly, seq, type Ctx, type Dest, type TrackSpec } from "./helpers";

/* ------------------------------ horror kit ------------------------------ */

/** Huge dark room with a slow, queasy pitch drift */
function dread(c: Ctx, wet = 0.55) {
  const verb = c.add(new c.T.Freeverb({ roomSize: 0.95, dampening: 1400 }));
  verb.wet.value = wet;
  verb.connect(c.out);
  const drift = c.add(new c.T.Vibrato(0.18, 0.12));
  drift.connect(verb);
  return drift;
}

/** Low sustained drone, re-struck every `every` */
function drone(c: Ctx, notes: string[], dest: Dest, every = "2m", vol = -16) {
  const d = poly(c, "fatsawtooth", vol, { attack: 2.5, decay: 1, sustain: 0.9, release: 4 }, 380, dest);
  chords(c, d, [notes], every, every);
  return d;
}

/** Wind: brown noise through a slowly sweeping band-pass */
function wind(c: Ctx, vol = -30) {
  const bp = c.add(new c.T.Filter(500, "bandpass"));
  bp.Q.value = 1.2;
  bp.connect(c.out);
  const lfo = c.add(new c.T.LFO(0.07, 250, 1200));
  lfo.connect(bp.frequency);
  lfo.start();
  const n = c.add(new c.T.Noise("brown"));
  n.volume.value = vol;
  n.connect(bp);
  n.sync().start(0);
}

/** Distant church-style bell */
function bell(c: Ctx, dest: Dest, vol = -14) {
  const b = c.add(
    new c.T.FMSynth({
      harmonicity: 1.41,
      modulationIndex: 9,
      envelope: { attack: 0.002, decay: 4, sustain: 0, release: 4 },
      modulationEnvelope: { attack: 0.002, decay: 2.5, sustain: 0, release: 2 },
    } as Partial<ToneNS.FMSynthOptions>),
  );
  b.volume.value = vol;
  b.connect(dest);
  return b;
}

/** Slightly broken music box */
function musicBox(c: Ctx, dest: Dest, vol = -17) {
  const wobble = c.add(new c.T.Vibrato(5.5, 0.22));
  wobble.connect(dest);
  const s = c.add(
    new c.T.FMSynth({
      harmonicity: 4.02,
      modulationIndex: 6,
      envelope: { attack: 0.001, decay: 1.1, sustain: 0, release: 1 },
      modulationEnvelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.2 },
    } as Partial<ToneNS.FMSynthOptions>),
  );
  s.volume.value = vol;
  s.connect(wobble);
  return s;
}

/** Heartbeat / war drums / impacts */
function drums(c: Ctx, dest: Dest, vol = -6) {
  const thump = c.add(new c.T.MembraneSynth({ pitchDecay: 0.08, octaves: 4, envelope: { attack: 0.002, decay: 0.6, sustain: 0, release: 0.3 } }));
  thump.volume.value = vol;
  thump.connect(c.out);
  thump.connect(dest);
  const hit = c.add(new c.T.NoiseSynth({ noise: { type: "brown" }, envelope: { attack: 0.005, decay: 0.9, sustain: 0 } }));
  hit.volume.value = vol - 6;
  hit.connect(c.add(new c.T.Filter(900, "lowpass")).connect(dest));
  return { thump, hit };
}

const heartbeat = (c: Ctx, d: ReturnType<typeof drums>, start: string | number = 0, stop?: string) =>
  hits(c, "X..x............", (t, a) => d.thump.triggerAttackRelease(a ? "D1" : "C1", "8n", t, a ? 0.9 : 0.6), start, stop);

const impact = (c: Ctx, d: ReturnType<typeof drums>, at: string) =>
  c.T.getTransport().schedule((t) => {
    d.thump.triggerAttackRelease("A0", "2n", t, 1);
    d.hit.triggerAttackRelease("2n", t, 1);
  }, at);

/** Tense low-string ostinato */
const ostinato = (c: Ctx, dest: Dest, vol = -16) =>
  poly(c, "sawtooth", vol, { attack: 0.01, decay: 0.15, sustain: 0.2, release: 0.15 }, 1100, dest);

/** Swelling dissonant strings */
const cluster = (c: Ctx, dest: Dest, vol = -20) =>
  poly(c, "fatsawtooth", vol, { attack: 3, decay: 1, sustain: 0.8, release: 4 }, 900, dest);

/* ------------------------------ tracks ------------------------------ */

const briefing: TrackSpec = {
  build(c) {
    const room = dread(c);
    drone(c, ["D1", "A1", "D2"], room);
    wind(c);
    const b = bell(c, room);
    line(c, b, "D3 . . . . . . . . . . . . . . . A2 . . . . . . . . . . . . . . .", "8n", "1m");
    const box = musicBox(c, delay(c, room, "4n.", 0.4, 0.3));
    line(c, box, "A5 . F5 . . . E5 . D5 . . . . . . . F5 . E5 . . . C#5 . D5 . . . . . . .", "8n", "4n", "4m");
  },
};

const studyInTheDark: TrackSpec = {
  build(c) {
    const room = dread(c, 0.45);
    const keys = poly(c, "triangle", -12, { attack: 0.005, decay: 2, sustain: 0.05, release: 2 }, 1800, room);
    chords(c, keys, [["D3", "F3", "A3"], ["C#3", "E3", "A3"], ["A#2", "D3", "F3"], ["A2", "C#3", "E3"]], "1m", "2n.", 0, undefined, 0.45);
    const d = drums(c, room, -10);
    heartbeat(c, d, "2m");
    const lead = mono(c, "sine", -15, { attack: 0.05, decay: 0.6, sustain: 0.3, release: 1.2 }, room);
    line(c, lead, "A4 . . . G4 . F4 . E4 . . . . . . . F4 . . . E4 . D4 . C#4 . . . . . . .", "8n", "4n", "4m");
    wind(c, -36);
  },
};

const signal: TrackSpec = {
  build(c) {
    const room = dread(c);
    drone(c, ["D1", "D#2"], room, "2m", -18);
    const ping = musicBox(c, delay(c, room, "4n.", 0.55, 0.45), -15);
    line(c, ping, "A6 . . . . . . . . . . . . . . . . . . . . . . . D7 . . . . . . .", "8n", "8n");
    // radio static bursts
    const r = rng(hashString("signal"));
    const staticNoise = c.add(new c.T.NoiseSynth({ noise: { type: "white" }, envelope: { attack: 0.001, decay: 0.12, sustain: 0 } }));
    staticNoise.volume.value = -30;
    staticNoise.connect(c.add(new c.T.Filter(3000, "highpass")).connect(room));
    seq(c, Array.from({ length: 32 }, () => r() < 0.12), "8n", (t, on) => on && staticNoise.triggerAttackRelease("16n", t, 0.6));
    chords(c, cluster(c, room), [["D3", "D#3", "A3"], ["C#3", "D3", "G#3"]], "2m", "2m", "4m");
    const d = drums(c, room, -10);
    heartbeat(c, d, "8m");
  },
};

const candlelight: TrackSpec = {
  build(c) {
    const room = dread(c, 0.5);
    const box = musicBox(c, delay(c, room, "8n.", 0.3, 0.25), -15);
    line(c, box, "E5 . G5 . B5 . A5 . G5 . E5 . F#5 . . . E5 . G5 . B5 . C6 . B5 . A5 . B5 . . . . . . .", "8n", "8n");
    chords(c, cluster(c, room, -22), [["E3", "G3", "B3"], ["C3", "E3", "G3"], ["A2", "C3", "E3"], ["B2", "D#3", "F#3"]], "1m", "1m", "2m");
    drone(c, ["E1", "B1"], room, "4m", -20);
    wind(c, -38);
  },
};

const pursuit: TrackSpec = {
  build(c) {
    const room = dread(c, 0.35);
    const d = drums(c, room, -4);
    hits(c, "X.x.x...X.x.x.x.", (t, a) => d.thump.triggerAttackRelease(a ? "E1" : "B1", "8n", t, a ? 1 : 0.7));
    const strings = ostinato(c, room);
    seq(
      c,
      ["E2", "E2", "F2", "E2", "E2", "E2", "G2", "F2"],
      "8n",
      (t, n) => strings.triggerAttackRelease([n, c.T.Frequency(n).transpose(12).toNote()], "16n", t, 0.75),
      "2m",
    );
    chords(c, cluster(c, room, -21), [["E3", "F3", "B3"]], "2m", "2m", "6m");
    impact(c, d, "4m");
    impact(c, d, "8m");
    impact(c, d, "12m");
  },
};

const chains: TrackSpec = {
  build(c) {
    const room = dread(c, 0.45);
    const metal = c.add(new c.T.MetalSynth({ envelope: { attack: 0.001, decay: 0.6, release: 0.3 }, harmonicity: 3.1, modulationIndex: 18, resonance: 2400, octaves: 1.2 }));
    metal.volume.value = -26;
    metal.connect(room);
    hits(c, "x.......x..x....", (t, a) => metal.triggerAttackRelease("C3", "8n", t, a ? 0.9 : 0.6));
    const strings = ostinato(c, room, -17);
    const riff = "B1 . B1 . D2 . B1 . C2 . B1 . A#1 . B1 .".split(" ");
    seq(c, riff, "8n", (t, n) => n !== REST && strings.triggerAttackRelease([n], "8n", t, 0.75), "2m");
    drone(c, ["B0", "F#1"], room, "2m", -18);
    const d = drums(c, room, -8);
    heartbeat(c, d, "6m");
  },
};

const chase: TrackSpec = {
  build(c) {
    const room = dread(c, 0.3);
    const d = drums(c, room, -3);
    hits(c, "X..xX.x.X..xX.xx", (t, a) => d.thump.triggerAttackRelease(a ? "D1" : "A1", "8n", t, a ? 1 : 0.75), "2m");
    const strings = ostinato(c, room, -15);
    const roll = ["D2", "D2", "D3", "D2", "D#2", "D2", "D3", "D2", "C2", "C2", "C3", "C2", "C#2", "C2", "C3", "C2"];
    seq(c, roll, "16n", (t, n) => strings.triggerAttackRelease([n], "32n", t, 0.8));
    const brass = poly(c, "fatsawtooth", -16, { attack: 0.05, decay: 0.4, sustain: 0.6, release: 0.6 }, 1600, room);
    chords(c, brass, [["D3", "F3", "A3"], ["D#3", "G3", "A#3"], ["C3", "D#3", "G3"], ["C#3", "E3", "A3"]], "1m", "2n", "4m");
    impact(c, d, "8m");
    impact(c, d, "12m");
  },
};

const reprise: TrackSpec = {
  build(c) {
    const room = dread(c);
    drone(c, ["A0", "E1", "A1"], room);
    wind(c, -34);
    const b = bell(c, room, -16);
    line(c, b, "A2 . . . . . . . . . . . . . . .", "8n", "2m");
    const box = musicBox(c, delay(c, room, "4n.", 0.4, 0.3));
    line(c, box, "E5 . C5 . . . B4 . A4 . . . . . . .", "8n", "4n", 0, "8m");
    const strings = ostinato(c, room, -17);
    seq(c, ["A1", "A1", "A#1", "A1"], "8n", (t, n) => strings.triggerAttackRelease([n], "16n", t, 0.7), "4m", "12m");
    const d = drums(c, room, -7);
    heartbeat(c, d, "8m");
    hits(c, "X.......x.x.....", (t, a) => d.thump.triggerAttackRelease("A0", "8n", t, a ? 1 : 0.7), "12m");
  },
};

/** The calm room between the scares: warm, slow, safe. */
const safeRoom: TrackSpec = {
  build(c) {
    const verb = c.add(new c.T.Freeverb({ roomSize: 0.85, dampening: 2600 }));
    verb.wet.value = 0.4;
    verb.connect(c.out);
    const pad = poly(c, "fattriangle", -16, { attack: 1.5, decay: 0.5, sustain: 0.8, release: 3 }, 1300, verb);
    chords(c, pad, [["D3", "F#3", "A3", "C#4"], ["B2", "D3", "F#3", "A3"], ["G2", "B2", "D3", "F#3"], ["A2", "C#3", "E3"]], "1m", "1m");
    const keys = mono(c, "triangle", -13, { attack: 0.004, decay: 1.4, sustain: 0.05, release: 1.4 }, delay(c, verb, "4n.", 0.3, 0.25));
    line(c, keys, "F#4 . A4 . D5 . . . C#5 . A4 . . . . . B4 . D5 . F#5 . . . E5 . C#5 . . . . .", "8n", "4n", "2m");
  },
};

const dawn: TrackSpec = {
  build(c) {
    const room = dread(c, 0.5);
    drone(c, ["D1", "A1"], room, "2m", -18);
    chords(c, cluster(c, room, -19), [["D3", "F3", "A3"], ["A#2", "D3", "F3"], ["G2", "A#2", "D3"], ["A2", "C#3", "E3"]], "1m", "1m", 0, "12m");
    const d = drums(c, room, -7);
    heartbeat(c, d, "4m", "10m");
    hits(c, "X.......X...x...", (t, a) => d.thump.triggerAttackRelease("D1", "8n", t, a ? 1 : 0.7), "8m", "12m");
    // out of the dark: a major chord and a bell at the end
    const light = poly(c, "fatsawtooth", -11, { attack: 0.3, decay: 1, sustain: 0.7, release: 4 }, 2600, room);
    const b = bell(c, room, -10);
    c.T.getTransport().schedule((t) => {
      light.triggerAttackRelease(["D2", "A2", "D3", "F#3", "A3", "D4", "F#4"], "2m", t, 0.9);
      b.triggerAttackRelease("D4", "2n", t, 0.9);
      d.thump.triggerAttackRelease("D1", "2n", t, 1);
    }, "12m");
  },
};

const glitch: TrackSpec = {
  build(c) {
    const room = dread(c, 0.4);
    const r = rng(hashString("glitch-mode"));
    const box = musicBox(c, delay(c, room, "16n", 0.45, 0.3), -15);
    const scale = ["B4", "C5", "D5", "F5", "F#5", "A#5", "B5", "D6"];
    seq(c, Array.from({ length: 64 }, () => (r() < 0.5 ? REST : scale[Math.floor(r() * scale.length)])), "16n", (t, n) => n !== REST && box.triggerAttackRelease(n, "16n", t, 0.7));
    drone(c, ["B0", "C2"], room, "2m", -20);
    const d = drums(c, room, -8);
    hits(c, "x..x..x...x.x...", (t) => d.thump.triggerAttackRelease("B0", "8n", t, 0.8), "2m");
  },
};

export const horrorTracks: Record<string, TrackSpec> = {
  "boot-sequence": briefing,
  "nine-twenty-five": studyInTheDark,
  "out-of-band": signal,
  lumina: candlelight,
  "rep-counter": pursuit,
  "on-chain": chains,
  fleetmind: chase,
  "stack-overflow": reprise,
  "off-the-clock": safeRoom,
  "hire-me": dawn,
  "debug-mode": glitch,
};
