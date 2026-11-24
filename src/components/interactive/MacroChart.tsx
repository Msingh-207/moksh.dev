"use client";

import { useMemo, useRef, useState } from "react";
import { cn } from "@/components/ui/Card";

/**
 * Lightweight SVG line chart for the FREDash case study.
 * Values are an illustrative annual sample (approximate) — the full app pulls live FRED series.
 */

const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

const INDICATORS = {
  cpi: {
    label: "CPI inflation",
    unit: "% y/y",
    data: {
      USA: [0.1, 1.3, 2.1, 2.4, 1.8, 1.2, 4.7, 8.0, 4.1, 2.9],
      IND: [4.9, 4.9, 3.3, 3.9, 3.7, 6.6, 5.1, 6.7, 5.4, 4.9],
      GBR: [0.0, 0.7, 2.7, 2.5, 1.8, 0.9, 2.6, 9.1, 7.3, 2.5],
      JPN: [0.8, -0.1, 0.5, 1.0, 0.5, 0.0, -0.2, 2.5, 3.3, 2.7],
    },
  },
  gdp: {
    label: "Real GDP growth",
    unit: "% y/y",
    data: {
      USA: [2.9, 1.8, 2.5, 3.0, 2.5, -2.2, 6.1, 2.5, 2.9, 2.8],
      IND: [8.0, 8.3, 6.8, 6.5, 3.9, -5.8, 9.7, 7.0, 8.2, 6.5],
      GBR: [2.2, 1.9, 2.7, 1.4, 1.6, -10.3, 8.6, 4.8, 0.3, 1.1],
      JPN: [1.6, 0.8, 1.7, 0.6, -0.4, -4.1, 2.6, 1.0, 1.7, 0.1],
    },
  },
  unrate: {
    label: "Unemployment rate",
    unit: "%",
    data: {
      USA: [5.3, 4.9, 4.4, 3.9, 3.7, 8.1, 5.4, 3.6, 3.6, 4.0],
      IND: [5.4, 5.4, 5.4, 5.3, 5.3, 8.0, 6.0, 4.8, 4.2, 4.2],
      GBR: [5.4, 4.9, 4.4, 4.1, 3.8, 4.6, 4.5, 3.7, 4.0, 4.3],
      JPN: [3.4, 3.1, 2.8, 2.4, 2.4, 2.8, 2.8, 2.6, 2.6, 2.5],
    },
  },
} as const;

type IndicatorId = keyof typeof INDICATORS;
type Country = keyof (typeof INDICATORS)["cpi"]["data"];

const COUNTRIES: { id: Country; name: string; color: string }[] = [
  { id: "IND", name: "India", color: "#34D399" },
  { id: "USA", name: "United States", color: "#22D3EE" },
  { id: "GBR", name: "United Kingdom", color: "#A78BFA" },
  { id: "JPN", name: "Japan", color: "#FBBF24" },
];

const W = 640;
const H = 300;
const PAD = { l: 40, r: 16, t: 16, b: 28 };

export function MacroChart() {
  const [indicator, setIndicator] = useState<IndicatorId>("cpi");
  const [visible, setVisible] = useState<Record<Country, boolean>>({ IND: true, USA: true, GBR: true, JPN: false });
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const ind = INDICATORS[indicator];
  const shown = COUNTRIES.filter((c) => visible[c.id]);

  const { yMin, yMax, ticks } = useMemo(() => {
    const vals = (shown.length ? shown : COUNTRIES).flatMap((c) => [...ind.data[c.id]]);
    const lo = Math.floor(Math.min(0, ...vals) / 2) * 2;
    const hi = Math.ceil(Math.max(...vals) / 2) * 2;
    const step = hi - lo > 12 ? 4 : 2;
    const t: number[] = [];
    for (let v = lo; v <= hi; v += step) t.push(v);
    return { yMin: lo, yMax: hi, ticks: t };
  }, [ind, shown]);

  const x = (i: number) => PAD.l + (i / (YEARS.length - 1)) * (W - PAD.l - PAD.r);
  const y = (v: number) => PAD.t + (1 - (v - yMin) / (yMax - yMin || 1)) * (H - PAD.t - PAD.b);

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const i = Math.round(((px - PAD.l) / (W - PAD.l - PAD.r)) * (YEARS.length - 1));
    setHoverIdx(Math.max(0, Math.min(YEARS.length - 1, i)));
  };

  return (
    <div className="space-y-3 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-lg border border-line bg-card-2 p-0.5" role="tablist" aria-label="Indicator">
          {(Object.keys(INDICATORS) as IndicatorId[]).map((id) => (
            <button
              type="button"
              role="tab"
              aria-selected={indicator === id}
              key={id}
              onClick={() => setIndicator(id)}
              className={cn(
                "rounded-md px-2.5 py-1 font-mono text-[11px] transition",
                indicator === id ? "bg-[#1E2440] text-fg" : "text-dim hover:text-muted",
              )}
            >
              {INDICATORS[id].label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {COUNTRIES.map((c) => (
            <button
              type="button"
              key={c.id}
              aria-pressed={visible[c.id]}
              onClick={() => setVisible((v) => ({ ...v, [c.id]: !v[c.id] }))}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-[11px] transition",
                visible[c.id] ? "border-line-strong text-fg" : "border-line text-dim line-through",
              )}
            >
              <span className="size-2 rounded-full" style={{ background: c.color }} />
              {c.id}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full touch-none select-none"
          onPointerMove={onMove}
          onPointerLeave={() => setHoverIdx(null)}
          role="img"
          aria-label={`${ind.label} by country, ${YEARS[0]}–${YEARS[YEARS.length - 1]}`}
        >
          {ticks.map((t) => (
            <g key={t}>
              <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} stroke={t === 0 ? "#334155" : "#1E293B"} strokeDasharray={t === 0 ? undefined : "3 4"} />
              <text x={PAD.l - 8} y={y(t) + 3.5} textAnchor="end" className="fill-dim font-mono text-[10px]">
                {t}
              </text>
            </g>
          ))}
          {YEARS.map((yr, i) => (
            <text key={yr} x={x(i)} y={H - 8} textAnchor="middle" className="fill-dim font-mono text-[10px]">
              {i % 2 === 0 || i === YEARS.length - 1 ? `’${String(yr).slice(2)}` : ""}
            </text>
          ))}
          {/* COVID shading */}
          <rect x={x(5) - 12} y={PAD.t} width={24} height={H - PAD.t - PAD.b} fill="#fb7185" opacity={0.06} />
          {shown.map((c) => {
            const d = ind.data[c.id].map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
            return (
              <g key={c.id}>
                <path d={d} fill="none" stroke={c.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
                {hoverIdx !== null && <circle cx={x(hoverIdx)} cy={y(ind.data[c.id][hoverIdx])} r={4} fill="#09090b" stroke={c.color} strokeWidth={2} />}
              </g>
            );
          })}
          {hoverIdx !== null && <line x1={x(hoverIdx)} x2={x(hoverIdx)} y1={PAD.t} y2={H - PAD.b} stroke="#475569" strokeDasharray="2 3" />}
        </svg>

        {hoverIdx !== null && shown.length > 0 && (
          <div
            className="pointer-events-none absolute top-2 rounded-lg border border-line bg-card/95 px-3 py-2 font-mono text-[11px] shadow-xl backdrop-blur"
            style={hoverIdx > YEARS.length / 2 ? { left: 48 } : { right: 20 }}
          >
            <div className="mb-1 text-fg">{YEARS[hoverIdx]}</div>
            {shown.map((c) => (
              <div key={c.id} className="flex items-center gap-2 text-muted">
                <span className="size-1.5 rounded-full" style={{ background: c.color }} />
                <span className="w-9">{c.id}</span>
                <span className="text-fg">{ind.data[c.id][hoverIdx].toFixed(1)}</span>
                <span className="text-dim">{ind.unit}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <p className="font-mono text-[10px] text-dim">
        illustrative annual sample · shaded band = 2020 · source pipeline: FRED API → pandas → Flask → React
      </p>
    </div>
  );
}
