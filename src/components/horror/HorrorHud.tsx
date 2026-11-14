"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Loader2, LogOut, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { getTrack } from "@/data/portfolio";
import { visibleTracks } from "@/lib/audio/meta";
import { currentTrackId, usePlayer } from "@/store/player";
import { horrorNav, isHorrorActive } from "./nav";
import { Vitals } from "./Vitals";

function AudioControls({ compact }: { compact?: boolean }) {
  const id = usePlayer(currentTrackId);
  const status = usePlayer((s) => s.status);
  const bonus = usePlayer((s) => s.bonusUnlocked);
  const muted = usePlayer((s) => s.muted);
  const { toggle, next, prev, toggleMute } = usePlayer.getState();
  const track = getTrack(id);
  const number = visibleTracks(bonus).findIndex((t) => t.id === id) + 1;
  const btn = "grid size-8 place-items-center rounded text-h-dim hover:bg-white/5 hover:text-h-ink";

  return (
    <div className="flex min-w-0 items-center gap-1">
      {!compact && (
        <button type="button" aria-label="Previous track" onClick={prev} className={btn}>
          <SkipBack size={15} />
        </button>
      )}
      <button
        type="button"
        aria-label={status === "playing" ? "Pause" : "Play"}
        onClick={toggle}
        className="grid size-9 place-items-center rounded border border-h-amber/50 text-h-amber hover:bg-h-amber/10"
      >
        {status === "loading" ? <Loader2 size={16} className="animate-spin" /> : status === "playing" ? <Pause size={16} /> : <Play size={16} />}
      </button>
      <button type="button" aria-label="Next track" onClick={() => next()} className={btn}>
        <SkipForward size={15} />
      </button>
      {!compact && (
        <span className="ml-2 hidden min-w-0 xl:block">
          <span className="h-label block !text-[9px]">{status === "idle" ? "Audio log" : `Track ${String(number).padStart(2, "0")}`}</span>
          <span className="block max-w-[180px] truncate text-[13px] text-h-ink">{status === "idle" ? "Press play" : track?.title}</span>
        </span>
      )}
      <button type="button" aria-label={muted ? "Unmute" : "Mute"} onClick={toggleMute} className={`${btn} ${muted ? "!text-h-blood" : ""}`}>
        {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
      </button>
    </div>
  );
}

/** Top HUD (desktop nav + audio) and a bottom tab bar on phones. */
export function HorrorHud() {
  const pathname = usePathname();

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-h-line bg-gradient-to-b from-black/95 to-black/70 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1280px] items-center gap-4 px-4 sm:px-6">
          <Link href="/mission" className="shrink-0">
            <span className="h-title block text-[15px] text-h-ink">A.K.S.</span>
            <span className="h-label block !text-[9px]">Field dossier</span>
          </Link>
          <nav aria-label="Mission" className="mx-auto hidden items-center gap-1 lg:flex">
            {horrorNav.map(({ href, label }) => {
              const active = isHorrorActive(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`relative px-3 py-2 text-[13px] uppercase tracking-[0.14em] transition-colors ${active ? "text-h-amber" : "text-h-dim hover:text-h-ink"}`}
                >
                  {label}
                  {active && <span className="absolute inset-x-3 -bottom-[9px] h-px bg-h-amber shadow-[0_0_8px_rgba(214,162,74,0.9)]" />}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-3 lg:ml-0">
            <Vitals className="hidden sm:inline-flex" />
            <span className="hidden lg:block">
              <AudioControls />
            </span>
            <span className="lg:hidden">
              <AudioControls compact />
            </span>
            <Link href="/" title="Exit to the music app" aria-label="Exit to the music app" className="grid size-9 place-items-center rounded text-h-dim hover:bg-white/5 hover:text-h-ink">
              <LogOut size={17} />
            </Link>
          </div>
        </div>
      </header>

      <nav aria-label="Mission tabs" className="fixed inset-x-0 bottom-0 z-40 flex border-t border-h-line bg-black/90 pb-[max(env(safe-area-inset-bottom),6px)] backdrop-blur-md lg:hidden">
        {horrorNav.map(({ href, label, icon: Icon }) => {
          const active = isHorrorActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex flex-1 flex-col items-center gap-1 pt-2 text-[9px] uppercase tracking-[0.1em] ${active ? "text-h-amber" : "text-h-faint"}`}
            >
              <Icon size={19} />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
