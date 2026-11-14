"use client";

import { Keyboard } from "lucide-react";
import { useRef, useState } from "react";
import { profile } from "@/data/portfolio";

const STEPS = ["Feeding paper…", "Typing record…", "Record saved."];

/** "Save your progress": a short typewriter sequence, then the resume PDF downloads. */
export function Typewriter() {
  const [step, setStep] = useState(-1);
  const link = useRef<HTMLAnchorElement>(null);

  const save = () => {
    if (step >= 0 && step < STEPS.length - 1) return;
    setStep(0);
    STEPS.forEach((_, i) => {
      setTimeout(() => {
        setStep(i);
        if (i === STEPS.length - 1) link.current?.click();
      }, i * 700);
    });
  };

  return (
    <div className="h-panel flex flex-col items-center p-6 text-center sm:p-8">
      <div className="grid size-20 place-items-center rounded-full border border-h-amber/40 bg-black/50 shadow-[0_0_40px_rgba(214,162,74,0.15)]">
        <Keyboard size={34} className="text-h-amber" />
      </div>
      <h2 className="h-title mt-5 text-[24px]">Typewriter</h2>
      <p className="mt-2 max-w-sm text-[14px] text-h-dim">Save your progress: take a copy of the resume with you.</p>
      <p role="status" className="mt-4 h-6 text-[14px] text-h-amber">
        {step >= 0 ? STEPS[step] : ""}
      </p>
      <button type="button" onClick={save} className="h-btn h-btn-blood mt-3">
        Save resume (PDF)
      </button>
      <a ref={link} href={profile.resume} download className="hidden" tabIndex={-1} aria-hidden>
        resume
      </a>
    </div>
  );
}
