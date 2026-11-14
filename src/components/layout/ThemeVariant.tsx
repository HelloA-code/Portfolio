"use client";

import { useEffect } from "react";
import type { ScoreVariant } from "@/lib/audio/engine";
import { usePlayer } from "@/store/player";

/** Tells the player which score to use while this theme's layout is on screen. */
export function ThemeVariant({ variant }: { variant: ScoreVariant }) {
  const setVariant = usePlayer((s) => s.setVariant);
  useEffect(() => setVariant(variant), [variant, setVariant]);
  return null;
}
