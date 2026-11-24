import { BarChart3, Code2, Film } from "lucide-react";
import { TelemetryCard } from "@/components/bento/TelemetryCard";
import { Band, SectionHeading } from "@/components/ui/Card";
import { TimelineColumns } from "./Timeline";

const PILLARS = [
  {
    icon: Code2,
    title: "Engineering",
    text: "REST APIs, relational schemas, Docker and CI/CD as a Software Developer Trainee at Levithan Technologies.",
  },
  {
    icon: BarChart3,
    title: "Economics",
    text: "B.A. (Hons) Economics at AUD, with a soft spot for macro data, statistics and numerical methods.",
  },
  {
    icon: Film,
    title: "Motion",
    text: "Editing, Fusion compositing, Fairlight sound and colour grading in DaVinci Resolve.",
  },
];

export function About() {
  return (
    <Band id="about" alt labelledBy="about-title">
      <SectionHeading
        index="01"
        eyebrow="About"
        title={
          <span id="about-title">
            Engineer, economist, <span className="text-brand">editor</span>.
          </span>
        }
      />

      <div className="grid gap-4 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <p className="text-lg leading-relaxed text-muted">
            I&apos;m a second-year economics undergrad at <span className="text-fg">Dr. B. R. Ambedkar University Delhi</span>{" "}
            and a Software Developer Trainee at <span className="text-fg">Levithan Technologies</span>. I like problems
            that sit between disciplines: shipping a backend, modelling an economy, or cutting a story so it lands.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {PILLARS.map((p) => (
              <div key={p.title} className="rounded-2xl border border-line bg-card p-5">
                <span className="flex size-10 items-center justify-center rounded-xl bg-brand text-white shadow-lg shadow-indigo/25">
                  <p.icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-semibold text-fg">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
        <TelemetryCard />
      </div>

      <div className="mt-4">
        <TimelineColumns />
      </div>
    </Band>
  );
}
