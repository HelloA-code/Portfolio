"use client";

import { Send } from "lucide-react";
import { profile } from "@/data/portfolio";
import { useContactSubmit } from "@/lib/useContactSubmit";
import { pill } from "@/components/ui/primitives";

/** Music-theme contact form; sending logic lives in useContactSubmit. */
export function ContactForm() {
  const { state, submit } = useContactSubmit();

  const field = "w-full rounded-xl border border-line bg-white/5 px-4 py-3 text-[15px] outline-none transition-colors placeholder:text-faint focus:border-cyan/70 focus:bg-white/10";

  return (
    <form onSubmit={submit} className="glass hud max-w-2xl space-y-4 rounded-[var(--radius-card)] p-5 sm:p-6">
      <p className="mono-label">{"// send a message"}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Name</span>
          <input name="name" required autoComplete="name" className={field} placeholder="Your name" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Email</span>
          <input name="email" type="email" required autoComplete="email" className={field} placeholder="you@example.com" />
        </label>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Message</span>
        <textarea name="message" required rows={5} className={field} placeholder="What are we building?" />
      </label>
      <div className="flex items-center gap-4">
        <button type="submit" disabled={state === "sending"} className={pill.primary}>
          <Send size={16} /> {state === "sending" ? "Sending…" : "Send"}
        </button>
        <p role="status" className="text-sm text-muted">
          {state === "sent" && "Thanks! I'll get back to you soon."}
          {state === "error" && `Couldn't send. Email me at ${profile.email}.`}
        </p>
      </div>
    </form>
  );
}
