"use client";

import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

/**
 * Before/After colour-grade comparison.
 *
 * By default it renders a procedural SVG "frame" twice — once with a flat Log look,
 * once with a final grade — so there are no external assets to break.
 * To use real stills, pass `rawSrc` / `gradedSrc`, e.g.
 *   <ColorGradeSlider rawSrc="/media/grade-raw.jpg" gradedSrc="/media/grade-final.jpg" />
 */

// Deterministic skyline (module-level, so render stays pure).
const BUILDINGS = (() => {
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const out: { x: number; w: number; h: number; lit: { x: number; y: number }[] }[] = [];
  let x = 0;
  while (x < 800) {
    const w = 28 + rnd() * 46;
    const h = 60 + rnd() * 150;
    const lit: { x: number; y: number }[] = [];
    for (let wy = 330 - h + 10; wy < 320; wy += 14)
      for (let wx = x + 6; wx < x + w - 8; wx += 10) if (rnd() > 0.62) lit.push({ x: wx, y: wy });
    out.push({ x, w, h, lit });
    x += w + 2 + rnd() * 6;
  }
  return out;
})();

function Scene({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full" aria-hidden>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e2a5a" />
          <stop offset="45%" stopColor="#8a3f6b" />
          <stop offset="75%" stopColor="#f08a4b" />
          <stop offset="100%" stopColor="#ffd19a" />
        </linearGradient>
        <radialGradient id={`${id}-sun`}>
          <stop offset="0%" stopColor="#fff4d6" />
          <stop offset="60%" stopColor="#ffc56e" />
          <stop offset="100%" stopColor="#ffc56e" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-water`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3d2a4a" />
          <stop offset="100%" stopColor="#0d1424" />
        </linearGradient>
      </defs>
      <rect width="800" height="330" fill={`url(#${id}-sky)`} />
      <circle cx="540" cy="250" r="120" fill={`url(#${id}-sun)`} />
      <circle cx="540" cy="250" r="44" fill="#fff1cf" />
      <path d="M0 270 L120 200 L230 250 L340 180 L470 260 L600 210 L800 270 L800 330 L0 330Z" fill="#5a3460" opacity="0.75" />
      {BUILDINGS.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={330 - b.h} width={b.w} height={b.h} fill="#1a1426" />
          {b.lit.map((l, j) => (
            <rect key={j} x={l.x} y={l.y} width="4" height="6" fill="#ffcf7a" opacity="0.85" />
          ))}
        </g>
      ))}
      <rect y="330" width="800" height="120" fill={`url(#${id}-water)`} />
      <rect x="500" y="335" width="80" height="4" fill="#ffd9a0" opacity="0.6" />
      <rect x="470" y="350" width="140" height="3" fill="#ffd9a0" opacity="0.35" />
      <rect x="515" y="366" width="50" height="3" fill="#ffd9a0" opacity="0.25" />
    </svg>
  );
}

export function ColorGradeSlider({ rawSrc, gradedSrc }: { rawSrc?: string; gradedSrc?: string }) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const update = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  }, []);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    update(e.clientX);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) update(e.clientX);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - step));
    else if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + step));
    else if (e.key === "Home") setPos(0);
    else if (e.key === "End") setPos(100);
    else return;
    e.preventDefault();
  };

  const useImages = rawSrc && gradedSrc;

  return (
    <div className="p-4">
      <div
        ref={ref}
        className="relative aspect-video cursor-ew-resize touch-none select-none overflow-hidden rounded-lg border border-line"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* Final grade (bottom layer) */}
        <div className="absolute inset-0" style={useImages ? undefined : { filter: "saturate(1.25) contrast(1.15) brightness(0.98)" }}>
          {useImages ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={gradedSrc} alt="Final grade" className="absolute inset-0 size-full object-cover" draggable={false} />
          ) : (
            <>
              <Scene id="graded" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0e7490]/25 via-transparent to-[#0e7490]/30 mix-blend-color" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.55))]" />
            </>
          )}
        </div>

        {/* Raw log (top layer, clipped) */}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <div className="absolute inset-0" style={useImages ? undefined : { filter: "saturate(0.32) contrast(0.58) brightness(1.22)" }}>
            {useImages ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={rawSrc} alt="Raw log footage" className="absolute inset-0 size-full object-cover" draggable={false} />
            ) : (
              <>
                <Scene id="raw" />
                <div className="absolute inset-0 bg-[#7d8a86]/25" />
              </>
            )}
          </div>
        </div>

        <span className="pointer-events-none absolute left-3 top-3 rounded bg-black/60 px-2 py-0.5 font-mono text-[10px] text-slate-300">
          RAW · LOG
        </span>
        <span className="pointer-events-none absolute right-3 top-3 rounded bg-black/60 px-2 py-0.5 font-mono text-[10px] text-amber">
          FINAL · REC.709
        </span>

        {/* Handle */}
        <div className="pointer-events-none absolute inset-y-0 w-px bg-white/80" style={{ left: `${pos}%` }}>
          <div
            role="slider"
            tabIndex={0}
            aria-label="Before/after comparison"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pos)}
            onKeyDown={onKey}
            className="pointer-events-auto absolute top-1/2 left-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-black/60 font-mono text-[11px] text-white backdrop-blur focus-visible:outline-2 focus-visible:outline-accent"
          >
            ⇆
          </div>
        </div>
      </div>
      <div className="mt-2 flex justify-between font-mono text-[10px] text-dim">
        <span>CST: S-Log3 → Rec.709 · primaries · teal/orange split</span>
        <span>{Math.round(pos)}%</span>
      </div>
    </div>
  );
}
