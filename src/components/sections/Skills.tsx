import { Clapperboard, Compass, Cpu, Database, Globe } from "lucide-react";
import { Badge, Band, SectionHeading } from "@/components/ui/Card";
import { EXPLORING, STACK, WORKSTATION } from "@/lib/site";

const GROUP_ICONS = [Database, Globe, Clapperboard];

function IconBadge({ icon: Icon }: { icon: typeof Cpu }) {
  return (
    <span className="flex size-10 items-center justify-center rounded-xl border border-indigo/30 bg-indigo/10 text-accent">
      <Icon className="size-5" aria-hidden />
    </span>
  );
}

export function Skills() {
  return (
    <Band id="skills" labelledBy="skills-title">
      <SectionHeading
        index="02"
        eyebrow="Skills"
        title={
          <span id="skills-title">
            Stack, setup &amp; <span className="text-brand">what&apos;s next</span>
          </span>
        }
        kicker="The tools I ship with, the machine I build on, and what I'm learning right now."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {STACK.map((g, i) => (
          <div key={g.group} className="group relative overflow-hidden rounded-2xl border border-line bg-card p-6 transition hover:border-indigo/40">
            <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-brand opacity-0 transition group-hover:opacity-100" />
            <IconBadge icon={GROUP_ICONS[i] ?? Cpu} />
            <h3 className="mt-4 text-lg font-semibold text-fg">{g.group}</h3>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {g.items.map((item) => (
                <Badge key={item}>{item}</Badge>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-card p-6">
          <div className="flex items-center gap-4">
            <IconBadge icon={Cpu} />
            <div>
              <h3 className="text-lg font-semibold text-fg">Workstation</h3>
              <p className="text-sm text-muted">{WORKSTATION.machine}</p>
            </div>
          </div>
          <dl className="mt-5 divide-y divide-line rounded-xl border border-line bg-bg/50 font-mono text-xs">
            {WORKSTATION.specs.map((s) => (
              <div key={s.k} className="flex gap-4 px-4 py-2.5">
                <dt className="w-10 shrink-0 text-accent">{s.k}</dt>
                <dd className="text-muted">{s.v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            <span className="mr-1 font-mono text-[11px] text-dim">daily drivers</span>
            {WORKSTATION.tools.map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-card p-6">
          <div className="flex items-center gap-4">
            <IconBadge icon={Compass} />
            <div>
              <h3 className="text-lg font-semibold text-fg">Currently exploring</h3>
              <p className="text-sm text-muted">Late 2026</p>
            </div>
          </div>
          <ul className="mt-5 space-y-2.5">
            {EXPLORING.map((e, i) => (
              <li key={e.label} className="flex gap-4 rounded-xl border border-line bg-bg/50 px-4 py-3">
                <span className="font-mono text-xs text-accent">0{i + 1}</span>
                <div>
                  <div className="text-sm font-medium text-fg">{e.label}</div>
                  <div className="mt-0.5 text-xs text-muted">{e.detail}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Band>
  );
}
