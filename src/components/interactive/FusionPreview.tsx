"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useApp } from "@/components/providers/AppProvider";

/** A stylised DaVinci Fusion page: kinetic-type viewer + node graph. */

const WORDS = ["BUILD.", "MODEL.", "EDIT.", "SHIP."];

const NODES = [
  { id: "MediaIn1", x: 20, y: 30, c: "#94A3B8" },
  { id: "ColorCorr1", x: 130, y: 30, c: "#fbbf24" },
  { id: "Text1", x: 20, y: 100, c: "#22d3ee" },
  { id: "Transform1", x: 130, y: 100, c: "#22d3ee" },
  { id: "Merge1", x: 240, y: 65, c: "#a78bfa" },
  { id: "Glow1", x: 340, y: 65, c: "#fb7185" },
  { id: "MediaOut1", x: 440, y: 65, c: "#34d399" },
] as const;

const EDGES: [string, string][] = [
  ["MediaIn1", "ColorCorr1"],
  ["ColorCorr1", "Merge1"],
  ["Text1", "Transform1"],
  ["Transform1", "Merge1"],
  ["Merge1", "Glow1"],
  ["Glow1", "MediaOut1"],
];

const NW = 84;
const NH = 22;

export function FusionPreview({ compact = false }: { compact?: boolean }) {
  const { motionOn } = useApp();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (!motionOn) return;
    const id = setInterval(() => setI((n) => (n + 1) % WORDS.length), 1800);
    return () => clearInterval(id);
  }, [motionOn]);

  const word = WORDS[i];
  const pos = (id: string) => NODES.find((n) => n.id === id)!;

  return (
    <div className={compact ? "grid h-full grid-rows-[1fr_auto] gap-2 p-3" : "space-y-3 p-4"}>
      {/* Viewer */}
      <div className="relative flex min-h-[120px] items-center justify-center overflow-hidden rounded-lg border border-line bg-[radial-gradient(ellipse_at_center,#161A30,#0A0C16)]">
        <div className="absolute left-2 top-2 font-mono text-[9.5px] text-dim">Viewer1 · MediaOut1</div>
        <div className="absolute right-2 top-2 font-mono text-[9.5px] text-dim">1920×1080 · 24 fps</div>
        <div className="absolute inset-x-6 bottom-6 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
        <AnimatePresence mode="wait">
          <motion.div key={word} className="flex text-4xl font-extrabold tracking-tight text-fg sm:text-5xl" aria-live="off">
            {word.split("").map((ch, k) => (
              <motion.span
                key={k}
                initial={{ y: 40, opacity: 0, rotateX: -80, filter: "blur(6px)" }}
                animate={{ y: 0, opacity: 1, rotateX: 0, filter: "blur(0px)" }}
                exit={{ y: -30, opacity: 0, filter: "blur(4px)" }}
                transition={{ delay: k * 0.045, type: "spring", stiffness: 420, damping: 26 }}
                className={ch === "." ? "text-accent" : undefined}
                style={{ textShadow: "0 0 24px rgba(34,211,238,0.35)" }}
              >
                {ch}
              </motion.span>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Node graph */}
      <div className="overflow-hidden rounded-lg border border-line bg-[#0D1020] bg-grid">
        <svg viewBox="0 0 540 130" className="w-full" role="img" aria-label="Fusion node graph">
          {EDGES.map(([a, b]) => {
            const A = pos(a), B = pos(b);
            const x1 = A.x + NW, y1 = A.y + NH / 2, x2 = B.x, y2 = B.y + NH / 2;
            const mx = (x1 + x2) / 2;
            return (
              <path
                key={a + b}
                d={`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`}
                fill="none"
                stroke="#475569"
                strokeWidth={1.5}
                strokeDasharray="4 4"
              >
                {motionOn && <animate attributeName="stroke-dashoffset" from="16" to="0" dur="0.8s" repeatCount="indefinite" />}
              </path>
            );
          })}
          {NODES.map((n) => (
            <g key={n.id}>
              <rect x={n.x} y={n.y} width={NW} height={NH} rx={5} fill="#151A2E" stroke={n.c} strokeOpacity={0.7} />
              <rect x={n.x} y={n.y} width={4} height={NH} rx={2} fill={n.c} />
              <text x={n.x + 11} y={n.y + 14.5} className="fill-slate-300 font-mono text-[10px]">
                {n.id}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
