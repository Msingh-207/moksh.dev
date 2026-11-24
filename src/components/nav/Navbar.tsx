"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { cn } from "@/components/ui/Card";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import { useModKey } from "@/components/ui/useModKey";
import { SECTIONS, SITE } from "@/lib/site";

const subscribeScroll = (cb: () => void) => {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
};

export function Navbar() {
  const { setPaletteOpen, setHireOpen, scrollTo } = useApp();
  const mod = useModKey();
  const [active, setActive] = useState<string>("top");
  const scrolled = useSyncExternalStore(subscribeScroll, () => window.scrollY > 8, () => false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Mobile menu: Esc closes, body scroll locks, and it auto-closes when the viewport reaches the desktop breakpoint.
  useEffect(() => {
    if (!menuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const mq = window.matchMedia("(min-width: 1024px)");
    const onMq = () => mq.matches && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [menuOpen]);

  /** Close the menu first, then navigate, so the scroll isn't blocked by the scroll lock. */
  const go = (fn: () => void) => {
    setMenuOpen(false);
    setTimeout(fn, 50);
  };

  // Scroll-spy: highlight the section currently crossing the upper third of the viewport.
  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-colors duration-300",
        // backdrop-filter would trap the menu's fixed overlay inside the header, so go solid while the menu is open
        menuOpen
          ? "border-b border-line/80 bg-bg"
          : scrolled
            ? "border-b border-line/80 bg-bg/75 backdrop-blur-xl"
            : "border-b border-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6" aria-label="Primary">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            go(() => scrollTo("top"));
          }}
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-fg"
          aria-label="Moksh.dev — home"
        >
          <span>
            Moksh<span className="text-accent">.dev</span>
          </span>
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-pulse-dot rounded-full bg-indigo/70" />
            <span className="relative inline-flex size-2 rounded-full bg-accent shadow-[0_0_12px_2px] shadow-indigo/70" />
          </span>
        </a>

        <ul className="mx-auto hidden items-center gap-1 lg:flex">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(s.id);
                }}
                aria-current={active === s.id ? "true" : undefined}
                className={cn(
                  "relative block px-3 py-2 text-sm font-medium transition-colors",
                  active === s.id ? "text-fg" : "text-muted hover:text-fg",
                )}
              >
                {s.label}
                {active === s.id && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-brand shadow-[0_0_10px] shadow-indigo/70"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
              </a>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="hidden rounded-lg border border-line bg-card/60 px-2 py-1.5 font-mono text-[11px] text-muted transition hover:border-line-strong hover:text-fg sm:block"
            aria-label="Open command palette"
          >
            [ {mod}K ]
          </button>
          <button
            type="button"
            onClick={() => setHireOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-indigo px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo/30 transition hover:bg-violet"
          >
            Hire Me <ArrowUpRight className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex size-10 items-center justify-center rounded-xl border border-line bg-card/60 text-fg transition hover:border-indigo/50 lg:hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={menuOpen ? "x" : "menu"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              aria-hidden
              className="fixed inset-x-0 bottom-0 top-16 bg-[#05060d]/70 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ type: "spring", stiffness: 420, damping: 36 }}
              className="absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-line bg-bg shadow-2xl shadow-black/60 lg:hidden"
            >
              <nav aria-label="Mobile" className="mx-auto max-w-6xl px-4 pb-6 pt-3 sm:px-6">
                <ul className="divide-y divide-line/70">
                  {SECTIONS.map((s, i) => (
                    <motion.li
                      key={s.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.03 * i }}
                    >
                      <a
                        href={`#${s.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          go(() => scrollTo(s.id));
                        }}
                        aria-current={active === s.id ? "true" : undefined}
                        className={cn(
                          "flex items-center gap-4 py-3.5 text-lg font-semibold transition-colors",
                          active === s.id ? "text-fg" : "text-muted hover:text-fg",
                        )}
                      >
                        <span className={cn("font-mono text-xs", active === s.id ? "text-accent" : "text-dim")}>
                          {String(i).padStart(2, "0")}
                        </span>
                        {s.label}
                        {active === s.id && <span className="ml-auto size-1.5 rounded-full bg-accent shadow-[0_0_10px_2px] shadow-indigo/70" />}
                      </a>
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => go(() => setHireOpen(true))}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand py-3 text-sm font-semibold text-white"
                  >
                    Hire Me <ArrowUpRight className="size-4" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(() => setPaletteOpen(true))}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-line-strong py-3 text-sm font-semibold text-fg"
                  >
                    Search <span className="font-mono text-[11px] text-dim">{mod}K</span>
                  </button>
                </div>
                <div className="mt-4 flex items-center justify-center gap-6 text-sm text-muted">
                  <a href={SITE.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-fg">
                    <GithubIcon className="size-4" /> GitHub
                  </a>
                  <a href={SITE.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-fg">
                    <LinkedinIcon className="size-4" /> LinkedIn
                  </a>
                  <a href={SITE.resume} className="hover:text-fg">
                    CV ↓
                  </a>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
