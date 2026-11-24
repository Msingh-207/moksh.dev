"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Atom, Box, Clapperboard, Container, Database } from "lucide-react";
import type { ReactNode } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { btnPrimary, btnSecondary } from "@/components/ui/Card";
import { SITE } from "@/lib/site";
import { Portrait } from "./Portrait";

const Mono = ({ children }: { children: string }) => (
  <span className="font-mono text-[10px] font-bold leading-none">{children}</span>
);

const TECH: { name: string; color: string; icon: ReactNode }[] = [
  { name: "Python", color: "#3776AB", icon: <Mono>Py</Mono> },
  { name: "React", color: "#61DAFB", icon: <Atom className="size-3.5" /> },
  { name: "TypeScript", color: "#3178C6", icon: <Mono>TS</Mono> },
  { name: "PostgreSQL", color: "#4169E1", icon: <Database className="size-3.5" /> },
  { name: "Docker", color: "#2496ED", icon: <Container className="size-3.5" /> },
  { name: "DaVinci Resolve", color: "#FF8A3D", icon: <Clapperboard className="size-3.5" /> },
  { name: "Blender", color: "#F5792A", icon: <Box className="size-3.5" /> },
];

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export function Hero({ portrait }: { portrait: string | null }) {
  const { scrollTo } = useApp();

  return (
    <section id="top" aria-label="Introduction" className="relative overflow-hidden">
      {/* ambient glow */}
      <div aria-hidden className="pointer-events-none absolute -left-40 top-10 size-[480px] rounded-full bg-indigo/10 blur-[120px]" />

      <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 pb-20 pt-12 sm:px-6 sm:pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 lg:pb-28 lg:pt-20">
        {/* Left column */}
        <div>
          <motion.div
            {...fade(0)}
            className="inline-flex items-center gap-2 rounded-full border border-indigo/30 bg-indigo/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent"
          >
            <span className="size-1.5 rounded-full bg-accent" aria-hidden />
            Full-Stack Developer • Economics • Video Editor
          </motion.div>

          <motion.h1 {...fade(0.08)} className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight text-fg sm:text-6xl lg:text-[4.25rem]">
            Hi, I&apos;m <span className="text-brand">Moksh</span>
            <span className="mt-2 block text-[0.62em] font-bold leading-[1.15] text-fg/90">
              I build products &amp; craft visuals.
            </span>
          </motion.h1>

          <motion.p {...fade(0.16)} className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Full-stack web apps and backend systems at Levithan Technologies, quantitative economics at Ambedkar
            University Delhi, and motion graphics &amp; colour in DaVinci Resolve.
          </motion.p>

          <motion.div {...fade(0.24)} className="mt-8 flex flex-wrap gap-3">
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("projects");
              }}
              className={btnPrimary}
            >
              View My Work <ArrowUpRight className="size-4" aria-hidden />
            </a>
            <a href={SITE.resume} className={btnSecondary}>
              Download CV <ArrowDown className="size-4" aria-hidden />
            </a>
          </motion.div>

          <motion.div {...fade(0.32)} className="mt-12">
            <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-dim">Technologies I work with</div>
            <ul className="flex flex-wrap gap-2">
              {TECH.map((t) => (
                <li
                  key={t.name}
                  className="group inline-flex items-center gap-2 rounded-lg border border-line bg-card/70 py-1.5 pl-1.5 pr-3 text-xs font-medium text-muted transition hover:border-line-strong hover:text-fg"
                >
                  <span
                    className="flex size-6 items-center justify-center rounded-md"
                    style={{ background: `${t.color}1f`, color: t.color, boxShadow: `inset 0 0 0 1px ${t.color}40` }}
                    aria-hidden
                  >
                    {t.icon}
                  </span>
                  {t.name}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Right column: orb + portrait + floating cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto flex aspect-square w-full max-w-[460px] items-center justify-center"
        >
          <div aria-hidden className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_45%,rgba(124,58,237,0.55),rgba(99,102,241,0.25)_40%,transparent_70%)] blur-2xl" />
          <div aria-hidden className="absolute inset-[6%] rounded-full border border-indigo/20" />
          <div aria-hidden className="absolute inset-[-2%] animate-[spin_40s_linear_infinite] rounded-full border border-dashed border-violet/20" />
          <div className="relative size-[72%] overflow-hidden rounded-full border border-indigo/40 bg-card shadow-[0_0_80px_-10px] shadow-indigo/60 ring-8 ring-indigo/5">
            <Portrait src={portrait} />
          </div>

          {/* floating availability chip */}
          <div className="animate-float absolute left-0 top-[12%] flex items-center gap-2 rounded-xl border border-line bg-card/70 px-3 py-2 text-xs text-fg shadow-xl backdrop-blur-md sm:left-[-4%]">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-pulse-dot rounded-full bg-emerald/60" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald" />
            </span>
            Open to work
          </div>

          {/* floating glass code card */}
          <div
            className="animate-float absolute -bottom-2 right-0 w-[min(88%,300px)] rounded-2xl border border-white/10 bg-[#111424]/70 shadow-2xl shadow-black/50 backdrop-blur-xl sm:right-[-6%]"
            style={{ animationDelay: "-3s" }}
          >
            <div className="flex items-center gap-2 border-b border-white/5 px-4 py-2.5">
              <span className="font-mono text-xs font-semibold text-accent">&lt;/&gt;</span>
              <span className="font-mono text-[11px] text-muted">Code</span>
              <span className="ml-auto flex gap-1.5" aria-hidden>
                <span className="size-2 rounded-full bg-rose/70" />
                <span className="size-2 rounded-full bg-amber/70" />
                <span className="size-2 rounded-full bg-emerald/70" />
              </span>
            </div>
            <pre className="overflow-x-auto px-4 py-3 font-mono text-[11.5px] leading-relaxed text-slate-300">
              <span className="text-violet">const</span> <span className="text-sky">moksh</span> = {"{"}
              {"\n  "}role: <span className="text-emerald">&quot;Full-Stack &amp; Motion&quot;</span>,
              {"\n  "}stack: [<span className="text-emerald">&quot;Python&quot;</span>, <span className="text-emerald">&quot;React&quot;</span>,
              {"\n          "}<span className="text-emerald">&quot;SQL&quot;</span>, <span className="text-emerald">&quot;DaVinci&quot;</span>],
              {"\n  "}focus: <span className="text-emerald">&quot;Building systems &amp; stories&quot;</span>
              {"\n"}{"}"};
            </pre>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
