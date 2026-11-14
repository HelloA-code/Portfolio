import type { Metadata } from "next";
import { profile } from "@/data/portfolio";
import { HPlayButton } from "@/components/horror/HPlayButton";
import { TypedDiary } from "@/components/horror/TypedDiary";

export const metadata: Metadata = { title: "Diary", description: `About ${profile.name}, as a recovered diary.` };

export default function DiaryPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="h-label">Diary</p>
          <h1 className="h-title mt-1 text-[clamp(30px,5vw,48px)]">Recovered pages</h1>
        </div>
        <HPlayButton trackId="boot-sequence" label="Play audio log" />
      </header>

      <article className="h-paper rotate-[-0.6deg] px-6 py-8 sm:px-10 sm:py-10">
        <div className="mb-6 flex items-center justify-between border-b border-dashed border-[#8a7556]/60 pb-3">
          <p className="text-[12px] uppercase tracking-[0.2em] text-[#6b543b]">Entry 01 · {profile.location}</p>
          <span className="h-stamp text-[11px]">Personal</span>
        </div>
        <TypedDiary lines={profile.bio} />
        <p className="mt-8 text-right text-[15px] italic text-[#4a3a2b]">— {profile.shortName}</p>
      </article>
    </div>
  );
}
