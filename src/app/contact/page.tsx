import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { socials } from "@/data/portfolio";
import { PageHeader } from "@/components/ui/primitives";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = { title: "Contact", description: "Follow along or get in touch." };

export default function ContactPage() {
  return (
    <>
      <PageHeader kicker="follow" title="Contact">
        Open to internships, collaborations and good conversations.
      </PageHeader>
      <ul className="mb-10 grid gap-3 sm:grid-cols-2">
        {socials.map((s) => (
          <li key={s.label} className="glass glow-border flex items-center gap-4 rounded-[var(--radius-card)] p-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-cyan via-violet to-pink font-display font-bold">{s.label[0]}</span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold">{s.label}</span>
              <span className="block truncate text-sm text-muted">{s.href ? s.handle : "Link coming soon"}</span>
            </span>
            {s.href ? (
              <a
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="inline-flex h-8 items-center gap-1 rounded-full bg-pink px-3.5 text-[13px] font-semibold text-white hover:shadow-[0_0_16px_rgba(255,45,117,0.6)]"
              >
                <Plus size={14} /> Follow
              </a>
            ) : (
              <span className="inline-flex h-8 items-center rounded-full border border-line px-3.5 text-[13px] text-faint">Soon</span>
            )}
          </li>
        ))}
      </ul>
      <ContactForm />
    </>
  );
}
