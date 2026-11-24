"use client";

import { motion } from "framer-motion";
import { cn } from "@/components/ui/Card";
import { FILTERS } from "@/lib/tracks";
import type { Project, TrackFilter } from "@/lib/types";

export function FilterBar({
  active,
  onChange,
  projects,
}: {
  active: TrackFilter;
  onChange: (t: TrackFilter) => void;
  projects: Project[];
}) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
      <div role="tablist" aria-label="Filter projects by discipline" className="inline-flex gap-1 rounded-xl border border-line bg-card p-1">
        {FILTERS.map((f) => {
          const count = f.id === "all" ? projects.length : projects.filter((p) => p.track === f.id).length;
          const selected = active === f.id;
          return (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onChange(f.id)}
              className={cn(
                "relative whitespace-nowrap rounded-lg px-3 py-1.5 text-sm transition focus-visible:outline-2 focus-visible:outline-accent",
                selected ? "text-fg" : "text-muted hover:text-fg",
              )}
            >
              {selected && (
                <motion.span
                  layoutId="archive-filter"
                  className="absolute inset-0 rounded-lg bg-indigo/15 ring-1 ring-indigo/50"
                  transition={{ type: "spring", stiffness: 450, damping: 36 }}
                />
              )}
              <span className="relative">
                {f.label}
                <span className="ml-1.5 font-mono text-[10px] text-dim">{count}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
