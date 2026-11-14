import type { Metadata } from "next";
import { InventoryCase } from "@/components/horror/InventoryCase";

export const metadata: Metadata = { title: "Inventory", description: "Projects, packed into the case." };

export default function InventoryPage() {
  return (
    <>
      <header className="mb-6">
        <p className="h-label">Inventory</p>
        <h1 className="h-title mt-1 text-[clamp(30px,5vw,48px)]">The case</h1>
        <p className="mt-2 max-w-2xl text-[14px] text-h-dim">Every project is an item. Hover to examine, select to inspect, or use it to play its track.</p>
      </header>
      <InventoryCase />
    </>
  );
}
