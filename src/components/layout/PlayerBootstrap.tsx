"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { usePlayer } from "@/store/player";
import { useUi } from "@/store/ui";

const KONAMI = ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a"];

function isTyping(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}

/** Restores prefs, wires keyboard shortcuts, media keys and easter eggs. Renders the toast. */
export function PlayerBootstrap() {
  const toast = useUi((s) => s.toast);

  useEffect(() => {
    usePlayer.getState().hydrate();

    if ("mediaSession" in navigator) {
      const ms = navigator.mediaSession;
      const p = () => usePlayer.getState();
      ms.setActionHandler("play", () => p().toggle());
      ms.setActionHandler("pause", () => p().toggle());
      ms.setActionHandler("nexttrack", () => p().next());
      ms.setActionHandler("previoustrack", () => p().prev());
      ms.setActionHandler("seekto", (d) => d.seekTime !== undefined && p().seek(d.seekTime));
    }

    let typed = "";
    let konami: string[] = [];

    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const key = e.key.toLowerCase();

      // Konami code works everywhere
      konami = [...konami, key].slice(-KONAMI.length);
      if (konami.join() === KONAMI.join()) {
        useUi.getState().toggleSynthwave();
        useUi.getState().showToast(useUi.getState().synthwave ? "Synthwave mode: ON" : "Synthwave mode: off");
        konami = [];
      }

      if (isTyping(e.target) || useUi.getState().paletteOpen) return;
      const player = usePlayer.getState();
      const onControl = e.target instanceof HTMLElement && e.target.closest("button, a, [role=slider], input");

      if (key === " " && !onControl) {
        e.preventDefault();
        player.toggle();
      } else if (key === "arrowright" && !onControl && player.status !== "idle") {
        player.next();
      } else if (key === "arrowleft" && !onControl && player.status !== "idle") {
        player.prev();
      } else if (key === "m") {
        player.toggleMute();
      } else if (key === "/") {
        e.preventDefault();
        useUi.getState().setPalette(true);
      }

      if (key.length === 1) {
        typed = (typed + key).slice(-4);
        if (typed === "hire") {
          void player.playTrack("hire-me");
          player.setQueueOpen(false);
          player.setSheet(true);
          useUi.getState().showToast("You said the magic word.");
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex justify-center lg:top-20">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast}
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass rounded-full bg-black/70 px-4 py-2 font-mono text-[12px] text-fg shadow-[0_0_24px_rgba(139,92,246,0.4)]"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
