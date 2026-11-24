"use client";

import { useEffect, useRef } from "react";
import { useApp } from "@/components/providers/AppProvider";

/** An NLE-style edit timeline with a live playhead and timecode. */

const DURATION = 16; // seconds of "programme" shown
const FPS = 24;

const TRACKS = [
  { id: "V2", clips: [{ s: 2.5, e: 4.5, n: "TITLE_01", c: "#a78bfa" }, { s: 11, e: 13.5, n: "LOWER_3RD", c: "#a78bfa" }] },
  {
    id: "V1",
    clips: [
      { s: 0, e: 3.2, n: "SC01_WIDE_T2", c: "#22d3ee" },
      { s: 3.2, e: 5.1, n: "SC01_CU_T4", c: "#22d3ee" },
      { s: 5.1, e: 8.8, n: "SC02_OTS_T1", c: "#22d3ee" },
      { s: 8.8, e: 10.2, n: "INSERT_HANDS", c: "#22d3ee" },
      { s: 10.2, e: 16, n: "SC03_WIDE_T3", c: "#22d3ee" },
    ],
  },
  { id: "A1", clips: [{ s: 0, e: 8.8, n: "DIALOGUE_SC01-02", c: "#34d399" }, { s: 9.4, e: 16, n: "DIALOGUE_SC03", c: "#34d399" }] },
  { id: "A2", clips: [{ s: 0, e: 16, n: "SCORE_v3 · ROOMTONE", c: "#fbbf24" }] },
];

const tc = (t: number) => {
  const s = Math.floor(t);
  const f = Math.floor((t - s) * FPS);
  return `01:00:${String(s).padStart(2, "0")}:${String(f).padStart(2, "0")}`;
};

export function NleTimeline() {
  const { motionOn } = useApp();
  const headRef = useRef<HTMLDivElement>(null);
  const tcRef = useRef<HTMLSpanElement>(null);
  const clipRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!motionOn) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = (((now - t0) / 1000) * 1) % DURATION;
      if (headRef.current) headRef.current.style.left = `${(t / DURATION) * 100}%`;
      if (tcRef.current) tcRef.current.textContent = tc(t);
      if (clipRef.current) {
        const clip = TRACKS[1].clips.find((c) => t >= c.s && t < c.e);
        clipRef.current.textContent = clip?.n ?? "";
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [motionOn]);

  return (
    <div className="space-y-2 p-4">
      <div className="flex items-center justify-between rounded-md border border-line bg-card-2 px-3 py-1.5 font-mono text-[11px]">
        <span className="text-dim">
          Timeline · <span className="text-muted">NAQSH_Short_v07</span>
        </span>
        <span>
          <span ref={clipRef} className="mr-3 text-accent">SC01_WIDE_T2</span>
          <span ref={tcRef} className="text-fg">
            01:00:00:00
          </span>
        </span>
      </div>
      <div className="relative overflow-hidden rounded-lg border border-line bg-[#0D1020]">
        <div className="ml-9 flex h-5 border-b border-line">
          {Array.from({ length: DURATION }, (_, i) => (
            <div key={i} className="flex-1 border-l border-line/60 pl-0.5 font-mono text-[8.5px] text-dim">
              {i % 4 === 0 ? `${i}s` : ""}
            </div>
          ))}
        </div>
        {TRACKS.map((t) => (
          <div key={t.id} className="flex h-8 border-b border-line/50 last:border-0">
            <div className="flex w-9 shrink-0 items-center justify-center border-r border-line font-mono text-[10px] text-dim">{t.id}</div>
            <div className="relative flex-1">
              {t.clips.map((c) => (
                <div
                  key={c.n}
                  className="absolute inset-y-1 overflow-hidden rounded-[4px] border px-1.5 font-mono text-[9px] leading-[22px]"
                  style={{
                    left: `${(c.s / DURATION) * 100}%`,
                    width: `calc(${((c.e - c.s) / DURATION) * 100}% - 2px)`,
                    background: `${c.c}22`,
                    borderColor: `${c.c}66`,
                    color: c.c,
                  }}
                >
                  <span className="truncate">{c.n}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="pointer-events-none absolute inset-y-0 left-9 right-0">
          <div ref={headRef} className="absolute inset-y-0 w-px bg-rose" style={{ left: "0%" }}>
            <div className="absolute -left-[5px] -top-px h-2.5 w-[11px] rounded-b-sm bg-rose" />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 font-mono text-[10px] text-dim">
        <span>J/L-cuts on A1</span>
        <span>· proxy → original relink</span>
        <span>· shot-matched before grade</span>
      </div>
    </div>
  );
}
