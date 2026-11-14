import type { Metadata } from "next";
import { socials } from "@/data/portfolio";
import { HPlayButton } from "@/components/horror/HPlayButton";
import { LetterForm } from "@/components/horror/LetterForm";
import { Typewriter } from "@/components/horror/Typewriter";

export const metadata: Metadata = { title: "Safe Room", description: "Save the resume, send a letter, find the contacts." };

export default function SafeRoomPage() {
  return (
    <>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="h-label">Safe room</p>
          <h1 className="h-title mt-1 text-[clamp(30px,5vw,48px)]">You are safe here</h1>
          <p className="mt-2 max-w-2xl text-[14px] text-h-dim">Catch your breath. Save the resume, leave a letter, or take a contact with you.</p>
        </div>
        <HPlayButton trackId="off-the-clock" label="Calm music" />
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <div className="space-y-6">
          <Typewriter />
          <div className="h-panel p-5">
            <p className="h-label">Contacts</p>
            <ul className="mt-3 divide-y divide-h-line/70">
              {socials.map((s) => (
                <li key={s.label} className="flex items-center justify-between gap-3 py-3">
                  <span className="min-w-0">
                    <span className="block text-[14px] uppercase tracking-[0.14em] text-h-ink">{s.label}</span>
                    <span className="block truncate text-[13px] text-h-faint">{s.href ? s.href.replace(/^(https?:\/\/(www\.)?|mailto:)/, "") : "Not yet recovered"}</span>
                  </span>
                  {s.href ? (
                    <a href={s.href} target={s.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="h-btn !h-9 shrink-0 !px-3 !text-[12px]">
                      Open
                    </a>
                  ) : (
                    <span className="shrink-0 text-[12px] uppercase tracking-[0.14em] text-h-faint">Locked</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <LetterForm />
      </div>
    </>
  );
}
