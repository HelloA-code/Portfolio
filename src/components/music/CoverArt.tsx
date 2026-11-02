import Image from "next/image";
import { hashString, paletteFor, rng } from "@/lib/seed";

type Props = {
  seed: string;
  title: string;
  label?: string;
  hue?: number;
  image?: string;
  variant?: "album" | "holo";
  className?: string;
  /** hide the title text (for tiny thumbnails) */
  bare?: boolean;
  priority?: boolean;
};

function wrap(title: string, max: number) {
  const lines: string[] = [];
  for (const word of title.split(" ")) {
    const last = lines[lines.length - 1];
    if (last && (last + " " + word).length <= max) lines[lines.length - 1] = `${last} ${word}`;
    else lines.push(word);
  }
  return lines.slice(0, 3);
}

/** Procedural album cover, stable per seed. Renders on the server; no JS shipped. */
export function CoverArt({ seed, title, label, hue, image, variant = "album", className = "", bare, priority }: Props) {
  const wrapperClass = `cover-fx block aspect-square overflow-hidden rounded-[var(--radius-cover)] bg-black ${className}`;

  if (image) {
    return (
      <span className={wrapperClass}>
        <Image src={image} alt={title} fill sizes="(max-width: 768px) 50vw, 300px" className="object-cover" priority={priority} />
      </span>
    );
  }

  const id = `c${hashString(seed + variant).toString(36)}`;
  const p = paletteFor(seed, hue);
  const r = rng(hashString(seed));
  // the accent blob (index 3) appears once; the hue family dominates
  const blobs = Array.from({ length: 5 }, (_, i) => ({
    cx: 30 + r() * 240,
    cy: 20 + r() * 200,
    rad: 60 + r() * 90,
    fill: p.colors[[0, 1, 2, 3, 0][i]],
  }));
  const holo = variant === "holo";
  const lines = wrap(title, holo ? 10 : 12);
  const fontSize = holo ? 40 : lines.some((l) => l.length > 9) ? 30 : 38;

  return (
    <span className={wrapperClass}>
      <svg viewBox="0 0 300 300" className="h-full w-full" role="img" aria-label={`Cover art for ${title}`}>
        <defs>
          <filter id={`${id}b`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="38" />
          </filter>
          <filter id={`${id}n`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.45 0" />
          </filter>
          <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0.45" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.65" />
          </linearGradient>
          {holo && (
            <>
              <linearGradient id={`${id}h`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#22d3ee" />
                <stop offset="0.35" stopColor="#8b5cf6" />
                <stop offset="0.65" stopColor="#ff2d75" />
                <stop offset="1" stopColor="#22d3ee" />
              </linearGradient>
              <pattern id={`${id}g`} width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M20 0H0V20" fill="none" stroke="#fff" strokeOpacity="0.08" />
              </pattern>
            </>
          )}
        </defs>

        <rect width="300" height="300" fill={`hsl(${p.hue} 55% 9%)`} />
        <g filter={`url(#${id}b)`}>
          {blobs.map((b, i) => (
            <circle key={i} cx={b.cx} cy={b.cy} r={b.rad} fill={b.fill} opacity={0.85} />
          ))}
        </g>
        {holo && (
          <>
            <rect width="300" height="300" fill={`url(#${id}h)`} opacity="0.35" style={{ mixBlendMode: "screen" }} />
            <rect width="300" height="300" fill={`url(#${id}g)`} />
            <circle cx="150" cy="128" r="74" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="1" />
            <circle cx="150" cy="128" r="96" fill="none" stroke="#22d3ee" strokeOpacity="0.4" strokeDasharray="2 6" />
          </>
        )}
        <rect width="300" height="300" filter={`url(#${id}n)`} opacity="0.35" style={{ mixBlendMode: "overlay" }} />
        <rect width="300" height="300" fill={`url(#${id}s)`} />

        {!bare && (
          <>
            <text
              x="18"
              y="30"
              fill="#fff"
              fillOpacity="0.75"
              style={{ font: "500 10px var(--font-jetbrains), monospace", letterSpacing: "0.12em" }}
            >
              {(label ?? "AKS").toUpperCase()}
            </text>
            {holo ? (
              <text
                x="150"
                y="142"
                textAnchor="middle"
                fill="#fff"
                style={{ font: `700 ${fontSize}px var(--font-space), sans-serif`, letterSpacing: "-0.04em" }}
              >
                {title}
              </text>
            ) : (
              lines.map((l, i) => (
                <text
                  key={i}
                  x="18"
                  y={282 - (lines.length - 1 - i) * (fontSize * 0.95)}
                  fill="#fff"
                  style={{ font: `700 ${fontSize}px var(--font-space), sans-serif`, letterSpacing: "-0.04em" }}
                >
                  {l}
                </text>
              ))
            )}
          </>
        )}
      </svg>
    </span>
  );
}
