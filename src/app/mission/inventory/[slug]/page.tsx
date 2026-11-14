import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, CodeXml, ExternalLink } from "lucide-react";
import { getProject, projects } from "@/data/portfolio";
import { projectCover } from "@/lib/covers";
import { HPlayButton } from "@/components/horror/HPlayButton";
import { ItemViewer } from "@/components/horror/ItemViewer";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/mission/inventory/[slug]">): Promise<Metadata> {
  const p = getProject((await params).slug);
  return p ? { title: p.title, description: p.description } : {};
}

export default function InspectPage({ params }: PageProps<"/mission/inventory/[slug]">) {
  return (
    <Suspense fallback={<div aria-hidden className="h-[60vh] animate-pulse bg-white/5" />}>
      <Inspect params={params} />
    </Suspense>
  );
}

async function Inspect({ params }: { params: PageProps<"/mission/inventory/[slug]">["params"] }) {
  const p = getProject((await params).slug);
  if (!p) notFound();

  return (
    <div>
      <Link href="/mission/inventory" className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] text-h-dim hover:text-h-amber">
        <ArrowLeft size={15} /> Back to case
      </Link>

      <div className="mt-6 grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <ItemViewer cover={projectCover(p)} />

        <div className="h-panel p-5 sm:p-7">
          <p className="h-label">Examine · {p.status === "In progress" ? "Still being built" : (p.year ?? "Field tested")}</p>
          <h1 className="h-title mt-2 text-[clamp(28px,4vw,44px)]">{p.title}</h1>
          <p className="mt-1 text-[14px] text-h-amber">{p.subtitle}</p>
          <p className="mt-4 text-[15px] leading-relaxed text-h-dim">{p.description}</p>

          <p className="h-label mt-6 !text-[10px]">Notes</p>
          <ol className="mt-2 space-y-2">
            {p.features.map((f, i) => (
              <li key={f.title} className="flex gap-3 border-b border-h-line/60 pb-2 last:border-0">
                <span className="text-[13px] text-h-blood">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="block text-[14px] text-h-ink">{f.title}</span>
                  <span className="block text-[13px] text-h-faint">{f.detail}</span>
                </span>
              </li>
            ))}
          </ol>

          {p.credits.length > 0 && (
            <>
              <p className="h-label mt-6 !text-[10px]">Parts</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {p.credits.map((c) => (
                  <span key={c} className="border border-h-line bg-black/40 px-2 py-0.5 text-[12px] text-h-ink">
                    {c}
                  </span>
                ))}
              </div>
            </>
          )}

          <div className="mt-7 flex flex-wrap gap-2">
            {p.trackId && <HPlayButton trackId={p.trackId} label="Use · play track" className="h-btn h-btn-blood" />}
            {p.live && (
              <a href={p.live} target="_blank" rel="noopener noreferrer" className="h-btn">
                <ExternalLink size={15} /> Live demo
              </a>
            )}
            {p.github && (
              <a href={p.github} target="_blank" rel="noopener noreferrer" className="h-btn">
                <CodeXml size={15} /> Source
              </a>
            )}
            <Link href={`/projects/${p.slug}`} className="h-btn">
              Album view
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
