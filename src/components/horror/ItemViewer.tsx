"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import type { CoverProps } from "@/lib/covers";
import { CoverArt } from "@/components/music/CoverArt";

/** Item card that tilts with the pointer and slowly turns when idle. */
export function ItemViewer({ cover }: { cover: CoverProps }) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotY = useSpring(useTransform(px, [-0.5, 0.5], [-28, 28]), { stiffness: 160, damping: 18 });
  const rotX = useSpring(useTransform(py, [-0.5, 0.5], [18, -18]), { stiffness: 160, damping: 18 });

  return (
    <div
      className="relative mx-auto grid aspect-square w-full max-w-[420px] place-items-center [perspective:900px]"
      onPointerMove={(e) => {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width - 0.5);
        py.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
    >
      {/* spotlight */}
      <div aria-hidden className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(closest-side, rgba(214,162,74,0.18), transparent 70%)" }} />
      <motion.div
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
        animate={reduce ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="w-[78%]"
      >
        <div className="rounded-md border border-h-amber/40 bg-black p-2 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.95),0_0_40px_rgba(214,162,74,0.12)]">
          <CoverArt {...cover} className="!rounded-sm [filter:saturate(0.7)_contrast(1.1)]" />
        </div>
      </motion.div>
      <p className="h-label absolute bottom-0 !text-[10px]">Move to rotate</p>
    </div>
  );
}
