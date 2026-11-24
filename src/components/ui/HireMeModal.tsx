"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, Check, Copy, Mail, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { SITE } from "@/lib/site";
import { btnPrimary, btnSecondary } from "./Card";
import { GithubIcon, LinkedinIcon } from "./icons";

export function HireMeModal() {
  const { hireOpen, setHireOpen, copyEmail, scrollTo } = useApp();
  const [copied, setCopied] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!hireOpen) return;
    const prev = document.activeElement as HTMLElement | null;
    const t = setTimeout(() => closeRef.current?.focus(), 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setHireOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      setCopied(false);
      prev?.focus?.();
    };
  }, [hireOpen, setHireOpen]);

  return (
    <AnimatePresence>
      {hireOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-[#05060d]/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setHireOpen(false)}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="hire-title"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-line bg-card p-6 shadow-2xl shadow-indigo/10"
          >
            <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-indigo/25 blur-3xl" />
            <button
              ref={closeRef}
              type="button"
              onClick={() => setHireOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-md p-1.5 text-muted hover:bg-card-2 hover:text-fg"
            >
              <X className="size-4" />
            </button>
            <div className="flex items-center gap-2 font-mono text-[11px] text-emerald">
              <span className="size-2 rounded-full bg-emerald" /> available for select freelance &amp; engineering roles
            </div>
            <h2 id="hire-title" className="mt-3 text-2xl font-bold tracking-tight text-fg">
              Let&apos;s work <span className="text-brand">together</span>
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Backend APIs, data dashboards, or a motion-graphics edit. Tell me what you&apos;re building and I&apos;ll get back within a day.
            </p>

            <div className="mt-5 flex items-center gap-2 rounded-xl border border-line bg-bg/60 p-1.5 pl-4">
              <span className="min-w-0 flex-1 truncate font-mono text-sm text-fg">{SITE.email}</span>
              <button
                type="button"
                onClick={async () => {
                  await copyEmail();
                  setCopied(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-card-2 px-3 py-2 text-xs font-medium text-fg hover:bg-line"
              >
                {copied ? <Check className="size-3.5 text-emerald" /> : <Copy className="size-3.5" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <a href={`mailto:${SITE.email}`} className={btnPrimary}>
                <Mail className="size-4" /> Email me
              </a>
              <button
                type="button"
                className={btnSecondary}
                onClick={() => {
                  setHireOpen(false);
                  setTimeout(() => scrollTo("contact"), 60);
                }}
              >
                Contact <ArrowDown className="size-4" />
              </button>
            </div>
            <div className="mt-4 flex justify-center gap-4 text-sm text-muted">
              <a href={SITE.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-fg">
                <LinkedinIcon className="size-4" /> LinkedIn
              </a>
              <a href={SITE.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-fg">
                <GithubIcon className="size-4" /> GitHub
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
