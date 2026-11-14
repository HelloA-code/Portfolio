"use client";

import { useEffect, useRef } from "react";

/** Lantern light, drifting fog, floating dust, grain and a heavy vignette. */
export function HorrorBackground() {
  const dust = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = dust.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let motes: { x: number; y: number; r: number; vx: number; vy: number; a: number }[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((window.innerWidth * window.innerHeight) / 22000);
      motes = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.4 + 0.3,
        vx: (Math.random() - 0.5) * 0.12,
        vy: -Math.random() * 0.18 - 0.03,
        a: Math.random() * 0.5 + 0.15,
      }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const m of motes) {
        if (!reduce) {
          m.x += m.vx;
          m.y += m.vy;
          if (m.y < -5) m.y = window.innerHeight + 5;
          if (m.x < -5) m.x = window.innerWidth + 5;
          if (m.x > window.innerWidth + 5) m.x = -5;
        }
        ctx.fillStyle = `rgba(230, 200, 150, ${m.a})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-h-bg">
      {/* lantern */}
      <div
        className="h-flicker absolute left-1/2 top-[-20vh] h-[80vh] w-[110vw] -translate-x-1/2 rounded-full blur-[60px]"
        style={{ background: "radial-gradient(closest-side, rgba(214,150,70,0.20), rgba(150,60,30,0.07) 60%, transparent)" }}
      />
      <div
        className="absolute -bottom-[25vh] -left-[10vw] h-[60vh] w-[60vw] rounded-full blur-[90px]"
        style={{ background: "radial-gradient(closest-side, rgba(110,20,18,0.28), transparent)" }}
      />
      {/* fog */}
      <div
        className="absolute inset-x-[-20%] bottom-0 h-[45vh] opacity-60"
        style={{ background: "radial-gradient(60% 60% at 50% 100%, rgba(170,160,145,0.16), transparent 70%)", animation: "fog-drift 40s ease-in-out infinite alternate" }}
      />
      <div
        className="absolute inset-x-[-20%] bottom-[10vh] h-[35vh] opacity-40"
        style={{ background: "radial-gradient(50% 50% at 40% 80%, rgba(150,140,130,0.14), transparent 70%)", animation: "fog-drift 55s ease-in-out -20s infinite alternate-reverse" }}
      />
      <canvas ref={dust} className="absolute inset-0 h-full w-full" />
      <div className="grain absolute inset-0 opacity-[0.12] mix-blend-overlay" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.85) 100%)" }} />
    </div>
  );
}
