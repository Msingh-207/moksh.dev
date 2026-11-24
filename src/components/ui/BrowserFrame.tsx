import type { ReactNode } from "react";
import { cn } from "./Card";

/** A dark window chrome used to frame interactive previews. */
export function BrowserFrame({
  title,
  children,
  className,
  right,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  right?: ReactNode;
}) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-line bg-[#0D1020]", className)}>
      <div className="flex items-center gap-2 border-b border-line bg-card px-3 py-2">
        <span className="size-2.5 rounded-full bg-[#334155]" />
        <span className="size-2.5 rounded-full bg-[#334155]" />
        <span className="size-2.5 rounded-full bg-[#334155]" />
        <span className="ml-2 truncate font-mono text-[11px] text-dim">{title}</span>
        <span className="ml-auto">{right}</span>
      </div>
      {children}
    </div>
  );
}
