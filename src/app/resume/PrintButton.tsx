"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-lg border border-line bg-card px-3 py-1.5 font-mono text-xs text-fg hover:border-line-strong print:hidden"
    >
      <Printer className="size-3.5" /> Print / Save as PDF
    </button>
  );
}
