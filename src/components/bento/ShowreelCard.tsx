"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Card, CardLabel, cn } from "@/components/ui/Card";
import { AudashPreview } from "@/components/interactive/AudashPreview";
import { FusionPreview } from "@/components/interactive/FusionPreview";
import { HyprlandPreview } from "@/components/interactive/HyprlandPreview";
import { useApp } from "@/components/providers/AppProvider";
import { useState } from "react";

/**
 * Featured "showreel" viewport. Each tab is a live React preview rather than a video file.
 * Want a real reel instead? Drop /public/media/showreel.mp4 and add a tab that renders:
 *   <video src="/media/showreel.mp4" autoPlay muted loop playsInline className="size-full object-cover" />
 */
const TABS = [
  { id: "audash", label: "AUDash UI", slug: "audash", file: "audash.vercel.app" },
  { id: "fusion", label: "DaVinci Fusion", slug: "davinci-motion", file: "Fusion · Comp1" },
  { id: "hypr", label: "Hyprland Rice", slug: "hyprland-rice", file: "hyprland · ws" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function ShowreelCard() {
  const [tab, setTab] = useState<TabId>("audash");
  const { openProject } = useApp();
  const current = TABS.find((t) => t.id === tab)!;

  return (
    <Card className="flex flex-col p-2 lg:col-span-7">
      <div className="flex flex-wrap items-center gap-2 px-3 pb-2 pt-3">
        <CardLabel className="mr-2">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-pulse-dot rounded-full bg-rose/60" />
            <span className="relative inline-flex size-2 rounded-full bg-rose" />
          </span>
          preview
        </CardLabel>
        <div className="flex rounded-lg border border-line bg-bg p-0.5" role="tablist" aria-label="Featured previews">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "relative whitespace-nowrap rounded-md px-2 py-1 font-mono text-[10.5px] transition sm:px-2.5 sm:text-[11px]",
                tab === t.id ? "text-fg" : "text-dim hover:text-muted",
              )}
            >
              {tab === t.id && (
                <motion.span
                  layoutId="showreel-tab"
                  className="absolute inset-0 rounded-md bg-card-2 ring-1 ring-line"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative">{t.label}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => openProject(current.slug)}
          className="ml-auto font-mono text-[11px] text-dim transition hover:text-accent"
        >
          open case study →
        </button>
      </div>

      <div className="relative h-[330px] overflow-hidden rounded-xl border border-line bg-[#0D1020]">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.985 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
          >
            {tab === "audash" && <AudashPreview compact />}
            {tab === "fusion" && <FusionPreview compact />}
            {tab === "hypr" && <HyprlandPreview compact />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* NLE-style status bar */}
      <div className="flex items-center gap-3 px-3 pb-1 pt-2.5 font-mono text-[10px] text-dim">
        <span className="text-muted">{current.file}</span>
        <span className="hidden sm:inline">· live react preview · no video files</span>
        <span className="ml-auto flex gap-1">
          {TABS.map((t) => (
            <span key={t.id} className={cn("h-1 w-5 rounded-full", t.id === tab ? "bg-accent" : "bg-line")} />
          ))}
        </span>
      </div>
    </Card>
  );
}
