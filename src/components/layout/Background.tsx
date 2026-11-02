"use client";

import { useEffect, useRef } from "react";
import { engine } from "@/lib/audio/engine";
import { usePlayer } from "@/store/player";
import { useUi } from "@/store/ui";

/** Aurora + star field + grain. The aurora pulses with the bass while music plays. */
export function Background() {
  const aurora = useRef<HTMLDivElement>(null);
  const stars = useRef<HTMLCanvasElement>(null);
  const playing = usePlayer((s) => s.status === "playing");
  const synthwave = useUi((s) => s.synthwave);

  // star field: drawn once, gently twinkles unless reduced motion
  useEffect(() => {
    const canvas = stars.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let pts: { x: number; y: number; r: number; p: number }[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((window.innerWidth * window.innerHeight) / 9000);
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.1 + 0.2,
        p: Math.random() * Math.PI * 2,
      }));
    };
    const draw = (t: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of pts) {
        const a = 0.25 + 0.35 * (reduce ? 0.5 : (Math.sin(t / 1400 + s.p) + 1) / 2);
        ctx.fillStyle = `rgba(220,230,255,${a})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // bass pulse
  useEffect(() => {
    const el = aurora.current;
    if (!el) return;
    if (!playing || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.opacity = "";
      el.style.scale = "";
      return;
    }
    let raf = 0;
    let smooth = 0;
    const loop = () => {
      smooth += (engine.bass() - smooth) * 0.2;
      el.style.opacity = String(0.55 + smooth * 0.45);
      el.style.scale = String(1 + smooth * 0.06);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div ref={aurora} className="absolute inset-0 opacity-55 transition-opacity duration-700">
        <div
          className="absolute -left-[20%] -top-[30%] h-[80vh] w-[80vw] rounded-full blur-[110px]"
          style={{ background: "radial-gradient(closest-side, rgba(139,92,246,0.55), transparent)", animation: "aurora 30s ease-in-out infinite alternate" }}
        />
        <div
          className="absolute -right-[15%] top-[10%] h-[70vh] w-[60vw] rounded-full blur-[120px]"
          style={{ background: "radial-gradient(closest-side, rgba(34,211,238,0.35), transparent)", animation: "aurora 38s ease-in-out -8s infinite alternate-reverse" }}
        />
        <div
          className="absolute -bottom-[30%] left-[20%] h-[70vh] w-[70vw] rounded-full blur-[130px]"
          style={{ background: "radial-gradient(closest-side, rgba(255,45,117,0.35), transparent)", animation: "aurora 44s ease-in-out -16s infinite alternate" }}
        />
      </div>
      <canvas ref={stars} className="absolute inset-0 h-full w-full" />
      {synthwave && (
        <div className="absolute inset-x-0 bottom-0 h-[45vh] [perspective:400px]">
          <div className="synth-grid absolute inset-x-[-50%] bottom-0 h-full origin-bottom [transform:rotateX(60deg)] [mask-image:linear-gradient(to_top,black,transparent)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-pink shadow-[0_0_30px_8px_rgba(255,45,117,0.6)]" />
        </div>
      )}
      <div className="grain absolute inset-0 opacity-[0.07] mix-blend-overlay" />
    </div>
  );
}

/** Soft light that follows the pointer (fine pointers only) */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${e.clientX - 300}px, ${e.clientY - 300}px, 0)`;
        el.style.opacity = "1";
      });
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 -z-[5] size-[600px] rounded-full opacity-0 transition-opacity duration-500"
      style={{ background: "radial-gradient(closest-side, rgba(139,92,246,0.13), rgba(34,211,238,0.05) 50%, transparent)" }}
    />
  );
}
