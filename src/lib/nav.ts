import {
  CircleUser,
  Disc3,
  GraduationCap,
  House,
  LayoutGrid,
  Mail,
  MicVocal,
  Radio,
  Sparkles,
  Tags,
  Trophy,
  type LucideIcon,
} from "lucide-react";

export type NavItem = { href: string; label: string; icon: LucideIcon };

export const navSections: { title?: string; items: NavItem[] }[] = [
  {
    items: [
      { href: "/", label: "Home", icon: House },
      { href: "/profile", label: "Profile", icon: CircleUser },
      { href: "/browse", label: "Browse", icon: LayoutGrid },
      { href: "/charts", label: "Charts", icon: Trophy },
    ],
  },
  {
    title: "Library",
    items: [
      { href: "/albums", label: "Albums", icon: Disc3 },
      { href: "/genres", label: "Genres", icon: Tags },
      { href: "/discography", label: "Discography", icon: GraduationCap },
    ],
  },
  {
    title: "Playlists",
    items: [
      { href: "/about", label: "About Me", icon: MicVocal },
      { href: "/featured-on", label: "Featured On", icon: Radio },
      { href: "/liner-notes", label: "Liner Notes", icon: Sparkles },
      { href: "/contact", label: "Contact", icon: Mail },
    ],
  },
];

export const allNavItems = navSections.flatMap((s) => s.items);

export const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
