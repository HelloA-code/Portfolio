import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export const pill = {
  primary: "pill-primary inline-flex items-center justify-center gap-2 rounded-full px-5 h-11 text-[15px] font-semibold",
  secondary:
    "glass glow-border inline-flex items-center justify-center gap-2 rounded-full px-5 h-11 text-[15px] font-semibold text-fg hover:bg-white/10 transition-colors",
  ghost: "inline-flex items-center gap-1.5 rounded-full px-3 h-9 text-sm font-medium text-muted hover:text-fg hover:bg-white/5 transition-colors",
};

export function IconButton({
  label,
  active,
  className = "",
  children,
  ...rest
}: ComponentProps<"button"> & { label: string; active?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      className={`inline-flex size-9 items-center justify-center rounded-full transition-colors hover:bg-white/10 disabled:opacity-40 ${
        active ? "text-pink drop-shadow-[0_0_6px_rgba(255,45,117,0.7)]" : "text-fg/80 hover:text-fg"
      } ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function PageHeader({ kicker, title, children }: { kicker: string; title: string; children?: ReactNode }) {
  return (
    <header className="mb-8">
      <p className="mono-label mb-2">{`// ${kicker}`}</p>
      <h1 className="page-title text-[34px] sm:text-[40px]">{title}</h1>
      {children && <div className="mt-3 max-w-2xl text-muted">{children}</div>}
    </header>
  );
}

export function GlassCard({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`glass glow-border hud rounded-[var(--radius-card)] p-5 ${className}`}>{children}</div>;
}

export function Chip({ children, active, href }: { children: ReactNode; active?: boolean; href?: string }) {
  const cls = `inline-flex h-8 items-center rounded-full border px-3.5 text-[13px] font-medium transition-colors ${
    active ? "border-transparent bg-fg text-bg" : "border-line bg-white/5 text-fg/85 hover:bg-white/10"
  }`;
  return href ? (
    <Link href={href} className={cls}>
      {children}
    </Link>
  ) : (
    <span className={cls}>{children}</span>
  );
}

export function SectionTitle({ title, href, kicker }: { title: string; href?: string; kicker?: string }) {
  return (
    <div className="mb-3 flex items-end justify-between gap-4">
      <div>
        {kicker && <p className="mono-label mb-1">{kicker}</p>}
        <h2 className="text-[22px] font-bold tracking-tight">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="text-sm font-medium text-pink hover:underline">
          See All
        </Link>
      )}
    </div>
  );
}
