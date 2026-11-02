"use client";

import { Copy, Ellipsis, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useUi } from "@/store/ui";

/** The "…" menu on album pages: copy link and native share. */
export function ShareMenu({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const showToast = useUi((s) => s.showToast);

  useEffect(() => {
    if (!open) return;
    const close = (e: Event) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !ref.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("pointerdown", close);
    window.addEventListener("keydown", close);
    return () => {
      window.removeEventListener("pointerdown", close);
      window.removeEventListener("keydown", close);
    };
  }, [open]);

  const copy = () => {
    void navigator.clipboard?.writeText(window.location.href);
    showToast("Link copied");
    setOpen(false);
  };
  const share = async () => {
    setOpen(false);
    try {
      await navigator.share({ title, url: window.location.href });
    } catch {
      /* cancelled */
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="More options"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="glass grid size-11 place-items-center rounded-full hover:bg-white/10"
      >
        <Ellipsis size={20} />
      </button>
      {open && (
        <div role="menu" className="glass absolute left-0 top-12 z-20 w-48 rounded-xl bg-[#121219]/95 p-1.5 shadow-2xl">
          <button role="menuitem" onClick={copy} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-white/10">
            <Copy size={16} /> Copy Link
          </button>
          {typeof navigator !== "undefined" && "share" in navigator && (
            <button role="menuitem" onClick={share} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-white/10">
              <Share2 size={16} /> Share…
            </button>
          )}
        </div>
      )}
    </div>
  );
}
