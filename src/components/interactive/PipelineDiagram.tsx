"use client";

import { motion } from "framer-motion";
import { Boxes, Database, GitCommitHorizontal, PackageCheck, Rocket, Server, TestTube2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { cn } from "@/components/ui/Card";

const STAGES = [
  { id: "commit", label: "git push", icon: GitCommitHorizontal, log: "$ git push origin feature/orders-api" },
  { id: "test", label: "lint + test", icon: TestTube2, log: "✓ eslint · ✓ 142 tests passed (6.1s)" },
  { id: "build", label: "docker build", icon: Boxes, log: "→ multi-stage build · image 84.2 MB" },
  { id: "push", label: "registry", icon: PackageCheck, log: "→ pushed api:sha-3f9c2e1" },
  { id: "deploy", label: "deploy", icon: Rocket, log: "→ rolling update 3/3 healthy" },
  { id: "api", label: "REST API", icon: Server, log: "GET /v1/orders?status=pending 200 · 38ms" },
] as const;

/** Animated CI/CD → container → API → database flow. */
export function PipelineDiagram() {
  const { motionOn } = useApp();
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (!motionOn) return;
    const id = setInterval(() => setStage((s) => (s + 1) % (STAGES.length + 1)), 1100);
    return () => clearInterval(id);
  }, [motionOn]);

  const logs = STAGES.slice(0, Math.min(stage + 1, STAGES.length));

  return (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {STAGES.map((s, i) => {
          const Icon = s.icon;
          const done = i < stage;
          const current = i === stage;
          return (
            <button
              type="button"
              key={s.id}
              onClick={() => setStage(i)}
              className={cn(
                "relative flex flex-col items-center gap-1.5 rounded-lg border px-2 py-3 text-center transition",
                current ? "border-accent/60 bg-accent/10" : done ? "border-emerald/30 bg-emerald/5" : "border-line bg-card-2",
              )}
            >
              <Icon className={cn("size-4", current ? "text-accent" : done ? "text-emerald" : "text-dim")} aria-hidden />
              <span className={cn("font-mono text-[10px]", current ? "text-fg" : "text-muted")}>{s.label}</span>
              {current && (
                <motion.span
                  layoutId="pipeline-pulse"
                  className="absolute inset-0 rounded-lg ring-1 ring-accent/50"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3 rounded-lg border border-line bg-card-2 p-3">
        <Server className="size-4 text-accent" aria-hidden />
        <span className="font-mono text-[11px] text-muted">api container</span>
        <div className="relative h-px flex-1 bg-line">
          <motion.span
            className="absolute -top-[3px] size-[7px] rounded-full bg-accent shadow-[0_0_10px] shadow-accent"
            animate={{ left: ["0%", "100%", "0%"] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <span className="font-mono text-[11px] text-muted">postgres</span>
        <Database className="size-4 text-emerald" aria-hidden />
      </div>

      <pre className="min-h-[132px] overflow-hidden rounded-lg border border-line bg-[#0A0C16] p-3 font-mono text-[11px] leading-relaxed text-muted">
        {logs.map((s, i) => (
          <div key={s.id} className={i === logs.length - 1 ? "text-fg" : undefined}>
            <span className="text-dim">[{String(i + 1).padStart(2, "0")}]</span> {s.log}
          </div>
        ))}
        {stage >= STAGES.length && <div className="text-emerald">✓ pipeline green — deployed to production</div>}
        <span className="inline-block h-3 w-1.5 translate-y-0.5 animate-blink bg-accent" />
      </pre>
    </div>
  );
}
