"use client";

import { useState, type FormEvent } from "react";
import { contactForm, profile } from "@/data/portfolio";

export type ContactState = "idle" | "sending" | "sent" | "error";

/** Sends the contact form via Formspree when configured in portfolio.ts, otherwise opens the visitor's mail app. */
export function useContactSubmit() {
  const [state, setState] = useState<ContactState>("idle");

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

  return { state, submit };
}
