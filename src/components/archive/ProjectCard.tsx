"use client";

import { motion } from "framer-motion";
import type { Ref } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Card";
import { getTrack } from "@/lib/tracks";
import type { Project } from "@/lib/types";
import { TrackGlyph } from "./TrackGlyph";

export function ProjectCard({
  project,
  onOpen,
  ref,
}: {
  project: Project;
  onOpen: () => void;
  /** Forwarded so <AnimatePresence mode="popLayout"> can measure the card. */
  ref?: Ref<HTMLButtonElement>;
}) {
  const t = getTrack(project.track);
  return (
    <motion.button
      ref={ref}
      type="button"
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 380, damping: 34 }}
      onClick={onOpen}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-card text-left transition-colors hover:border-line-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      aria-label={`Open case study: ${project.title}`}
    >
      <div className="relative h-28 border-b border-line bg-[#0D1020] bg-grid px-5 py-4">
        <div
          aria-hidden
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: `radial-gradient(ellipse at 30% 0%, ${t.hex}22, transparent 70%)` }}
        />
        <div className="relative h-full w-1/2 opacity-80 transition group-hover:opacity-100">
          <TrackGlyph track={project.track} hex={t.hex} />
        </div>
        <span className="absolute right-4 top-4 flex items-center gap-1.5 font-mono text-[10.5px]" style={{ color: t.hex }}>
          {project.featured && <Sparkles className="size-3" aria-label="Featured" />}[{t.label}]
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start gap-3">
          <h3 className="flex-1 text-base font-semibold leading-snug text-fg">{project.title}</h3>
          <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-dim transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" aria-hidden />
        </div>
        <p className="line-clamp-3 text-sm leading-relaxed text-muted">{project.summary}</p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {project.stack.slice(0, 4).map((s) => (
            <Badge key={s}>{s}</Badge>
          ))}
          {project.stack.length > 4 && <Badge className="text-dim">+{project.stack.length - 4}</Badge>}
        </div>
        <div className="flex items-center justify-between border-t border-line pt-3 font-mono text-[10.5px] text-dim">
          <span>{project.role}</span>
          <span>{project.year}</span>
        </div>
      </div>
    </motion.button>
  );
}
