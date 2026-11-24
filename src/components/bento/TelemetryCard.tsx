"use client";

import { MapPin } from "lucide-react";
import { useSyncExternalStore } from "react";
import { Card, CardLabel } from "@/components/ui/Card";
import { SITE } from "@/lib/site";

const subscribe = (cb: () => void) => {
  const id = setInterval(cb, 1000);
  return () => clearInterval(id);
};
const fmt = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  timeZone: SITE.timezone,
});
const getTime = () => fmt.format(new Date());

const FOCUS = [
  { k: "backend", v: "REST APIs & containerised pipelines" },
  { k: "quant", v: "Macroeconomic data tools" },
  { k: "motion", v: "Kinetic typography edits" },
];

const STATS = [
  { k: "work", v: "SDE Trainee" },
  { k: "study", v: "B.A. Econ · Y2" },
  { k: "edit", v: "Resolve" },
];

export function TelemetryCard() {
  const time = useSyncExternalStore(subscribe, getTime, () => "--:--:--");

  return (
    <Card className="flex flex-col gap-5 p-6 lg:col-span-5">
      <CardLabel>
        <span>telemetry</span>
        <span className="ml-auto">live</span>
      </CardLabel>

      <div className="flex items-start gap-3 rounded-xl border border-emerald/20 bg-emerald/5 p-3.5">
        <span className="relative mt-1.5 flex size-2.5 shrink-0">
          <span className="absolute inline-flex size-full animate-pulse-dot rounded-full bg-emerald/60" />
          <span className="relative inline-flex size-2.5 rounded-full bg-emerald" />
        </span>
        <p className="text-sm text-fg">Available for select freelance &amp; engineering roles</p>
      </div>

      <div>
        <div className="mb-2 font-mono text-[11px] text-dim">current_focus[]</div>
        <ul className="space-y-1.5">
          {FOCUS.map((f) => (
            <li key={f.k} className="flex items-baseline gap-3 text-sm">
              <span className="w-16 shrink-0 font-mono text-[11px] text-accent">{f.k}</span>
              <span className="text-muted">{f.v}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {STATS.map((s) => (
          <div key={s.k} className="rounded-lg border border-line bg-card-2 px-3 py-2">
            <div className="font-mono text-[10px] uppercase tracking-wider text-dim">{s.k}</div>
            <div className="mt-0.5 font-mono text-[11px] leading-snug text-fg sm:text-xs">{s.v}</div>
          </div>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-line pt-4 font-mono text-xs">
        <span className="flex items-center gap-1.5 text-muted">
          <MapPin className="size-3.5" aria-hidden />
          {SITE.location}
        </span>
        <span className="tabular-nums text-fg">
          {time} <span className="text-dim">IST</span>
        </span>
      </div>
    </Card>
  );
}
