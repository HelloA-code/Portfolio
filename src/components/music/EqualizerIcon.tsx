/** Four bouncing bars. Static when `playing` is false or motion is reduced. */
export function EqualizerIcon({ playing, className = "" }: { playing: boolean; className?: string }) {
  return (
    <span aria-hidden className={`inline-flex h-3.5 items-end gap-[2px] ${className}`}>
      {[0, 0.25, 0.1, 0.4].map((delay, i) => (
        <span
          key={i}
          className="w-[3px] origin-bottom rounded-full bg-pink"
          style={{
            height: "100%",
            transform: playing ? undefined : "scaleY(0.35)",
            animation: playing ? `eq 0.9s ease-in-out ${delay}s infinite` : undefined,
          }}
        />
      ))}
    </span>
  );
}
