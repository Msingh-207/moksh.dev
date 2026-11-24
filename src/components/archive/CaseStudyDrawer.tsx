"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Embed } from "@/components/interactive/Embed";
import { useApp } from "@/components/providers/AppProvider";
import { GithubIcon } from "@/components/ui/icons";
import { Badge } from "@/components/ui/Card";
import { getTrack } from "@/lib/tracks";

export function CaseStudyDrawer() {
  const { projects, openSlug, openProject } = useApp();
  const project = projects.find((p) => p.slug === openSlug) ?? null;
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const idx = project ? projects.indexOf(project) : -1;
  const prev = idx > 0 ? projects[idx - 1] : null;
  const next = idx >= 0 && idx < projects.length - 1 ? projects[idx + 1] : null;

  const isOpen = !!project;

  // Lock scroll, remember/restore focus, Esc to close, simple focus trap.
  useEffect(() => {
    if (!isOpen) return;
    lastFocus.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => closeRef.current?.focus(), 50);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !document.querySelector("[cmdk-root]")) {
        openProject(null);
      } else if (e.key === "Tab" && panelRef.current) {
        const els = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input, select, textarea',
        );
        if (!els.length) return;
        const first = els[0], last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      lastFocus.current?.focus?.();
    };
  }, [isOpen, openProject]);

  // Scroll to top when switching between projects inside the drawer.
  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0 });
  }, [openSlug]);

  const t = project ? getTrack(project.track) : null;

  return (
    <AnimatePresence>
      {project && t && (
        <div className="fixed inset-0 z-50" role="presentation">
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => openProject(null)}
          />
          <motion.aside
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-study-title"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 36 }}
            className="absolute inset-y-0 right-0 flex w-full max-w-3xl flex-col overflow-y-auto border-l border-line bg-bg shadow-2xl shadow-black"
          >
            <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-line bg-bg/85 px-5 py-3 backdrop-blur">
              <span className="font-mono text-[11px]" style={{ color: t.hex }}>
                [{t.label}]
              </span>
              <span className="truncate font-mono text-[11px] text-dim">/content/projects/{project.slug}.md</span>
              <div className="ml-auto flex items-center gap-1">
                <button
                  type="button"
                  disabled={!prev}
                  onClick={() => prev && openProject(prev.slug)}
                  aria-label="Previous project"
                  className="rounded-md p-1.5 text-muted hover:bg-card hover:text-fg disabled:opacity-30"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  disabled={!next}
                  onClick={() => next && openProject(next.slug)}
                  aria-label="Next project"
                  className="rounded-md p-1.5 text-muted hover:bg-card hover:text-fg disabled:opacity-30"
                >
                  <ChevronRight className="size-4" />
                </button>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => openProject(null)}
                  aria-label="Close case study"
                  className="ml-1 flex items-center gap-1.5 rounded-md border border-line px-2 py-1 font-mono text-[11px] text-muted hover:text-fg"
                >
                  esc <X className="size-3.5" />
                </button>
              </div>
            </div>

            <div className="px-5 py-8 sm:px-8">
              <div className="font-mono text-xs text-dim">
                {project.year}
                {project.role ? ` · ${project.role}` : ""}
              </div>
              <h2 id="case-study-title" className="mt-2 text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
                {project.title}
              </h2>
              {project.subtitle && <p className="mt-1 text-sm" style={{ color: t.hex }}>{project.subtitle}</p>}
              <p className="mt-4 text-[15px] leading-relaxed text-muted">{project.summary}</p>

              {project.metrics.length > 0 && (
                <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {project.metrics.map((m) => (
                    <div key={m.label} className="rounded-xl border border-line bg-card px-4 py-3">
                      <div className="font-mono text-[10px] uppercase tracking-wider text-dim">{m.label}</div>
                      <div className="mt-1 font-mono text-sm text-fg">{m.value}</div>
                    </div>
                  ))}
                </div>
              )}

              {project.links.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-line bg-card px-3 py-2 text-sm text-fg transition hover:border-line-strong"
                    >
                      {l.kind === "repo" ? <GithubIcon className="size-4" /> : <ArrowUpRight className="size-4 text-accent" />}
                      {l.label}
                    </a>
                  ))}
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-1.5">
                {project.stack.map((s) => (
                  <Badge key={s}>{s}</Badge>
                ))}
              </div>

              {/* Optional local media (set `video:` / `cover:` in front-matter; files live in /public/media/) */}
              {project.video && (
                <video
                  src={project.video}
                  className="mt-8 w-full rounded-xl border border-line"
                  controls
                  playsInline
                  preload="metadata"
                />
              )}
              {project.cover && !project.video && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={project.cover} alt={`${project.title} cover`} className="mt-8 w-full rounded-xl border border-line" />
              )}

              {project.embeds.length > 0 && (
                <div className="mt-8 space-y-4">
                  <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-dim">interactive</div>
                  {project.embeds.map((id) => (
                    <Embed key={id} id={id} />
                  ))}
                </div>
              )}

              <article className="prose-case mt-6">
                <ReactMarkdown
                  components={{
                    a: ({ href, children }) => (
                      <a href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                        {children}
                      </a>
                    ),
                  }}
                >
                  {project.body}
                </ReactMarkdown>
              </article>

              {next && (
                <button
                  type="button"
                  onClick={() => openProject(next.slug)}
                  className="mt-12 flex w-full items-center justify-between rounded-xl border border-line bg-card px-5 py-4 text-left transition hover:border-line-strong"
                >
                  <span>
                    <span className="block font-mono text-[10.5px] text-dim">next case study</span>
                    <span className="text-sm font-medium text-fg">{next.title}</span>
                  </span>
                  <ChevronRight className="size-4 text-muted" />
                </button>
              )}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
