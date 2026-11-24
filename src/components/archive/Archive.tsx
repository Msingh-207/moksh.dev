"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Link2 } from "lucide-react";
import { Band, SectionHeading } from "@/components/ui/Card";
import { useApp } from "@/components/providers/AppProvider";
import { FilterBar } from "./FilterBar";
import { ProjectCard } from "./ProjectCard";

export function Archive() {
  const { projects, track, setTrack, openProject, toast } = useApp();
  const visible = track === "all" ? projects : projects.filter((p) => p.track === track);

  return (
    <Band id="projects" alt labelledBy="archive-title">
      <SectionHeading
        index="03"
        eyebrow="Projects"
        title={
          <span id="archive-title">
            Selected <span className="text-brand">work</span>
          </span>
        }
        kicker="Software, quant models, edits, renders and rices. Open any card for the full case study."
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <FilterBar active={track} onChange={setTrack} projects={projects} />
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(window.location.href);
              toast("Link to this view copied");
            } catch {
              toast("Couldn't access clipboard");
            }
          }}
          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 font-mono text-[11px] text-dim transition hover:text-fg"
        >
          <Link2 className="size-3.5" aria-hidden />
          {track === "all" ? "share" : `?track=${track}`}
        </button>
      </div>

      <motion.div layout className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((p) => (
            <ProjectCard key={p.slug} project={p} onOpen={() => openProject(p.slug)} />
          ))}
        </AnimatePresence>
      </motion.div>
      {visible.length === 0 && (
        <p className="rounded-xl border border-dashed border-line p-8 text-center text-sm text-muted">
          Nothing in this track yet — add a Markdown file to /content/projects.
        </p>
      )}
    </Band>
  );
}
