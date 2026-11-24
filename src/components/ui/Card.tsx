import type { HTMLAttributes, ReactNode } from "react";

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/** The base bento surface. */
export function Card({ className, children, ...rest }: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-line bg-card",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-dim", className)}>
      {children}
    </div>
  );
}

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-line bg-card-2 px-2 py-0.5 font-mono text-[11px] text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  kicker,
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  kicker?: string;
}) {
  return (
    <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <div className="flex items-center gap-3 font-mono text-xs text-accent">
          <span>{index}</span>
          <span className="h-px w-8 bg-brand" aria-hidden />
          <span className="uppercase tracking-[0.2em]">{eyebrow}</span>
        </div>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-fg sm:text-4xl">{title}</h2>
      </div>
      {kicker && <p className="max-w-md text-sm leading-relaxed text-muted md:text-right">{kicker}</p>}
    </div>
  );
}

/** Full-width section band; `alt` switches to the slightly lighter navy band colour. */
export function Band({
  id,
  alt = false,
  children,
  className,
  labelledBy,
}: {
  id: string;
  alt?: boolean;
  children: ReactNode;
  className?: string;
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn("py-20 sm:py-24", alt && "border-y border-line bg-band", className)}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">{children}</div>
    </section>
  );
}

export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo/25 transition hover:shadow-indigo/40 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export const btnSecondary =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-line-strong bg-card/60 px-5 py-3 text-sm font-semibold text-fg transition hover:border-accent/60 hover:bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
