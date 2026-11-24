"use client";

import { Pause, Play, RotateCcw, StepForward } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/components/ui/Card";

/**
 * Interactive root-finding visualiser (bisection, Newton–Raphson, secant).
 * All iterations are computed up front (pure); the UI reveals them step by step.
 */

interface Fn {
  id: string;
  label: string;
  f: (x: number) => number;
  domain: [number, number];
  bracket: [number, number];
  x0: number;
  note: string;
}

const FUNCTIONS: Fn[] = [
  {
    id: "excess",
    label: "Z(p) = 120/p − (4p + 10)",
    f: (p) => 120 / p - (4 * p + 10),
    domain: [2, 9],
    bracket: [2, 9],
    x0: 9,
    note: "Excess demand: D(p) = 120/p, S(p) = 4p + 10. The root is the market-clearing price p*.",
  },
  {
    id: "cubic",
    label: "f(x) = x³ − x − 2",
    f: (x) => x ** 3 - x - 2,
    domain: [0, 3],
    bracket: [1, 2],
    x0: 2.6,
    note: "Classic textbook cubic with a single real root near 1.521.",
  },
  {
    id: "cos",
    label: "f(x) = cos x − x",
    f: (x) => Math.cos(x) - x,
    domain: [-0.5, 1.6],
    bracket: [0, 1.5],
    x0: 1.4,
    note: "The Dottie number: the fixed point of cos x, ≈ 0.739085.",
  },
];

type Method = "bisection" | "newton" | "secant";
const METHODS: { id: Method; label: string }[] = [
  { id: "bisection", label: "Bisection" },
  { id: "newton", label: "Newton–Raphson" },
  { id: "secant", label: "Secant" },
];

interface Iter {
  n: number;
  x: number;
  fx: number;
  err: number;
  a?: number;
  b?: number;
  prev?: number;
}

const TOL = 1e-6;
const MAX = 40;
const deriv = (f: (x: number) => number, x: number) => (f(x + 1e-6) - f(x - 1e-6)) / 2e-6;

function solve(fn: Fn, method: Method): Iter[] {
  const { f } = fn;
  const out: Iter[] = [];
  if (method === "bisection") {
    let [a, b] = fn.bracket;
    for (let n = 1; n <= MAX; n++) {
      const c = (a + b) / 2;
      const fc = f(c);
      out.push({ n, x: c, fx: fc, err: (b - a) / 2, a, b });
      if (Math.abs(fc) < TOL || (b - a) / 2 < TOL) break;
      if (Math.sign(fc) === Math.sign(f(a))) a = c;
      else b = c;
    }
  } else if (method === "newton") {
    let x = fn.x0;
    for (let n = 1; n <= MAX; n++) {
      const d = deriv(f, x);
      if (!Number.isFinite(d) || Math.abs(d) < 1e-12) break;
      const next = x - f(x) / d;
      out.push({ n, x: next, fx: f(next), err: Math.abs(next - x), prev: x });
      if (Math.abs(next - x) < TOL) break;
      x = next;
    }
  } else {
    let x0 = fn.bracket[0];
    let x1 = fn.x0;
    for (let n = 1; n <= MAX; n++) {
      const f0 = f(x0), f1 = f(x1);
      if (f1 === f0) break;
      const x2 = x1 - (f1 * (x1 - x0)) / (f1 - f0);
      out.push({ n, x: x2, fx: f(x2), err: Math.abs(x2 - x1), prev: x1, a: x0 });
      if (Math.abs(x2 - x1) < TOL) break;
      x0 = x1;
      x1 = x2;
    }
  }
  return out;
}

const W = 560;
const H = 260;
const P = 28;

export function RootFinder() {
  const [fnId, setFnId] = useState(FUNCTIONS[0].id);
  const [method, setMethod] = useState<Method>("newton");
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);

  const fn = FUNCTIONS.find((f) => f.id === fnId) ?? FUNCTIONS[0];
  const iters = useMemo(() => solve(fn, method), [fn, method]);
  const shown = iters.slice(0, step);
  const last = shown[shown.length - 1];

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setStep((s) => {
        if (s >= iters.length) {
          setRunning(false);
          return s;
        }
        return s + 1;
      });
    }, 650);
    return () => clearInterval(id);
  }, [running, iters.length]);

  const { path, yMin, yMax } = useMemo(() => {
    const [lo, hi] = fn.domain;
    const pts: [number, number][] = [];
    for (let i = 0; i <= 200; i++) {
      const xv = lo + ((hi - lo) * i) / 200;
      pts.push([xv, fn.f(xv)]);
    }
    const ys = pts.map((p) => p[1]).filter(Number.isFinite);
    const min = Math.max(Math.min(...ys), -60);
    const max = Math.min(Math.max(...ys), 60);
    return { path: pts, yMin: Math.min(min, -1), yMax: Math.max(max, 1) };
  }, [fn]);

  const sx = (x: number) => P + ((x - fn.domain[0]) / (fn.domain[1] - fn.domain[0])) * (W - 2 * P);
  const sy = (y: number) => P / 2 + (1 - (Math.max(yMin, Math.min(yMax, y)) - yMin) / (yMax - yMin)) * (H - P * 1.5);
  const d = path.map(([x, y], i) => `${i ? "L" : "M"}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join(" ");

  const reset = (nextFn = fnId, nextMethod = method) => {
    setFnId(nextFn);
    setMethod(nextMethod);
    setStep(0);
    setRunning(false);
  };

  return (
    <div className="space-y-3 p-4">
      <div className="flex flex-wrap gap-1.5">
        {FUNCTIONS.map((f) => (
          <button
            type="button"
            key={f.id}
            onClick={() => reset(f.id, method)}
            className={cn(
              "rounded-md border px-2 py-1 font-mono text-[11px] transition",
              f.id === fnId ? "border-emerald/50 bg-emerald/10 text-fg" : "border-line text-dim hover:text-muted",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-lg border border-line bg-card-2 p-0.5">
          {METHODS.map((m) => (
            <button
              type="button"
              key={m.id}
              onClick={() => reset(fnId, m.id)}
              className={cn(
                "rounded-md px-2.5 py-1 font-mono text-[11px] transition",
                m.id === method ? "bg-[#1E2440] text-fg" : "text-dim hover:text-muted",
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex gap-1.5">
          <button type="button" aria-label="Step" onClick={() => setStep((s) => Math.min(s + 1, iters.length))} className="rounded-md border border-line p-1.5 text-muted hover:text-fg">
            <StepForward className="size-3.5" />
          </button>
          <button type="button" aria-label={running ? "Pause" : "Run"} onClick={() => setRunning((r) => !r)} className="rounded-md border border-line p-1.5 text-muted hover:text-fg">
            {running ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
          </button>
          <button type="button" aria-label="Reset" onClick={() => reset()} className="rounded-md border border-line p-1.5 text-muted hover:text-fg">
            <RotateCcw className="size-3.5" />
          </button>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-lg border border-line bg-[#0A0C16]" role="img" aria-label={`Plot of ${fn.label}`}>
        <line x1={P} x2={W - P} y1={sy(0)} y2={sy(0)} stroke="#334155" />
        {method === "bisection" && last?.a !== undefined && last.b !== undefined && (
          <rect x={sx(last.a)} y={P / 2} width={Math.max(1, sx(last.b) - sx(last.a))} height={H - P * 1.5} fill="#34d399" opacity={0.08} />
        )}
        <path d={d} fill="none" stroke="#94A3B8" strokeWidth={1.75} />
        {method === "newton" && last?.prev !== undefined && (
          <line x1={sx(last.prev)} y1={sy(fn.f(last.prev))} x2={sx(last.x)} y2={sy(0)} stroke="#22d3ee" strokeDasharray="4 3" />
        )}
        {method === "secant" && last?.prev !== undefined && last.a !== undefined && (
          <line x1={sx(last.a)} y1={sy(fn.f(last.a))} x2={sx(last.x)} y2={sy(0)} stroke="#a78bfa" strokeDasharray="4 3" />
        )}
        {shown.map((it, i) => (
          <circle key={it.n} cx={sx(it.x)} cy={sy(0)} r={i === shown.length - 1 ? 4.5 : 2.5} fill={i === shown.length - 1 ? "#34d399" : "#475569"} />
        ))}
        {last && (
          <text x={Math.min(sx(last.x) + 8, W - 120)} y={sy(0) - 8} className="fill-emerald font-mono text-[11px]">
            x{last.n} = {last.x.toFixed(6)}
          </text>
        )}
      </svg>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <div className="max-h-36 overflow-auto rounded-lg border border-line">
          <table className="w-full font-mono text-[11px]">
            <thead className="sticky top-0 bg-card-2 text-dim">
              <tr>
                <th className="px-2 py-1 text-left font-normal">n</th>
                <th className="px-2 py-1 text-left font-normal">xₙ</th>
                <th className="px-2 py-1 text-left font-normal">f(xₙ)</th>
                <th className="px-2 py-1 text-left font-normal">error</th>
              </tr>
            </thead>
            <tbody>
              {shown.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-2 py-3 text-center text-dim">
                    press ▶ or step to iterate
                  </td>
                </tr>
              )}
              {shown.map((it) => (
                <tr key={it.n} className="border-t border-line/60 text-muted">
                  <td className="px-2 py-1">{it.n}</td>
                  <td className="px-2 py-1 text-fg">{it.x.toFixed(6)}</td>
                  <td className="px-2 py-1">{it.fx.toExponential(2)}</td>
                  <td className="px-2 py-1">{it.err.toExponential(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="space-y-1 rounded-lg border border-line bg-card-2 p-3 font-mono text-[11px] sm:w-44">
          <div className="text-dim">iterations</div>
          <div className="text-lg text-fg">
            {step}
            <span className="text-dim">/{iters.length}</span>
          </div>
          <div className="text-dim">tolerance 1e-6</div>
          {step >= iters.length && iters.length > 0 && <div className="text-emerald">✓ converged</div>}
        </div>
      </div>
      <p className="text-xs text-muted">{fn.note}</p>
    </div>
  );
}
