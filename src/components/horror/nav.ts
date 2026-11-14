import { BookOpen, Briefcase, Crosshair, FileText, Flame, Wrench, type LucideIcon } from "lucide-react";

export const horrorNav: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/mission", label: "Briefing", icon: Crosshair },
  { href: "/mission/inventory", label: "Inventory", icon: Briefcase },
  { href: "/mission/files", label: "Files", icon: FileText },
  { href: "/mission/upgrades", label: "Upgrades", icon: Wrench },
  { href: "/mission/diary", label: "Diary", icon: BookOpen },
  { href: "/mission/safe-room", label: "Safe Room", icon: Flame },
];

export const isHorrorActive = (pathname: string, href: string) =>
  href === "/mission" ? pathname === "/mission" : pathname === href || pathname.startsWith(`${href}/`);
