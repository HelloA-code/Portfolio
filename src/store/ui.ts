import { create } from "zustand";

type UiState = {
  paletteOpen: boolean;
  synthwave: boolean;
  toast: string | null;
  setPalette: (open: boolean) => void;
  toggleSynthwave: () => void;
  showToast: (msg: string) => void;
};

let toastTimer: ReturnType<typeof setTimeout> | undefined;

export const useUi = create<UiState>()((set) => ({
  paletteOpen: false,
  synthwave: false,
  toast: null,
  setPalette: (paletteOpen) => set({ paletteOpen }),
  toggleSynthwave: () => set((s) => ({ synthwave: !s.synthwave })),
  showToast: (toast) => {
    clearTimeout(toastTimer);
    set({ toast });
    toastTimer = setTimeout(() => set({ toast: null }), 3500);
  },
}));
