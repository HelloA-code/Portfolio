import type { Metadata } from "next";
import { Cinzel, Special_Elite } from "next/font/google";
import { profile } from "@/data/portfolio";
import { HorrorBackground } from "@/components/horror/HorrorBackground";
import { HorrorHud } from "@/components/horror/HorrorHud";
import { Subtitles } from "@/components/horror/Subtitles";
import { ThemeVariant } from "@/components/layout/ThemeVariant";

const special = Special_Elite({ variable: "--font-special", subsets: ["latin"], weight: "400" });
const cinzel = Cinzel({ variable: "--font-cinzel", subsets: ["latin"], weight: ["500", "700"] });

export const metadata: Metadata = {
  title: { absolute: `Field Dossier · ${profile.name}`, template: `%s · Field Dossier · ${profile.name}` },
  description: `${profile.name}'s portfolio as a survival-horror field dossier: inventory, case files, upgrades and a safe room.`,
};

/** Horror mode shell: its own fonts, background, HUD and subtitles. Content comes from the same portfolio.ts. */
export default function MissionLayout({ children }: LayoutProps<"/mission">) {
  return (
    <div className={`horror ${special.variable} ${cinzel.variable} min-h-dvh`}>
      <ThemeVariant variant="horror" />
      <HorrorBackground />
      <HorrorHud />
      <main id="main" className="mx-auto max-w-[1280px] px-4 pb-40 pt-20 sm:px-6 lg:pb-28 lg:pt-24">
        {children}
      </main>
      <Subtitles />
    </div>
  );
}
