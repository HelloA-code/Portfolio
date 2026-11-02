/** Deterministic helpers so generated art is identical on server and client. */

export function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** mulberry32: tiny seeded PRNG returning floats in [0, 1) */
export function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Palette = {
  hue: number;
  /** dominant colour, used for album page backgrounds */
  base: string;
  colors: [string, string, string, string];
};

export function paletteFor(seed: string, hue?: number): Palette {
  const r = rng(hashString(seed));
  const h = hue ?? Math.floor(r() * 360);
  const spread = 25 + r() * 35;
  const colors: Palette["colors"] = [
    `hsl(${h} 85% 55%)`,
    `hsl(${(h + spread) % 360} 90% 60%)`,
    `hsl(${(h - spread + 360) % 360} 80% 42%)`,
    `hsl(${(h + 150) % 360} 70% 40%)`,
  ];
  return { hue: h, base: `hsl(${h} 70% 35%)`, colors };
}
