import Image from "next/image";
import { profile } from "@/data/portfolio";

/** Artist-style round photo; falls back to a gradient monogram until profile.photo is set. */
export function Avatar({ size }: { size: number }) {
  const style = { width: size, height: size };
  if (profile.photo) {
    return <Image src={profile.photo} alt={profile.name} width={size} height={size} className="rounded-full object-cover ring-1 ring-white/20" style={style} />;
  }
  const initials = profile.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  return (
    <span
      role="img"
      aria-label={`${profile.name} (photo placeholder)`}
      className="grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-cyan via-violet to-pink font-display font-bold ring-1 ring-white/20"
      style={{ ...style, fontSize: size * 0.38 }}
    >
      {initials}
    </span>
  );
}
