"use client";

import { useEffect, useRef } from "react";
import { engine } from "@/lib/audio/engine";
import { usePlayer } from "@/store/player";

/** Glowing circular waveform drawn around the cover. Static glow when paused or reduced motion. */
export function VisualizerRing({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const playing = usePlayer((s) => s.status === "playing");

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const size = canvas.clientWidth;
      if (canvas.width !== size * dpr) {
        canvas.width = size * dpr;
        canvas.height = size * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);
      const c = size / 2;
      const r0 = size * 0.4;
      const levels = playing && !reduce ? engine.levels() : null;

      const grad = ctx.createLinearGradient(0, 0, size, size);
      grad.addColorStop(0, "#22d3ee");
      grad.addColorStop(0.5, "#8b5cf6");
      grad.addColorStop(1, "#ff2d75");
      ctx.strokeStyle = grad;
      ctx.shadowColor = "rgba(139,92,246,0.9)";
      ctx.shadowBlur = 18;

      // FFT spikes
      if (levels) {
        const bins = levels.fft;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.6;
        for (let i = 0; i < bins.length; i++) {
          const v = Math.max(0, (bins[i] + 100) / 100);
          for (const side of [1, -1]) {
            const a = -Math.PI / 2 + side * (i / bins.length) * Math.PI;
            const len = v * size * 0.07;
            ctx.beginPath();
            ctx.moveTo(c + Math.cos(a) * (r0 + 6), c + Math.sin(a) * (r0 + 6));
            ctx.lineTo(c + Math.cos(a) * (r0 + 6 + len), c + Math.sin(a) * (r0 + 6 + len));
            ctx.stroke();
          }
        }
        ctx.globalAlpha = 1;
      }

      // waveform ring
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      const n = 128;
      for (let i = 0; i <= n; i++) {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2;
        const w = levels ? levels.wave[Math.floor((i % n) * (levels.wave.length / n))] : 0;
        const r = r0 + w * size * 0.06;
        const x = c + Math.cos(a) * r;
        const y = c + Math.sin(a) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      if (levels) raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none aspect-square ${className}`} />;
}
