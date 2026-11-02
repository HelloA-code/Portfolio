"use client";

import { Command } from "cmdk";
import { Disc3, Music2, Search, Tags } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { projects, skills } from "@/data/portfolio";
import { visibleTracks } from "@/lib/audio/meta";
import { projectCover } from "@/lib/covers";
import { allNavItems } from "@/lib/nav";
import { usePlayer } from "@/store/player";
import { useUi } from "@/store/ui";
import { CoverArt } from "@/components/music/CoverArt";

export function CommandPalette() {
  const open = useUi((s) => s.paletteOpen);
  const setOpen = useUi((s) => s.setPalette);
  const bonus = usePlayer((s) => s.bonusUnlocked);
  const playTrack = usePlayer((s) => s.playTrack);
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!useUi.getState().paletteOpen);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const row = (icon: ReactNode, title: string, sub?: string) => (
    <>
      {icon}
      <span className="min-w-0 flex-1">
        <span className="block truncate">{title}</span>
        {sub && <span className="block truncate text-xs text-muted">{sub}</span>}
      </span>
    </>
  );

  const item = "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-[14px] data-[selected=true]:bg-white/10";
  const group = "px-1";

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Search the portfolio"
      overlayClassName="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
      contentClassName="glass fixed left-1/2 top-[12vh] z-[81] w-[min(92vw,620px)] -translate-x-1/2 overflow-hidden rounded-2xl bg-[#0d0d14]/90 shadow-2xl"
    >
      <div className="flex items-center gap-3 border-b border-line px-4">
        <Search size={18} className="text-muted" />
        <Command.Input placeholder="Projects, skills, tracks, pages…" className="h-14 flex-1 bg-transparent text-[16px] outline-none placeholder:text-faint" />
        <kbd className="font-mono text-[10px] text-faint">ESC</kbd>
      </div>
      <Command.List className="no-scrollbar max-h-[60vh] overflow-y-auto pb-2">
        <Command.Empty className="px-4 py-8 text-center text-muted">No results.</Command.Empty>
        <Command.Group heading="Albums" className={group}>
          {projects.map((p) => (
            <Command.Item key={p.slug} value={`${p.title} ${p.subtitle} ${p.credits.join(" ")}`} onSelect={() => go(`/projects/${p.slug}`)} className={item}>
              {row(<CoverArt {...projectCover(p)} bare className="size-9 shrink-0 !rounded-md" />, p.title, p.subtitle)}
            </Command.Item>
          ))}
        </Command.Group>
        <Command.Group heading="ADITYA.EXE: Tracks" className={group}>
          {visibleTracks(bonus).map((t, i) => (
            <Command.Item
              key={t.id}
              value={`track ${t.title} ${t.about}`}
              onSelect={() => {
                setOpen(false);
                void playTrack(t.id);
              }}
              className={item}
            >
              {row(<Music2 size={18} className="shrink-0 text-pink" />, `${i + 1}. ${t.title}`, `Play · ${t.about}`)}
            </Command.Item>
          ))}
        </Command.Group>
        <Command.Group heading="Genres & Skills" className={group}>
          {skills.flatMap((g) =>
            [g.name, ...g.skills].map((name) => (
              <Command.Item key={`${g.slug}-${name}`} value={`${name} ${g.name}`} onSelect={() => go(`/genres/${g.slug}`)} className={item}>
                {row(<Tags size={18} className="shrink-0 text-cyan" />, name, name === g.name ? "Genre" : g.name)}
              </Command.Item>
            )),
          )}
        </Command.Group>
        <Command.Group heading="Pages" className={group}>
          {allNavItems.map(({ href, label, icon: Icon }) => (
            <Command.Item key={href} value={`page ${label}`} onSelect={() => go(href)} className={item}>
              {row(<Icon size={18} className="shrink-0 text-violet" />, label)}
            </Command.Item>
          ))}
          <Command.Item value="page resume pdf download" onSelect={() => go("/resume.pdf")} className={item}>
            {row(<Disc3 size={18} className="shrink-0 text-violet" />, "Download Resume (PDF)")}
          </Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}
