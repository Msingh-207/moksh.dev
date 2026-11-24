"use client";

import { ArrowUpRight, Box, Code2, Film, LineChart, Terminal } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardLabel, cn } from "@/components/ui/Card";
import { useApp } from "@/components/providers/AppProvider";
import { TRACKS } from "@/lib/tracks";
import type { TrackId } from "@/lib/types";

const ICONS: Record<TrackId, typeof Code2> = {
  dev: Code2,
  quant: LineChart,
  video: Film,
  "3d": Box,
  linux: Terminal,
};

export function DisciplineStrip() {
  const { projects, setTrack, scrollTo, track } = useApp();

  return (
    <Card className="flex flex-col gap-4 p-6 lg:col-span-5">
      <CardLabel>
        <span>disciplines</span>
        <span className="ml-auto">jump → archive</span>
      </CardLabel>
      <div className="grid flex-1 grid-cols-2 gap-2">
        {TRACKS.map((t, i) => {
          const Icon = ICONS[t.id];
          const count = projects.filter((p) => p.track === t.id).length;
          return (
            <motion.button
              type="button"
              key={t.id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setTrack(t.id);
                scrollTo("projects");
              }}
              className={cn(
                "group relative flex flex-col justify-between gap-3 rounded-xl border bg-card-2 p-3 text-left transition",
                track === t.id ? "border-line-strong" : "border-line hover:border-line-strong",
                i === TRACKS.length - 1 && "col-span-2",
              )}
            >
              <div className="flex items-center justify-between">
                <Icon className={cn("size-4", t.accent)} aria-hidden />
                <ArrowUpRight className="size-3.5 text-dim transition group-hover:text-fg" aria-hidden />
              </div>
              <div>
                <div className="text-sm font-medium text-fg">{t.label}</div>
                <div className="font-mono text-[10.5px] text-dim">
                  {t.short} · {count} {count === 1 ? "entry" : "entries"}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </Card>
  );
}
