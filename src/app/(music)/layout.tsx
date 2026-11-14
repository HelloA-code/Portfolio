import { Background, CursorGlow } from "@/components/layout/Background";
import { NowPlayingBar } from "@/components/layout/NowPlayingBar";
import { NowPlayingSheet } from "@/components/layout/NowPlayingSheet";
import { Sidebar } from "@/components/layout/Sidebar";
import { TabBar } from "@/components/layout/TabBar";
import { ThemeVariant } from "@/components/layout/ThemeVariant";

/** The music-app shell: sidebar, player bar, tab bar, Now Playing sheet. */
export default function MusicLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <ThemeVariant variant="music" />
      <Background />
      <CursorGlow />
      <Sidebar />
      <NowPlayingBar />
      <main id="main" className="min-h-dvh px-4 pb-44 pt-6 sm:px-8 lg:ml-[240px] lg:px-10 lg:pb-16 lg:pt-24">
        <div className="mx-auto max-w-[1200px]">{children}</div>
      </main>
      <TabBar />
      <NowPlayingSheet />
    </>
  );
}
