import { Briefcase, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/Card";
import { EDUCATION, EXPERIENCE, type TimelineEntry } from "@/lib/site";

function Column({ title, icon, entries }: { title: string; icon: React.ReactNode; entries: TimelineEntry[] }) {
  return (
    <div className="rounded-2xl border border-line bg-card p-6">
      <div className="mb-6 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-dim">
        {icon}
        {title}
      </div>
      <ol className="relative space-y-8 border-l border-line pl-6">
        {entries.map((e) => (
          <li key={e.title + e.org} className="relative">
            <span className="absolute -left-[29px] top-1.5 size-2.5 rounded-full border-2 border-bg bg-brand ring-2 ring-indigo/30" aria-hidden />
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="text-base font-semibold text-fg">{e.title}</h3>
              {e.period && <span className="font-mono text-[11px] text-accent">{e.period}</span>}
            </div>
            <p className="mt-0.5 text-sm italic text-muted">{e.org}</p>
            <ul className="mt-3 space-y-1.5">
              {e.points.map((p) => (
                <li key={p} className="flex gap-2 text-sm leading-relaxed text-muted">
                  <span className="mt-2 size-1 shrink-0 rounded-full bg-dim" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
            {e.tags && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {e.tags.map((t) => (
                  <Badge key={t}>{t}</Badge>
                ))}
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function TimelineColumns() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Column title="work" icon={<Briefcase className="size-3.5" aria-hidden />} entries={EXPERIENCE} />
      <Column title="education" icon={<GraduationCap className="size-3.5" aria-hidden />} entries={EDUCATION} />
    </div>
  );
}
