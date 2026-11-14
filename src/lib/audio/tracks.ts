/**
 * The music for "ADITYA.EXE". Every track is synthesised live with Tone.js:
 * no samples, no copyrighted audio. This module is only loaded after the first ▶ press.
 *
 * Sound: slow, dreamy, cinematic pop. Lush strings, a wobbling "old tape" bus,
 * big reverb, slow hip-hop drums, bells and harp. All melodies are original.
 *
 * Each builder schedules loops on the Transport starting at bar 0. Tempo and length
 * come from ./meta.ts. Patterns use 16 characters per bar: "x" = hit, "X" = accent, "." = rest.
 */
import { rng, hashString } from "@/lib/seed";
import {
  REST,
  arp,
  beat,
  bells,
  chords,
  crackle,
  delay,
  dreamBus,
  harp,
  kit,
  lift,
  line,
  mono,
  piano,
  poly,
  roots,
  seq,
  strings,
  sub,
  up,
  type Ctx,
  type TrackSpec,
} from "./helpers";

export type { Ctx, TrackSpec };

/* ------------------------------ tracks ------------------------------ */

const bootSequence: TrackSpec = {
  build(c) {
    const bus = dreamBus(c, 0.92, 0.5);
    const prog = [
      ["A2", "C3", "E3", "A3"],
      ["F2", "A2", "C3", "E3"],
      ["C3", "E3", "G3", "B3"],
      ["E2", "G#2", "B2", "E3"],
    ];
    chords(c, strings(c, bus, -17), prog, "1m", "1m");
    const h = harp(c, delay(c, bus, "8n.", 0.35, 0.3), -14);
    seq(c, arp(c, prog, 16, 1, "rise"), "16n", (t, n) => h.triggerAttackRelease(n, "8n", t, 0.55), "2m");
    const b = bells(c, bus);
    line(c, b, "E5 . . . . . C5 . . . B4 . . . . . A4 . . . . . . . G#4 . . . . . . .", "8n", "4n", "6m");
    line(c, sub(c, -10), roots(prog, 1), "1m", "1m");
    crackle(c);
  },
};

const nineTwentyFive: TrackSpec = {
  swing: 0.2,
  build(c) {
    const bus = dreamBus(c, 0.8, 0.35);
    const prog = [
      ["F3", "A3", "C4", "E4"],
      ["E3", "G3", "B3", "D4"],
      ["D3", "F3", "A3", "C4"],
      ["C3", "E3", "G3", "B3"],
    ];
    chords(c, piano(c, bus), prog, "1m", "2n.", 0, undefined, 0.5);
    chords(c, strings(c, bus, -24, 900), prog, "1m", "1m", "4m");
    line(c, sub(c), "F1 . . . E1 . . . D1 . . . C1 . A0 .", "4n", "4n");
    const k = kit(c, { room: bus });
    beat(c, k, { kick: "x.........x.....x.......x.x.....", snare: "....x.......x...", hat: "x.x.x.x.x.x.x.x." }, "2m");
    const lead = harp(c, delay(c, bus, "4n", 0.3, 0.3), -12);
    line(c, lead, "A4 . C5 . . A4 G4 . F4 . . . . . . . G4 . E4 . . . D4 . E4 . . . . . . .", "8n", "4n", "4m");
    crackle(c, -36);
  },
};

const outOfBand: TrackSpec = {
  build(c) {
    const bus = dreamBus(c, 0.85, 0.4);
    const prog = [
      ["D3", "F3", "A3"],
      ["A#2", "D3", "F3"],
      ["G2", "A#2", "D3"],
      ["A2", "C#3", "E3"],
    ];
    chords(c, strings(c, bus, -18, 1000), prog, "1m", "1m");
    // sonar pings: telemetry polling the device
    const ping = bells(c, delay(c, bus, "4n.", 0.45, 0.4), -16);
    line(c, ping, "A5 . . . . . . . A5 . . . . . . . . . . . . . . . D6 . . . . . . .", "8n", "8n", "1m");
    const bass = sub(c, -9);
    line(c, bass, "D2 D2 D2 D2 D2 D2 D2 D2 A#1 A#1 A#1 A#1 A#1 A#1 A#1 A#1 G1 G1 G1 G1 G1 G1 G1 G1 A1 A1 A1 A1 A1 A1 A1 A1", "8n", "16n", "2m");
    const k = kit(c, { room: bus });
    beat(c, k, { kick: "x.......x..x....", snare: "....x.......x...", hat: "..x...x...x...x." }, "4m");
    const lead = mono(c, "sawtooth", -22, { attack: 0.08, decay: 0.3, sustain: 0.7, release: 1 }, bus);
    line(c, lead, "F4 . . E4 D4 . . . F4 . G4 . A4 . . . A#4 . A4 . G4 . F4 . E4 . . . . . . .", "8n", "4n", "8m");
  },
};

const lumina: TrackSpec = {
  build(c) {
    const bus = dreamBus(c, 0.88, 0.42);
    const prog = [
      ["C3", "E3", "G3", "B3"],
      ["A2", "C3", "E3", "G3"],
      ["F2", "A2", "C3", "E3"],
      ["G2", "B2", "D3", "F3"],
    ];
    chords(c, strings(c, bus, -18, 1300), lift(c, prog, 12), "1m", "1m");
    chords(c, piano(c, bus, -14), lift(c, prog, 12), "2n", "4n", "2m", undefined, 0.4);
    line(c, sub(c), roots(prog, 1), "1m", "2n.");
    const k = kit(c, { room: bus });
    beat(c, k, { kick: "x.......x.......", snare: "....x.......x...", hat: "x.x.x.x.x.x.x.x." }, "4m");
    const b = bells(c, delay(c, bus, "8n.", 0.3, 0.3), -15);
    line(c, b, "G5 . E5 . . . D5 C5 . . . . E5 . . . A5 . G5 . . . E5 . . . D5 . . . . . F5 . E5 . D5 . . . C5 . . . . . . . . . . . . . . . . . . . . . . . . .", "8n", "4n", "6m");
  },
};

const repCounter: TrackSpec = {
  build(c) {
    const bus = dreamBus(c, 0.75, 0.32);
    const k = kit(c, { kick: -3, snare: -11, drive: 0.35, room: bus });
    beat(c, k, { kick: "X...x...x...x..." });
    beat(c, k, { snare: "....x.......x...", hat: "..x...x...x...x." }, "2m");
    // the counter: one rising bell per bar, like a rep ticking up
    const scale = ["E4", "G4", "A4", "B4", "D5", "E5", "G5", "A5", "B5", "D6", "E6", "G6", "A6", "B6"];
    const b = bells(c, delay(c, bus, "8n", 0.25, 0.3), -14);
    seq(c, scale.map((_, i) => i), "1m", (t, i) => b.triggerAttackRelease(scale[i], "4n", t, 0.9));
    chords(c, strings(c, bus, -20, 900), [["E3", "G3", "B3"], ["C3", "E3", "G3"], ["A2", "C3", "E3"], ["B2", "D#3", "F#3"]], "1m", "1m", "2m");
    line(c, sub(c, -6), "E1 . . E1 . . . . C1 . . C1 . . . . A0 . . A0 . . . . B0 . . B0 . . . .", "8n", "8n");
  },
};

const onChain: TrackSpec = {
  swing: 0.15,
  build(c) {
    const bus = dreamBus(c, 0.86, 0.4);
    const prog = [
      ["B2", "D3", "F#3"],
      ["G2", "B2", "D3"],
      ["D3", "F#3", "A3"],
      ["A2", "C#3", "E3"],
    ];
    chords(c, strings(c, bus, -20, 1100), lift(c, prog, 12), "1m", "1m");
    const h = harp(c, delay(c, bus, "16n.", 0.3, 0.25), -15);
    seq(c, arp(c, prog, 16, 2, "updown"), "16n", (t, n) => h.triggerAttackRelease(n, "16n", t, 0.5));
    line(c, sub(c), roots(prog, 1), "1m", "2n.");
    const k = kit(c, { room: bus });
    beat(c, k, { kick: "x......x..x.....", snare: "....x.......x...", hat: "x.xxx.x.x.xxx.x." }, "2m");
    // each "block" confirmed with a little two-note chime
    const b = bells(c, bus, -17);
    line(c, b, ". . . . . . . . . . . . F#6 B6 . . . . . . . . . . . . . . E6 A6 . .", "16n", "16n", "4m");
  },
};

const fleetmind: TrackSpec = {
  build(c) {
    const bus = dreamBus(c, 0.7, 0.3);
    const prog = [
      ["D3", "F3", "A3"],
      ["A#2", "D3", "F3"],
      ["C3", "E3", "G3"],
      ["A2", "C#3", "E3"],
    ];
    const bass = sub(c, -8);
    const roll = prog.flatMap((ch) => {
      const r = up(c, ch[0], -12);
      return Array.from({ length: 16 }, (_, i) => (i % 4 === 2 ? up(c, r, 12) : r));
    });
    seq(c, roll, "16n", (t, n) => bass.triggerAttackRelease(n, "32n", t, 0.85));
    const k = kit(c, { kick: -4, room: bus });
    beat(c, k, { kick: "x...x...x...x..x", hat: "xxXxxxXxxxXxxxXx" }, "2m");
    beat(c, k, { snare: "....x.......x..." }, "4m");
    // staccato string stabs
    const stab = poly(c, "fatsawtooth", -20, { attack: 0.01, decay: 0.2, sustain: 0, release: 0.2 }, 2400, bus);
    seq(
      c,
      prog.flatMap((_, i) => [..."x..x..x...x..x.."].map((ch) => (ch === "x" ? i : -1))),
      "16n",
      (t, i) => i >= 0 && stab.triggerAttackRelease(lift(c, [prog[i]], 12)[0], "16n", t, 0.7),
      "4m",
    );
    chords(c, strings(c, bus, -20, 1600), lift(c, prog, 12), "1m", "1m", "8m");
    const lead = mono(c, "sawtooth", -21, { attack: 0.05, decay: 0.2, sustain: 0.7, release: 0.6 }, delay(c, bus, "8n.", 0.3, 0.25));
    line(c, lead, "D5 . F5 . A5 . G5 F5 D5 . . . . . . . A#4 . D5 . F5 . A5 G5 F5 . . . . . . .", "8n", "8n", "8m");
  },
};

const stackOverflow: TrackSpec = {
  build(c) {
    const bus = dreamBus(c, 0.86, 0.38);
    const k = kit(c, { room: bus });
    beat(c, k, { kick: "x.......x.x.....", snare: "....x.......x...", hat: "x.x.x.x.x.x.x.x." }, "2m");
    const pad = strings(c, bus, -21, 1000);
    chords(c, pad, [["A3", "C4", "E4"], ["F3", "A3", "C4"], ["C4", "E4", "G4"], ["E3", "G#3", "B3"]], "1m", "1m");
    // 0-4: Boot Sequence harp
    const h = harp(c, delay(c, bus, "8n.", 0.3, 0.25), -15);
    seq(c, arp(c, [["A2", "C3", "E3"], ["F2", "A2", "C3"]], 16, 1, "rise"), "16n", (t, n) => h.triggerAttackRelease(n, "8n", t, 0.5), 0, "4m");
    // 4-8: Out of Band sonar
    const ping = bells(c, delay(c, bus, "4n.", 0.45, 0.4), -16);
    line(c, ping, "A5 . . . . . . . E6 . . . . . . .", "8n", "8n", "4m", "8m");
    // 8-12: Rep Counter rising bells
    const b = bells(c, bus, -15);
    line(c, b, "E5 . . . G5 . . . A5 . . . B5 . . . D6 . . . E6 . . . G6 . . . A6 . . .", "8n", "4n", "8m", "12m");
    // 12-16: Lumina melody
    const lead = harp(c, delay(c, bus, "8n.", 0.3, 0.3), -12);
    line(c, lead, "G5 . E5 . . . D5 C5 . . . . E5 . . . A5 . G5 . . . E5 . . . D5 . . . . .", "8n", "4n", "12m");
    line(c, sub(c), "A1 F1 C2 E1", "1m", "1m");
  },
};

const offTheClock: TrackSpec = {
  swing: 0.15,
  build(c) {
    const bus = dreamBus(c, 0.93, 0.5);
    const prog = [
      ["D3", "F#3", "A3", "C#4"],
      ["B2", "D3", "F#3", "A3"],
      ["G2", "B2", "D3", "F#3"],
      ["A2", "C#3", "E3", "G3"],
    ];
    chords(c, strings(c, bus, -18, 1400), prog, "1m", "1m");
    const pluck = harp(c, delay(c, bus, "4n.", 0.35, 0.3), -12);
    line(c, pluck, "F#5 . A5 . . D5 . . E5 . . F#5 . . . . D5 . F#5 . . B4 . . A4 . . . . . . . B4 . D5 . . G4 . . A4 . B4 . D5 . . . E5 . . C#5 . . A4 . . . . . . .", "8n", "4n", "2m");
    const k = kit(c, { kick: -10, snare: -18, hat: -32, room: bus });
    beat(c, k, { kick: "x.......x.......", snare: "....x.......x...", hat: "..x...x...x...x." }, "4m");
    line(c, sub(c, -9), roots(prog, 2), "1m", "1m");
    crackle(c, -38);
  },
};

const hireMe: TrackSpec = {
  build(c) {
    const bus = dreamBus(c, 0.9, 0.42);
    const prog = [
      ["D3", "F#3", "A3"],
      ["A2", "C#3", "E3"],
      ["B2", "D3", "F#3"],
      ["G2", "B2", "D3"],
    ];
    chords(c, strings(c, bus, -17, 1400), lift(c, prog, 12), "1m", "1m", 0, "12m");
    chords(c, piano(c, bus, -13), lift(c, prog, 12), "4n", "8n", "2m", "12m", 0.35);
    line(c, sub(c), roots(prog, 1), "1m", "1m", "2m", "12m");
    const k = kit(c, { room: bus });
    beat(c, k, { kick: "x.......x.x.....", snare: "....x.......x...", hat: "x.x.x.x.x.x.x.x." }, "4m", "12m");
    const b = bells(c, delay(c, bus, "8n.", 0.3, 0.3), -15);
    line(c, b, "F#5 . E5 . D5 . A4 . . . . . . . . . E5 . C#5 . A4 . . . . . . . . . . . D5 . F#5 . B5 . A5 . G5 . F#5 . E5 . D5 . . . . . . . . . . . . . . . . .", "8n", "4n", "6m", "12m");
    // the big final chord: strings, piano, bells and a cymbal swell
    const big = poly(c, "fatsawtooth", -11, { attack: 0.05, decay: 1, sustain: 0.6, release: 4 }, 3500, bus);
    const crash = c.add(new c.T.NoiseSynth({ noise: { type: "white" }, envelope: { attack: 0.002, decay: 3, sustain: 0 } }));
    crash.volume.value = -22;
    crash.connect(c.add(new c.T.Filter(5000, "highpass")).connect(bus));
    const finalBell = bells(c, bus, -12);
    c.T.getTransport().schedule((t) => {
      big.triggerAttackRelease(["D2", "A2", "D3", "F#3", "A3", "D4", "F#4", "A4"], "1m", t, 0.9);
      crash.triggerAttackRelease("1m", t, 1);
      finalBell.triggerAttackRelease("D6", "2n", t, 0.9);
      k.kick.triggerAttackRelease("A0", "4n", t, 1);
    }, "12m");
  },
};

const debugMode: TrackSpec = {
  build(c) {
    const bus = dreamBus(c, 0.8, 0.35);
    const r = rng(hashString("debug-mode"));
    const scale = ["B4", "D5", "E5", "F#5", "A5", "B5", "D6", "F#6"];
    // a slightly broken music box
    const box = bells(c, delay(c, bus, "16n", 0.4, 0.3), -15);
    const notes = Array.from({ length: 64 }, () => (r() < 0.45 ? REST : scale[Math.floor(r() * scale.length)]));
    seq(c, notes, "16n", (t, n) => n !== REST && box.triggerAttackRelease(n, "16n", t, 0.7));
    chords(c, strings(c, bus, -21, 900), [["B2", "D3", "F#3"], ["G2", "B2", "D3"]], "2m", "2m");
    const k = kit(c, { room: bus });
    beat(c, k, { kick: "x..x..x...x.x...", snare: "....x.......x..x", hat: "x.xxx.x.x.xxx.x." }, "2m");
    line(c, sub(c), "B1 . . . G1 . . .", "2n", "2n");
  },
};

export const tracks: Record<string, TrackSpec> = {
  "boot-sequence": bootSequence,
  "nine-twenty-five": nineTwentyFive,
  "out-of-band": outOfBand,
  lumina,
  "rep-counter": repCounter,
  "on-chain": onChain,
  fleetmind,
  "stack-overflow": stackOverflow,
  "off-the-clock": offTheClock,
  "hire-me": hireMe,
  "debug-mode": debugMode,
};
