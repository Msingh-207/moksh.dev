"use client";

import { AlertTriangle } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/components/ui/Card";

/**
 * A miniature, interactive mock of the AUDash week view.
 * Toggle electives to see clash detection in action.
 */

type Day = 0 | 1 | 2 | 3 | 4;
interface Slot {
  day: Day;
  start: number; // hours, e.g. 9.5 = 09:30
  end: number;
}
interface Course {
  code: string;
  name: string;
  room: string;
  color: string;
  elective?: boolean;
  slots: Slot[];
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const START = 9;
const END = 17;

const COURSES: Course[] = [
  { code: "ECO-201", name: "Intermediate Macroeconomics", room: "KG-204", color: "#22D3EE", slots: [{ day: 0, start: 9, end: 10.5 }, { day: 2, start: 9, end: 10.5 }] },
  { code: "ECO-203", name: "Intermediate Microeconomics", room: "KG-110", color: "#34D399", slots: [{ day: 1, start: 11, end: 12.5 }, { day: 3, start: 11, end: 12.5 }] },
  { code: "ECO-205", name: "Statistics for Economics", room: "LT-02", color: "#A78BFA", slots: [{ day: 0, start: 11, end: 12.5 }, { day: 4, start: 10, end: 11.5 }] },
  { code: "ECO-221", name: "Mathematical Methods", room: "KG-301", color: "#FBBF24", slots: [{ day: 1, start: 14, end: 15.5 }, { day: 3, start: 9.5, end: 11 }] },
  { code: "MAT-211", name: "Numerical Analysis", room: "LAB-1", color: "#FB7185", elective: true, slots: [{ day: 2, start: 14, end: 15.5 }, { day: 4, start: 14, end: 15.5 }] },
  { code: "ECO-231", name: "Development Economics", room: "KG-105", color: "#60A5FA", elective: true, slots: [{ day: 2, start: 15, end: 16.5 }] },
];

const fmt = (h: number) => `${String(Math.floor(h)).padStart(2, "0")}:${h % 1 ? "30" : "00"}`;

export function AudashPreview({ compact = false }: { compact?: boolean }) {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({ "MAT-211": true, "ECO-231": false });
  const [hover, setHover] = useState<string | null>(null);

  const active = useMemo(() => COURSES.filter((c) => !c.elective || enabled[c.code]), [enabled]);

  const clashes = useMemo(() => {
    const set = new Set<string>();
    const all = active.flatMap((c) => c.slots.map((s) => ({ c, s })));
    for (let i = 0; i < all.length; i++)
      for (let j = i + 1; j < all.length; j++) {
        const a = all[i], b = all[j];
        if (a.s.day === b.s.day && a.s.start < b.s.end && b.s.start < a.s.end) {
          set.add(a.c.code);
          set.add(b.c.code);
        }
      }
    return set;
  }, [active]);

  const hours = Array.from({ length: END - START + 1 }, (_, i) => START + i);
  const hovered = COURSES.find((c) => c.code === hover);

  return (
    <div className="flex h-full flex-col gap-3 p-3 text-[11px]">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-dim">electives:</span>
        {COURSES.filter((c) => c.elective).map((c) => (
          <button
            key={c.code}
            type="button"
            onClick={() => setEnabled((e) => ({ ...e, [c.code]: !e[c.code] }))}
            aria-pressed={!!enabled[c.code]}
            className={cn(
              "rounded-md border px-2 py-0.5 font-mono transition",
              enabled[c.code] ? "border-line-strong bg-card-2 text-fg" : "border-line text-dim hover:text-muted",
            )}
          >
            {enabled[c.code] ? "✓ " : "+ "}
            {c.code}
          </button>
        ))}
        <span
          className={cn(
            "ml-auto inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono",
            clashes.size ? "bg-rose/10 text-rose" : "bg-emerald/10 text-emerald",
          )}
        >
          {clashes.size ? <AlertTriangle className="size-3" aria-hidden /> : "●"}
          {clashes.size ? `clash detected` : "no clashes"}
        </span>
      </div>

      <div className={cn("relative grid flex-1 grid-cols-[34px_repeat(5,1fr)] grid-rows-[auto_1fr] gap-x-1", compact ? "min-h-[170px]" : "min-h-[300px]")}>
        <div />
        {DAYS.map((d) => (
          <div key={d} className="pb-1 text-center font-mono text-dim">
            {d}
          </div>
        ))}
        <div className="relative col-start-1 row-start-2">
          {hours.map((h, i) => (
            <div
              key={h}
              className="absolute right-1 -translate-y-1/2 font-mono text-[9px] text-dim"
              style={{ top: `${(i / (END - START)) * 100}%` }}
            >
              {compact && i % 2 ? "" : fmt(h)}
            </div>
          ))}
        </div>
        {DAYS.map((_, di) => (
          <div key={di} className="relative row-start-2 rounded-md border border-line/70 bg-[#0D1020]" style={{ gridColumnStart: di + 2 }}>
            {hours.slice(1, -1).map((h, i) => (
              <div key={h} className="absolute inset-x-0 border-t border-dashed border-line/50" style={{ top: `${((i + 1) / (END - START)) * 100}%` }} />
            ))}
            {active.flatMap((c) =>
              c.slots
                .filter((s) => s.day === di)
                .map((s, k) => (
                  <button
                    type="button"
                    key={c.code + k}
                    onMouseEnter={() => setHover(c.code)}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover(c.code)}
                    onBlur={() => setHover(null)}
                    className={cn(
                      "absolute inset-x-0.5 overflow-hidden rounded-[5px] border px-1 py-0.5 text-left leading-tight transition",
                      clashes.has(c.code) && "ring-1 ring-rose",
                    )}
                    style={{
                      top: `${((s.start - START) / (END - START)) * 100}%`,
                      height: `${((s.end - s.start) / (END - START)) * 100}%`,
                      background: `${c.color}1f`,
                      borderColor: `${c.color}66`,
                      color: c.color,
                      opacity: hover && hover !== c.code ? 0.45 : 1,
                    }}
                  >
                    <span className="block truncate font-mono text-[9.5px] font-semibold">{c.code}</span>
                    {!compact && <span className="block truncate text-[9.5px] text-muted">{c.room}</span>}
                  </button>
                )),
            )}
          </div>
        ))}
      </div>

      <div className="h-4 truncate font-mono text-[10.5px] text-muted">
        {hovered ? (
          <>
            <span style={{ color: hovered.color }}>{hovered.code}</span> · {hovered.name} · {hovered.room}
          </>
        ) : (
          <span className="text-dim">hover a block for details · toggle electives to test clash detection</span>
        )}
      </div>
    </div>
  );
}
