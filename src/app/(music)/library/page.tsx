import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Skull } from "lucide-react";
import { navSections } from "@/lib/nav";
import { PageHeader } from "@/components/ui/primitives";
import { Avatar } from "@/components/ui/Avatar";
import { profile } from "@/data/portfolio";

export const metadata: Metadata = { title: "Library" };

/** Mobile "Library" tab: everything that lives in the desktop sidebar. */
export default function LibraryPage() {
  return (
    <>
      <PageHeader kicker="library" title="Library" />
      <Link href="/profile" className="glass glow-border mb-8 flex items-center gap-4 rounded-[var(--radius-card)] p-4">
        <Avatar size={56} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[17px] font-semibold">{profile.name}</span>
          <span className="block text-sm text-muted">View profile</span>
        </span>
        <ChevronRight size={18} className="text-faint" />
      </Link>
      <Link
        href="/mission"
        className="mb-8 flex items-center gap-4 rounded-[var(--radius-card)] border border-[#a3201c]/50 bg-[#a3201c]/10 p-4"
      >
        <Skull size={22} className="text-[#ff8a70]" />
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-[#ff8a70]">Horror Mode</span>
          <span className="block text-sm text-muted">The same portfolio as a survival-horror dossier</span>
        </span>
        <ChevronRight size={18} className="text-faint" />
      </Link>
      {navSections.slice(1).map((s) => (
        <section key={s.title} className="mb-8">
          <p className="mono-label mb-2">{s.title}</p>
          <ul className="divide-y divide-line/70 border-y border-line/70">
            {s.items.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link href={href} className="flex items-center gap-4 px-1 py-3.5 text-[17px] hover:bg-white/5">
                  <Icon size={20} className="text-pink" />
                  <span className="flex-1">{label}</span>
                  <ChevronRight size={18} className="text-faint" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <Link href="/charts" className="flex items-center gap-4 border-y border-line/70 px-1 py-3.5 text-[17px] hover:bg-white/5">
        <span className="flex-1">Charts</span>
        <ChevronRight size={18} className="text-faint" />
      </Link>
    </>
  );
}
