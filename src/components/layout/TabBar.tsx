"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, LayoutGrid, Library, Search } from "lucide-react";
import { useUi } from "@/store/ui";

const tabs = [
  { href: "/", label: "Home", icon: House, match: (p: string) => p === "/" },
  { href: "/browse", label: "Browse", icon: LayoutGrid, match: (p: string) => p.startsWith("/browse") || p.startsWith("/projects") },
  { href: "/library", label: "Library", icon: Library, match: (p: string) => p !== "/" && !p.startsWith("/browse") && !p.startsWith("/projects") },
];

/** iOS-style tab bar, mobile and tablet only */
export function TabBar() {
  const pathname = usePathname();
  const setPalette = useUi((s) => s.setPalette);
  const item = "flex flex-1 flex-col items-center gap-1 pt-2 text-[10px] font-medium";

  return (
    <nav
      aria-label="Tabs"
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-line bg-black/70 pb-[max(env(safe-area-inset-bottom),8px)] backdrop-blur-2xl lg:hidden"
    >
      {tabs.slice(0, 2).map(({ href, label, icon: Icon, match }) => (
        <Link key={href} href={href} aria-current={match(pathname) ? "page" : undefined} className={`${item} ${match(pathname) ? "text-pink" : "text-fg/60"}`}>
          <Icon size={22} />
          {label}
        </Link>
      ))}
      <button type="button" onClick={() => setPalette(true)} className={`${item} text-fg/60`}>
        <Search size={22} />
        Search
      </button>
      {tabs.slice(2).map(({ href, label, icon: Icon, match }) => (
        <Link key={href} href={href} aria-current={match(pathname) ? "page" : undefined} className={`${item} ${match(pathname) ? "text-pink" : "text-fg/60"}`}>
          <Icon size={22} />
          {label}
        </Link>
      ))}
    </nav>
  );
}
