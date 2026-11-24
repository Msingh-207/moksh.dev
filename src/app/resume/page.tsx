import type { Metadata } from "next";
import Link from "next/link";
import { EDUCATION, EXPERIENCE, EXPLORING, SITE, STACK } from "@/lib/site";
import { getProjects } from "@/lib/projects";
import { PrintButton } from "./PrintButton";

export const metadata: Metadata = {
  title: "Résumé",
  description: `Résumé of ${SITE.name}.`,
};

/**
 * Printable résumé generated from the same data as the portfolio.
 * Prefer a designed PDF? Drop /public/media/resume.pdf and point SITE.resume at it.
 */
export default async function ResumePage() {
  const projects = (await getProjects()).filter((p) => p.featured);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12 print:max-w-none print:bg-white print:p-0 print:text-black">
      <div className="mb-8 flex items-center justify-between print:hidden">
        <Link href="/" className="font-mono text-xs text-muted hover:text-fg">
          ← {SITE.domain}
        </Link>
        <PrintButton />
      </div>

      <header className="border-b border-line pb-6 print:border-slate-300">
        <h1 className="text-3xl font-bold tracking-tight">{SITE.name}</h1>
        <p className="mt-1 text-sm text-accent print:text-slate-700">{SITE.tagline}</p>
        <p className="mt-3 font-mono text-xs text-muted print:text-slate-600">
          {SITE.email} · {SITE.location} · github.com/Msingh-207 · linkedin.com/in/moksh-singh-2007vp7
        </p>
      </header>

      {[
        { title: "Experience", entries: EXPERIENCE },
        { title: "Education", entries: EDUCATION },
      ].map((section) => (
        <section key={section.title} className="mt-8">
          <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-dim print:text-slate-500">{section.title}</h2>
          {section.entries.map((e) => (
            <div key={e.title} className="mt-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-semibold">
                  {e.title} — <span className="font-normal text-muted print:text-slate-700">{e.org}</span>
                </h3>
                {e.period && <span className="font-mono text-xs text-muted print:text-slate-600">{e.period}</span>}
              </div>
              <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm text-muted print:text-slate-800">
                {e.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
                {e.kind === "education" && e.tags && <li>Coursework: {e.tags.join(", ")}.</li>}
              </ul>
            </div>
          ))}
        </section>
      ))}

      <section className="mt-8">
        <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-dim print:text-slate-500">Selected Projects</h2>
        {projects.map((p) => (
          <div key={p.slug} className="mt-4">
            <h3 className="font-semibold">
              {p.title} <span className="font-mono text-xs font-normal text-dim">· {p.year}</span>
            </h3>
            <p className="mt-1 text-sm text-muted print:text-slate-800">{p.summary}</p>
            <p className="mt-1 font-mono text-xs text-dim print:text-slate-600">{p.stack.join(" · ")}</p>
          </div>
        ))}
      </section>

      <section className="mt-8">
        <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-dim print:text-slate-500">Skills</h2>
        <dl className="mt-3 space-y-1.5 text-sm">
          {STACK.map((g) => (
            <div key={g.group} className="flex gap-3">
              <dt className="w-32 shrink-0 font-medium">{g.group}</dt>
              <dd className="text-muted print:text-slate-800">{g.items.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-8">
        <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-dim print:text-slate-500">Currently Exploring</h2>
        <p className="mt-2 text-sm text-muted print:text-slate-800">{EXPLORING.map((e) => e.label).join(" · ")}</p>
      </section>
    </main>
  );
}
