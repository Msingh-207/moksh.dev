"use client";

import { ArrowUpRight, Mail } from "lucide-react";
import { useApp } from "@/components/providers/AppProvider";
import { btnPrimary, btnSecondary } from "@/components/ui/Card";
import { CopyEmailButton } from "@/components/ui/CopyEmailButton";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import { useModKey } from "@/components/ui/useModKey";
import { SECTIONS, SITE } from "@/lib/site";

export function Footer() {
  const { copyEmail, setPaletteOpen, scrollTo } = useApp();
  const mod = useModKey();

  return (
    <footer id="contact" className="border-t border-line bg-band">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="relative overflow-hidden rounded-3xl border border-indigo/25 bg-card p-8 sm:p-12">
          <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-violet/25 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-32 left-10 size-72 rounded-full bg-indigo/20 blur-3xl" />

          <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="flex items-center gap-3 font-mono text-xs text-accent">
                <span>05</span>
                <span className="h-px w-8 bg-brand" aria-hidden />
                <span className="uppercase tracking-[0.2em]">Contact</span>
              </div>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-fg sm:text-5xl">
                Let&apos;s build something <span className="text-brand">together.</span>
              </h2>
              <p className="mt-4 max-w-lg text-muted">
                Open to select freelance work and engineering roles: backend, data tools, or post-production. Based in
                Delhi NCR (IST).
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={`mailto:${SITE.email}`} className={btnPrimary}>
                  <Mail className="size-4" aria-hidden /> Say hello
                </a>
                <CopyEmailButton className={btnSecondary} />
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-line bg-bg/70 font-mono text-[13px] backdrop-blur">
              <div className="flex items-center gap-2 border-b border-line px-4 py-2.5 text-[11px] text-dim">
                <span className="size-2.5 rounded-full bg-rose/70" />
                <span className="size-2.5 rounded-full bg-amber/70" />
                <span className="size-2.5 rounded-full bg-emerald/70" />
                <span className="ml-2">moksh@omen: ~/contact</span>
              </div>
              <div className="space-y-2 p-5 leading-relaxed">
                <p className="text-dim">
                  <span className="text-accent">❯</span> cat contact.txt
                </p>
                <p className="flex flex-wrap gap-x-2">
                  <span className="w-16 text-dim">email</span>
                  <button type="button" onClick={() => void copyEmail()} className="break-all text-accent hover:underline" title="Click to copy">
                    {SITE.email}
                  </button>
                </p>
                <p className="flex gap-2">
                  <span className="w-16 text-dim">github</span>
                  <a href={SITE.github} target="_blank" rel="noreferrer" className="text-fg hover:underline">
                    Msingh-207 ↗
                  </a>
                </p>
                <p className="flex gap-2">
                  <span className="w-16 text-dim">linkedin</span>
                  <a href={SITE.linkedin} target="_blank" rel="noreferrer" className="text-fg hover:underline">
                    moksh-singh ↗
                  </a>
                </p>
                <p className="flex gap-2">
                  <span className="w-16 text-dim">cv</span>
                  <a href={SITE.resume} className="text-fg hover:underline">
                    resume.pdf ↓
                  </a>
                </p>
                <p className="pt-2 text-dim">
                  <span className="text-accent">❯</span>{" "}
                  <button type="button" onClick={() => setPaletteOpen(true)} className="text-muted hover:text-fg">
                    press <kbd className="rounded border border-line px-1 text-fg">{mod}K</kbd> anywhere
                  </button>
                  <span className="ml-1 inline-block h-3.5 w-2 translate-y-0.5 animate-blink bg-accent" />
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-6 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
          <div className="text-lg font-bold tracking-tight text-fg">
            Moksh<span className="text-accent">.dev</span>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(s.id);
                }}
                className="hover:text-fg"
              >
                {s.label}
              </a>
            ))}
          </nav>
          <div className="flex gap-2">
            <a href={SITE.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="rounded-lg border border-line p-2 text-muted hover:border-indigo/40 hover:text-fg">
              <GithubIcon className="size-4" />
            </a>
            <a href={SITE.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="rounded-lg border border-line p-2 text-muted hover:border-indigo/40 hover:text-fg">
              <LinkedinIcon className="size-4" />
            </a>
            <a href={SITE.resume} aria-label="CV" className="rounded-lg border border-line p-2 text-muted hover:border-indigo/40 hover:text-fg">
              <ArrowUpRight className="size-4" />
            </a>
          </div>
        </div>
        <p className="mt-6 font-mono text-[11px] text-dim">
          © 2026 Moksh Singh · Built with Next.js, TypeScript, Tailwind CSS &amp; Framer Motion · Hosted on Vercel
        </p>
      </div>
    </footer>
  );
}
