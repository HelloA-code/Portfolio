"use client";

import { profile } from "@/data/portfolio";
import { useContactSubmit } from "@/lib/useContactSubmit";

/** Contact form written as a letter on aged paper. */
export function LetterForm() {
  const { state, submit } = useContactSubmit();
  const field =
    "w-full border-0 border-b border-dashed border-[#8a7556]/70 bg-transparent px-0 py-2 text-[15px] text-[#2b221a] outline-none placeholder:text-[#8a7556] focus:border-[#8a1d18]";

  return (
    <form onSubmit={submit} className="h-paper rotate-[0.4deg] p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <p className="text-[12px] uppercase tracking-[0.2em] text-[#6b543b]">Letter to {profile.shortName}</p>
        <span className="h-stamp text-[11px]">Urgent</span>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-[11px] uppercase tracking-[0.18em] text-[#6b543b]">From</span>
          <input name="name" required autoComplete="name" placeholder="Your name" className={field} />
        </label>
        <label className="block">
          <span className="text-[11px] uppercase tracking-[0.18em] text-[#6b543b]">Reply to</span>
          <input name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={field} />
        </label>
      </div>
      <label className="mt-4 block">
        <span className="text-[11px] uppercase tracking-[0.18em] text-[#6b543b]">Message</span>
        <textarea name="message" required rows={5} placeholder="What's the mission?" className={`${field} resize-none leading-relaxed`} />
      </label>
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <button type="submit" disabled={state === "sending"} className="h-btn h-btn-blood">
          {state === "sending" ? "Sending…" : "Send letter"}
        </button>
        <p role="status" className="text-[13px] text-[#4a3a2b]">
          {state === "sent" && "Received. A reply is on its way."}
          {state === "error" && `Couldn't send. Write to ${profile.email}.`}
        </p>
      </div>
    </form>
  );
}
