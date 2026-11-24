"use client";

import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { Check } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { SITE } from "@/lib/site";
import { playBlip } from "@/lib/sound";
import { isTrackId } from "@/lib/tracks";
import type { Project, TrackFilter } from "@/lib/types";
import { useQueryParam } from "@/lib/url-state";

interface AppState {
  projects: Project[];
  /** Active archive filter, synced to `?track=` */
  track: TrackFilter;
  setTrack: (t: TrackFilter) => void;
  /** Open case study slug, synced to `?project=` */
  openSlug: string | null;
  openProject: (slug: string | null) => void;
  hireOpen: boolean;
  setHireOpen: (open: boolean) => void;
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  soundOn: boolean;
  toggleSound: () => void;
  motionOn: boolean;
  toggleMotion: () => void;
  toast: (message: string) => void;
  copyEmail: () => Promise<void>;
  blip: (freq?: number) => void;
  scrollTo: (id: string) => void;
}

const AppContext = createContext<AppState | null>(null);

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}

export function AppProvider({ projects, children }: { projects: Project[]; children: ReactNode }) {
  const [trackParam, setTrackParam] = useQueryParam("track");
  const [projectParam, setProjectParam] = useQueryParam("project");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [hireOpen, setHireOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [motionOn, setMotionOn] = useState(true);
  const [toastMsg, setToastMsg] = useState<{ id: number; text: string } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const track: TrackFilter = isTrackId(trackParam) ? trackParam : "all";
  const openSlug = projectParam && projects.some((p) => p.slug === projectParam) ? projectParam : null;

  const blip = useCallback(
    (freq?: number) => {
      if (soundOn) playBlip(freq);
    },
    [soundOn],
  );

  const toast = useCallback((text: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToastMsg({ id: Date.now(), text });
    toastTimer.current = setTimeout(() => setToastMsg(null), 2200);
  }, []);

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(SITE.email);
      toast(`Copied ${SITE.email}`);
    } catch {
      toast(`Email: ${SITE.email}`);
    }
    blip(1320);
  }, [toast, blip]);

  const setTrack = useCallback(
    (t: TrackFilter) => {
      setTrackParam(t === "all" ? null : t);
      blip(660);
    },
    [setTrackParam, blip],
  );

  const openProject = useCallback(
    (slug: string | null) => {
      setProjectParam(slug);
      blip(slug ? 990 : 520);
    },
    [setProjectParam, blip],
  );

  const scrollTo = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({ behavior: motionOn ? "smooth" : "auto", block: "start" });
    },
    [motionOn],
  );

  const toggleSound = useCallback(() => {
    setSoundOn((on) => {
      const next = !on;
      if (next) playBlip(1046);
      return next;
    });
  }, []);

  const toggleMotion = useCallback(() => setMotionOn((m) => !m), []);

  // Reflect the motion toggle on <html> so CSS animations can pause globally.
  useEffect(() => {
    document.documentElement.dataset.motion = motionOn ? "on" : "off";
  }, [motionOn]);

  // Global ⌘K / Ctrl+K shortcut.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  const value = useMemo<AppState>(
    () => ({
      projects,
      track,
      setTrack,
      openSlug,
      openProject,
      hireOpen,
      setHireOpen,
      paletteOpen,
      setPaletteOpen,
      soundOn,
      toggleSound,
      motionOn,
      toggleMotion,
      toast,
      copyEmail,
      blip,
      scrollTo,
    }),
    [projects, track, setTrack, openSlug, openProject, hireOpen, paletteOpen, soundOn, toggleSound, motionOn, toggleMotion, toast, copyEmail, blip, scrollTo],
  );

  return (
    <AppContext.Provider value={value}>
      <MotionConfig reducedMotion={motionOn ? "user" : "always"}>
        {children}
        <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[80] flex justify-center px-4">
          <AnimatePresence>
            {toastMsg && (
              <motion.div
                key={toastMsg.id}
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
                className="flex items-center gap-2 rounded-full border border-line bg-card/95 px-4 py-2 font-mono text-xs text-fg shadow-2xl shadow-black/60 backdrop-blur"
              >
                <Check className="size-3.5 text-emerald" aria-hidden />
                {toastMsg.text}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </MotionConfig>
    </AppContext.Provider>
  );
}
