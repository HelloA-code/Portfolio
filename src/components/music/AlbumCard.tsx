"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, ViewTransition, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Copy, ExternalLink, Play, SquareArrowOutUpRight } from "lucide-react";
import type { Project } from "@/data/portfolio";
import { projectCover } from "@/lib/covers";
import { usePlayer } from "@/store/player";
import { useUi } from "@/store/ui";
import { CoverArt } from "./CoverArt";

type Props = {
  project: Project;
  /** enable the shared cover morph into the album page (use once per page per project) */
  morph?: boolean;
  className?: string;
};

export function AlbumCard({ project, morph, className = "" }: Props) {
  const href = `/projects/${project.slug}`;
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  const press = useRef<{ timer?: ReturnType<typeof setTimeout>; fired: boolean }>({ fired: false });

  const cover = <CoverArt {...projectCover(project)} />;

  return (
    <>
      <Link
        href={href}
        className={`group block rounded-[var(--radius-cover)] ${className}`}
        onContextMenu={(e) => {
          e.preventDefault();
          setMenu({ x: e.clientX, y: e.clientY });
        }}
        onPointerDown={(e) => {
          if (e.pointerType !== "touch") return;
          press.current.fired = false;
          const { clientX, clientY } = e;
          press.current.timer = setTimeout(() => {
            press.current.fired = true;
            setMenu({ x: clientX, y: clientY });
          }, 550);
        }}
        onPointerUp={() => clearTimeout(press.current.timer)}
        onPointerMove={() => clearTimeout(press.current.timer)}
        onClick={(e) => {
          if (press.current.fired) e.preventDefault();
        }}
      >
        <div className="relative shadow-[0_10px_30px_-12px_rgba(0,0,0,0.8)] transition-transform duration-300 group-hover:-translate-y-0.5">
          {morph ? (
            <ViewTransition name={`cover-${project.slug}`} share="morph" default="none">
              {cover}
            </ViewTransition>
          ) : (
            cover
          )}
          {project.status === "In progress" && (
            <span className="mono-label absolute left-2 top-2 z-10 rounded-full bg-black/60 px-2 py-0.5 !text-[9px] !text-cyan backdrop-blur">
              ● Building
            </span>
          )}
        </div>
        <p className="mt-2 truncate text-[14px] font-medium">{project.title}</p>
        <p className="truncate text-[13px] text-muted">{project.subtitle}</p>
      </Link>
      {menu && <CoverMenu project={project} href={href} at={menu} onClose={() => setMenu(null)} />}
    </>
  );
}

function CoverMenu({ project, href, at, onClose }: { project: Project; href: string; at: { x: number; y: number }; onClose: () => void }) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const playTrack = usePlayer((s) => s.playTrack);
  const showToast = useUi((s) => s.showToast);

  useEffect(() => {
    ref.current?.querySelector<HTMLButtonElement>("button:not(:disabled)")?.focus();
    const close = (e: Event) => {
      if (e instanceof KeyboardEvent && e.key !== "Escape") return;
      if (e instanceof PointerEvent && ref.current?.contains(e.target as Node)) return;
      onClose();
    };
    window.addEventListener("pointerdown", close);
    window.addEventListener("keydown", close);
    window.addEventListener("scroll", onClose, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", close);
      window.removeEventListener("keydown", close);
      window.removeEventListener("scroll", onClose);
    };
  }, [onClose]);

  const x = Math.min(at.x, window.innerWidth - 220);
  const y = Math.min(at.y, window.innerHeight - 200);

  const item = (icon: ReactNode, label: string, action: () => void, disabled = false) => (
    <button
      role="menuitem"
      disabled={disabled}
      onClick={() => {
        action();
        onClose();
      }}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-white/10 focus:bg-white/10 focus:outline-none disabled:opacity-40"
    >
      {icon}
      {label}
    </button>
  );

  return createPortal(
    <div
      ref={ref}
      role="menu"
      aria-label={`${project.title} options`}
      style={{ left: x, top: y }}
      className="glass fixed z-[90] w-52 rounded-xl bg-[#121219]/90 p-1.5 shadow-2xl"
    >
      {item(<SquareArrowOutUpRight size={16} />, "Open", () => router.push(href))}
      {project.trackId && item(<Play size={16} />, "Play Track", () => void playTrack(project.trackId!))}
      {item(<ExternalLink size={16} />, project.github ? "View on GitHub" : "GitHub (coming soon)", () => window.open(project.github!, "_blank", "noopener"), !project.github)}
      {item(<Copy size={16} />, "Copy Link", () => {
        void navigator.clipboard?.writeText(`${window.location.origin}${href}`);
        showToast("Link copied");
      })}
    </div>,
    document.body,
  );
}
