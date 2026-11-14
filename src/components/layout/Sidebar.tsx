"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Skull } from "lucide-react";
import { profile } from "@/data/portfolio";
import { isActive, navSections } from "@/lib/nav";
import { useUi } from "@/store/ui";
import { Avatar } from "@/components/ui/Avatar";

export function Sidebar() {
  const pathname = usePathname();
  const setPalette = useUi((s) => s.setPalette);

  return (
    <aside className="glass fixed inset-y-0 left-0 z-30 hidden w-[240px] flex-col border-y-0 border-l-0 bg-black/40 px-3 pb-6 pt-5 lg:flex">
      <Link href="/profile" className="mb-5 flex items-center gap-2.5 rounded-lg px-2">
        <Avatar size={34} />
        <span className="leading-tight">
          <span className="block text-[15px] font-semibold">{profile.name}</span>
          <span className="mono-label !text-[9px]">sys.status: building</span>
        </span>
      </Link>

      <button
        type="button"
        onClick={() => setPalette(true)}
        className="mb-5 flex h-9 items-center gap-2 rounded-lg border border-line bg-white/5 px-3 text-left text-sm text-muted transition-colors hover:bg-white/10"
      >
        <Search size={15} />
        <span className="flex-1">Search</span>
        <kbd className="font-mono text-[10px] text-faint">Ctrl K</kbd>
      </button>

      <nav aria-label="Main" className="no-scrollbar flex-1 space-y-5 overflow-y-auto">
        {navSections.map((section, i) => (
          <div key={i}>
            {section.title && <p className="mono-label mb-1.5 px-2 !text-[10px]">{section.title}</p>}
            <ul className="space-y-0.5">
              {section.items.map(({ href, label, icon: Icon }) => {
                const active = isActive(pathname, href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={`flex h-9 items-center gap-3 rounded-lg px-2.5 text-[14px] font-medium transition-colors ${
                        active ? "bg-white/10 text-fg" : "text-fg/75 hover:bg-white/5 hover:text-fg"
                      }`}
                    >
                      <Icon size={17} className={active ? "text-pink drop-shadow-[0_0_6px_rgba(255,45,117,0.8)]" : "text-pink/80"} />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <Link
        href="/mission"
        className="mb-3 flex items-center gap-2.5 rounded-lg border border-[#a3201c]/50 bg-[#a3201c]/10 px-3 py-2 text-[13px] font-semibold text-[#ff8a70] transition-colors hover:bg-[#a3201c]/25"
      >
        <Skull size={16} /> Horror Mode
      </Link>
      <p className="mono-label px-2 !text-[9px] text-faint">v1.0 · {profile.location}</p>
    </aside>
  );
}
