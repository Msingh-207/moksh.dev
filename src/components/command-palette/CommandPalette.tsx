"use client";

import { Command } from "cmdk";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Box,
  Code2,
  Copy,
  FileText,
  Film,
  FolderOpen,
  Hash,
  LayoutGrid,
  LineChart,
  Search,
  Sparkles,
  Terminal,
  Volume2,
  VolumeX,
  Zap,
  ZapOff,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import { SECTIONS, SITE } from "@/lib/site";
import { getTrack, TRACKS } from "@/lib/tracks";
import type { TrackFilter, TrackId } from "@/lib/types";

const TRACK_ICONS: Record<TrackId, typeof Code2> = {
  dev: Code2,
  quant: LineChart,
  video: Film,
  "3d": Box,
  linux: Terminal,
};

/**
 * Stricter than cmdk's default subsequence matcher: rank label prefix > word prefix >
 * substring > keyword hits, so "fred" finds FREDash rather than "filter software & web".
 */
function scoreItem(value: string, search: string, keywords?: string[]): number {
  const q = search.toLowerCase().trim();
  if (!q) return 1;
  const v = value.toLowerCase();
  const k = (keywords ?? []).join(" ").toLowerCase();
  const words = v.split(/[\s—\-&@/·:()]+/);
  if (v.startsWith(q)) return 1;
  if (words.some((w) => w.startsWith(q))) return 0.9;
  if (v.includes(q)) return 0.7;
  if (k.split(/\s+/).some((w) => w.startsWith(q))) return 0.5;
  if (k.includes(q)) return 0.4;
  const terms = q.split(/\s+/);
  if (terms.length > 1 && terms.every((t) => v.includes(t) || k.includes(t))) return 0.3;
  return 0;
}

function Item({
  value,
  keywords,
  onSelect,
  icon,
  children,
  hint,
}: {
  value: string;
  keywords?: string[];
  onSelect: () => void;
  icon: ReactNode;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <Command.Item
      value={value}
      keywords={keywords}
      onSelect={onSelect}
      className="mx-1.5 flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted transition-colors"
    >
      <span className="flex size-6 shrink-0 items-center justify-center rounded-md border border-line bg-bg text-muted">{icon}</span>
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {hint && (
        <span data-hint className="font-mono text-[10px] text-dim opacity-0 transition-opacity">
          {hint}
        </span>
      )}
    </Command.Item>
  );
}

export function CommandPalette() {
  const {
    paletteOpen,
    setPaletteOpen,
    projects,
    setTrack,
    openProject,
    scrollTo,
    copyEmail,
    soundOn,
    toggleSound,
    motionOn,
    toggleMotion,
    toast,
  } = useApp();
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!paletteOpen) return;
    lastFocus.current = document.activeElement as HTMLElement | null;
    const t = setTimeout(() => inputRef.current?.focus(), 10);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setPaletteOpen(false);
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey, true);
      lastFocus.current?.focus?.();
    };
  }, [paletteOpen, setPaletteOpen]);

  const close = () => {
    setPaletteOpen(false);
    setSearch("");
  };

  /** Run an action after the palette has closed (so scroll/focus work cleanly). */
  const run = (fn: () => void) => () => {
    close();
    setTimeout(fn, 60);
  };

  const filterTo = (t: TrackFilter) =>
    run(() => {
      setTrack(t);
      scrollTo("projects");
    });

  const openExternal = (url: string) =>
    run(() => {
      window.open(url, url.startsWith("http") ? "_blank" : "_self", "noopener,noreferrer");
    });

  return (
    <AnimatePresence>
      {paletteOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]">
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 500, damping: 36 }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-card shadow-2xl shadow-black/80"
          >
            <Command label="Command palette" loop filter={scoreItem} className="flex max-h-[min(70vh,560px)] flex-col">
              <div className="flex items-center gap-3 border-b border-line px-4">
                <Search className="size-4 text-dim" aria-hidden />
                <Command.Input
                  ref={inputRef}
                  value={search}
                  onValueChange={setSearch}
                  placeholder="Type a command or search projects…"
                  className="h-12 flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-dim"
                />
                <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-dim">esc</kbd>
              </div>

              <Command.List className="flex-1 overflow-y-auto overscroll-contain py-2">
                <Command.Empty className="px-4 py-10 text-center font-mono text-xs text-dim">
                  no results for “{search}”
                </Command.Empty>

                <Command.Group heading="Navigate">
                  {SECTIONS.map((s) => (
                    <Item key={s.id} value={`go ${s.label}`} keywords={["jump", "section", s.id]} onSelect={run(() => scrollTo(s.id))} icon={<Hash className="size-3.5" />} hint="jump">
                      Go to {s.label}
                    </Item>
                  ))}
                </Command.Group>

                <Command.Group heading="Filter archive">
                  <Item value="filter all projects" keywords={["archive", "everything"]} onSelect={filterTo("all")} icon={<LayoutGrid className="size-3.5" />} hint="?track=">
                    Show all projects
                  </Item>
                  {TRACKS.map((t) => {
                    const Icon = TRACK_ICONS[t.id];
                    return (
                      <Item key={t.id} value={`filter ${t.label}`} keywords={["track", t.id]} onSelect={filterTo(t.id)} icon={<Icon className={`size-3.5 ${t.accent}`} />} hint={`?track=${t.id}`}>
                        Filter: {t.label}
                      </Item>
                    );
                  })}
                </Command.Group>

                <Command.Group heading="Case studies">
                  {projects.map((p) => (
                    <Item
                      key={p.slug}
                      value={`open ${p.title}`}
                      keywords={[...p.stack, getTrack(p.track).label]}
                      onSelect={run(() => openProject(p.slug))}
                      icon={<FolderOpen className="size-3.5" style={{ color: getTrack(p.track).hex }} />}
                      hint={getTrack(p.track).short}
                    >
                      {p.title}
                    </Item>
                  ))}
                </Command.Group>

                <Command.Group heading="Actions">
                  <Item value="copy email" keywords={["contact", "mail", SITE.email]} onSelect={run(() => void copyEmail())} icon={<Copy className="size-3.5" />} hint={SITE.email}>
                    Copy email address
                  </Item>
                  <Item value="open resume" keywords={["cv", "pdf"]} onSelect={openExternal(SITE.resume)} icon={<FileText className="size-3.5" />} hint="résumé">
                    Open résumé
                  </Item>
                  <Item value="open github" keywords={["code", "repos"]} onSelect={openExternal(SITE.github)} icon={<GithubIcon className="size-3.5" />} hint="↗">
                    GitHub — Msingh-207
                  </Item>
                  <Item value="open linkedin" keywords={["social", "connect"]} onSelect={openExternal(SITE.linkedin)} icon={<LinkedinIcon className="size-3.5" />} hint="↗">
                    LinkedIn
                  </Item>
                </Command.Group>

                <Command.Group heading="Preferences">
                  <Item
                    value="toggle sound"
                    keywords={["audio", "ui sounds", "mute"]}
                    onSelect={() => {
                      toggleSound();
                      toast(soundOn ? "UI sounds off" : "UI sounds on");
                    }}
                    icon={soundOn ? <Volume2 className="size-3.5 text-emerald" /> : <VolumeX className="size-3.5" />}
                    hint={soundOn ? "on" : "off"}
                  >
                    {soundOn ? "Disable" : "Enable"} UI sounds
                  </Item>
                  <Item
                    value="toggle motion previews"
                    keywords={["animation", "reduce motion", "accessibility"]}
                    onSelect={() => {
                      toggleMotion();
                      toast(motionOn ? "Motion previews paused" : "Motion previews on");
                    }}
                    icon={motionOn ? <Zap className="size-3.5 text-amber" /> : <ZapOff className="size-3.5" />}
                    hint={motionOn ? "on" : "off"}
                  >
                    {motionOn ? "Pause" : "Resume"} motion previews
                  </Item>
                </Command.Group>
              </Command.List>

              <div className="flex items-center gap-4 border-t border-line px-4 py-2.5 font-mono text-[10px] text-dim">
                <span className="flex items-center gap-1">
                  <Sparkles className="size-3 text-accent" /> {SITE.domain}
                </span>
                <span className="ml-auto flex items-center gap-1">
                  ↑↓ navigate
                </span>
                <span className="flex items-center gap-1">
                  <ArrowRight className="size-3" /> enter
                </span>
              </div>
            </Command>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
