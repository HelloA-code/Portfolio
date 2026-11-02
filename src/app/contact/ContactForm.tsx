"use client";

import { Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { contactForm, profile } from "@/data/portfolio";
import { pill } from "@/components/ui/primitives";

/** Uses Formspree when configured in portfolio.ts, otherwise opens the visitor's mail app. */
export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "");
    const message = String(data.get("message") ?? "");

    if (contactForm.provider === "formspree" && contactForm.formspreeId) {
      setState("sending");
      try {
        const res = await fetch(`https://formspree.io/f/${contactForm.formspreeId}`, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: data,
        });
        setState(res.ok ? "sent" : "error");
        if (res.ok) form.reset();
      } catch {
        setState("error");
      }
      return;
    }
    const subject = encodeURIComponent(`Hello from ${name || "your portfolio"}`);
    const body = encodeURIComponent(message);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  }

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
