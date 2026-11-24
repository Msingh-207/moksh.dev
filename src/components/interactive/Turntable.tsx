"use client";

import { useState } from "react";
import { cn } from "@/components/ui/Card";

/**
 * CSS-3D turntable placeholder for Blender renders.
 * Swap for a real render by setting `video:` in the project's front-matter
 * (e.g. /media/turntable.mp4) — the case-study drawer will show it above.
 */
const FACES = [
  "rotateY(0deg) translateZ(48px)",
  "rotateY(90deg) translateZ(48px)",
  "rotateY(180deg) translateZ(48px)",
  "rotateY(-90deg) translateZ(48px)",
  "rotateX(90deg) translateZ(48px)",
  "rotateX(-90deg) translateZ(48px)",
];

const LIGHTS = [
  { id: "key", label: "Key", color: "#fde68a" },
  { id: "fill", label: "Fill", color: "#93c5fd" },
  { id: "rim", label: "Rim", color: "#f0abfc" },
] as const;

type LightId = (typeof LIGHTS)[number]["id"];

export function Turntable() {
  const [on, setOn] = useState<Record<LightId, boolean>>({ key: true, fill: true, rim: true });
  const brightness = 0.35 + (on.key ? 0.45 : 0) + (on.fill ? 0.2 : 0);

  return (
    <div className="rounded-lg border border-line bg-[#0D1020] p-3">
      <div
        className="relative flex h-52 items-center justify-center overflow-hidden rounded-md"
        style={{
          background: `radial-gradient(ellipse at 50% 85%, #1f1f27 0%, #0D1020 65%)`,
          perspective: "600px",
        }}
      >
        {on.rim && <div className="absolute right-[22%] top-6 size-24 rounded-full bg-fuchsia-400/20 blur-2xl" />}
        {on.key && <div className="absolute left-[18%] top-4 size-28 rounded-full bg-amber-200/15 blur-2xl" />}
        <div className="absolute bottom-9 h-4 w-40 rounded-[50%] bg-black/70 blur-md" />
        <div
          className="relative size-24 animate-[spin3d_9s_linear_infinite]"
          style={{ transformStyle: "preserve-3d" }}
        >
          {FACES.map((t, i) => (
            <div
              key={i}
              className="absolute inset-0 border border-white/10"
              style={{
                transform: t,
                // filter must live on the faces: on the preserve-3d parent it would flatten the cube
                filter: `brightness(${brightness})`,
                background:
                  i % 2
                    ? "linear-gradient(135deg, #7c3aed, #312e81)"
                    : "linear-gradient(135deg, #a78bfa, #4c1d95)",
                boxShadow: on.rim ? "inset 0 0 18px rgba(240,171,252,0.45)" : undefined,
              }}
            />
          ))}
        </div>
        <span className="absolute left-2 top-2 font-mono text-[9.5px] text-dim">Cycles · 128 spp · turntable 360°</span>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {LIGHTS.map((l) => (
          <button
            type="button"
            key={l.id}
            aria-pressed={on[l.id]}
            onClick={() => setOn((s) => ({ ...s, [l.id]: !s[l.id] }))}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-[11px] transition",
              on[l.id] ? "border-line-strong text-fg" : "border-line text-dim",
            )}
          >
            <span className="size-2 rounded-full" style={{ background: on[l.id] ? l.color : "#334155" }} />
            {l.label} light
          </button>
        ))}
        <span className="ml-auto font-mono text-[10px] text-dim">three-point lighting study</span>
      </div>
    </div>
  );
}
