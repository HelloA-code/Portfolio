import Link from "next/link";
import { pill } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <div className="grid min-h-[60vh] place-items-center text-center">
      <div>
        <p className="mono-label">{"// error 404"}</p>
        <h1 className="page-title mt-2 text-[48px]">Track not found</h1>
        <p className="mt-2 text-muted">This one never made the album.</p>
        <Link href="/" className={`${pill.primary} mt-6`}>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
