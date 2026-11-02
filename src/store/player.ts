import { create } from "zustand";
import { albumTitle, getTrack, profile } from "@/data/portfolio";
import { engine } from "@/lib/audio/engine";
import { trackDuration, visibleTracks } from "@/lib/audio/meta";
import { useUi } from "./ui";

export type Repeat = "off" | "all" | "one";
type Status = "idle" | "loading" | "playing" | "paused";

type PlayerState = {
  queue: string[];
  index: number;
  status: Status;
  position: number;
  duration: number;
  shuffle: boolean;
  repeat: Repeat;
  volume: number;
  muted: boolean;
  listened: string[];
  bonusUnlocked: boolean;
  sheetOpen: boolean;
  queueOpen: boolean;

  playTrack: (id: string) => Promise<void>;
  toggle: () => void;
  next: (auto?: boolean) => void;
  prev: () => void;
  seek: (seconds: number) => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  setSheet: (open: boolean) => void;
  setQueueOpen: (open: boolean) => void;
  hydrate: () => void;
};

const PREFS_KEY = "aditya-exe:prefs";
const LISTEN_THRESHOLD = 8; // seconds before a track counts as "listened"
const albumOrder = (bonus: boolean) => visibleTracks(bonus).map((t) => t.id);

function savePrefs(s: Pick<PlayerState, "volume" | "muted" | "bonusUnlocked">) {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify({ volume: s.volume, muted: s.muted, bonusUnlocked: s.bonusUnlocked }));
  } catch {
    /* storage unavailable: fine */
  }
}

function shuffled(ids: string[], first: string) {
  const rest = ids.filter((id) => id !== first);
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }
  return [first, ...rest];
}

function mediaSession(id: string, playing: boolean) {
  if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
  const track = getTrack(id);
  if (!track) return;
  navigator.mediaSession.metadata = new MediaMetadata({
    title: track.title,
    artist: profile.name,
    album: albumTitle,
    artwork: [{ src: "/opengraph-image", sizes: "1200x630", type: "image/png" }],
  });
  navigator.mediaSession.playbackState = playing ? "playing" : "paused";
}

let rafId = 0;
let playToken = 0;

export const usePlayer = create<PlayerState>()((set, get) => {
  function tick() {
    const s = get();
    if (s.status !== "playing") return;
    const position = engine.position();
    if (Math.abs(position - s.position) > 0.08) set({ position });
    const id = s.queue[s.index];
    if (position > LISTEN_THRESHOLD && !s.listened.includes(id)) {
      const listened = [...s.listened, id];
      set({ listened });
      if (!s.bonusUnlocked && listened.length >= 3) unlockBonus();
    }
    rafId = requestAnimationFrame(tick);
  }

  function startTicker() {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(tick);
  }

  function unlockBonus() {
    const s = get();
    set({ bonusUnlocked: true, queue: s.queue.includes("debug-mode") ? s.queue : [...s.queue, "debug-mode"] });
    savePrefs(get());
    useUi.getState().showToast("Bonus track unlocked: Debug Mode");
  }

  return {
    queue: albumOrder(false),
    index: 0,
    status: "idle",
    position: 0,
    duration: trackDuration(albumOrder(false)[0]),
    shuffle: false,
    repeat: "off",
    volume: 0.8,
    muted: false,
    listened: [],
    bonusUnlocked: false,
    sheetOpen: false,
    queueOpen: false,

    async playTrack(id) {
      let { queue } = get();
      if (!queue.includes(id)) queue = [...queue, id];
      const index = queue.indexOf(id);
      const token = ++playToken;
      set({ queue, index, status: "loading", position: 0, duration: trackDuration(id) });
      await engine.play(id, () => {
        if (token === playToken) handleEnded();
      });
      if (token !== playToken) return;
      engine.setVolume(get().volume, get().muted);
      set({ status: "playing" });
      mediaSession(id, true);
      startTicker();
    },

    toggle() {
      const s = get();
      const id = s.queue[s.index];
      if (s.status === "playing") {
        engine.pause();
        set({ status: "paused" });
        mediaSession(id, false);
      } else if (s.status === "paused" && engine.loaded) {
        engine.resume();
        set({ status: "playing" });
        mediaSession(id, true);
        startTicker();
      } else if (s.status !== "loading") {
        void s.playTrack(id);
      }
    },

    next(auto = false) {
      const s = get();
      let i = s.index + 1;
      if (i >= s.queue.length) {
        if (s.repeat === "all" || !auto) i = 0;
        else {
          engine.stop();
          set({ status: "idle", index: 0, position: 0, duration: trackDuration(s.queue[0]) });
          return;
        }
      }
      void s.playTrack(s.queue[i]);
    },

    prev() {
      const s = get();
      if (s.position > 3 && s.status !== "idle") return s.seek(0);
      const i = s.index === 0 ? s.queue.length - 1 : s.index - 1;
      void s.playTrack(s.queue[i]);
    },

    seek(seconds) {
      engine.seek(seconds);
      set({ position: seconds });
    },

    setVolume(volume) {
      set({ volume, muted: volume === 0 ? get().muted : false });
      engine.setVolume(volume, get().muted);
      savePrefs(get());
    },

    toggleMute() {
      const muted = !get().muted;
      set({ muted });
      engine.setVolume(get().volume, muted);
      savePrefs(get());
      useUi.getState().showToast(muted ? "Muted" : "Sound on");
    },

    toggleShuffle() {
      const s = get();
      const id = s.queue[s.index];
      const order = albumOrder(s.bonusUnlocked);
      const queue = s.shuffle ? order : shuffled(order, id);
      set({ shuffle: !s.shuffle, queue, index: queue.indexOf(id) });
    },

    cycleRepeat() {
      const next: Record<Repeat, Repeat> = { off: "all", all: "one", one: "off" };
      set({ repeat: next[get().repeat] });
    },

    setSheet: (sheetOpen) => set({ sheetOpen }),
    setQueueOpen: (queueOpen) => set({ queueOpen }),

    hydrate() {
      try {
        const raw = localStorage.getItem(PREFS_KEY);
        if (!raw) return;
        const p = JSON.parse(raw) as Partial<Pick<PlayerState, "volume" | "muted" | "bonusUnlocked">>;
        const bonusUnlocked = p.bonusUnlocked === true;
        set({
          volume: typeof p.volume === "number" ? Math.min(1, Math.max(0, p.volume)) : 0.8,
          muted: p.muted === true,
          bonusUnlocked,
          queue: albumOrder(bonusUnlocked),
        });
        engine.setVolume(get().volume, get().muted);
      } catch {
        /* ignore bad or blocked storage */
      }
    },
  };

  function handleEnded() {
    const s = get();
    if (s.repeat === "one") void s.playTrack(s.queue[s.index]);
    else s.next(true);
  }
});

export const currentTrackId = (s: Pick<PlayerState, "queue" | "index">) => s.queue[s.index];
