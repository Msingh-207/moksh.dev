import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { cacheLife } from "next/cache";
import { isTrackId } from "./tracks";
import type { EmbedId, Project, ProjectLink, ProjectMetric } from "./types";

/**
 * Projects live in /content/projects/*.md (front-matter + Markdown body).
 * To add a project, drop a new .md file there — nothing else to wire up.
 */
const CONTENT_DIR = path.join(process.cwd(), "content", "projects");

const EMBEDS: EmbedId[] = [
  "audash",
  "pipeline",
  "macro-chart",
  "root-finder",
  "color-grade",
  "fusion",
  "nle-timeline",
  "audio-lab",
  "hyprland",
];

function asString(value: unknown, fallback = ""): string {
  if (value === undefined || value === null) return fallback;
  return String(value);
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map((v) => String(v)) : [];
}

function parseProject(file: string, raw: string): Project {
  const { data, content } = matter(raw);
  const slug = asString(data.slug, file.replace(/\.mdx?$/, ""));
  const track = asString(data.track);
  if (!isTrackId(track)) {
    throw new Error(`[content] ${file}: unknown track "${track}"`);
  }

  const links: ProjectLink[] = Array.isArray(data.links)
    ? data.links
        .filter((l: unknown): l is Record<string, unknown> => !!l && typeof l === "object")
        .map((l: Record<string, unknown>) => ({
          label: asString(l.label),
          href: asString(l.href),
          kind: (l.kind as ProjectLink["kind"]) ?? undefined,
        }))
        .filter((l: ProjectLink) => l.href)
    : [];

  const metrics: ProjectMetric[] = Array.isArray(data.metrics)
    ? data.metrics.map((m: Record<string, unknown>) => ({
        label: asString(m.label),
        value: asString(m.value),
      }))
    : [];

  const embeds = asStringArray(data.embeds).filter((e): e is EmbedId =>
    (EMBEDS as string[]).includes(e),
  );

  return {
    slug,
    title: asString(data.title, slug),
    subtitle: data.subtitle ? asString(data.subtitle) : undefined,
    track,
    year: asString(data.year),
    role: data.role ? asString(data.role) : undefined,
    order: Number(data.order ?? 999),
    featured: Boolean(data.featured),
    summary: asString(data.summary),
    stack: asStringArray(data.stack),
    metrics,
    links,
    embeds,
    video: data.video ? asString(data.video) : undefined,
    cover: data.cover ? asString(data.cover) : undefined,
    body: content.trim(),
  };
}

export async function getProjects(): Promise<Project[]> {
  "use cache";
  cacheLife("max");

  const files = (await fs.readdir(CONTENT_DIR)).filter((f) => /\.mdx?$/.test(f));
  const projects = await Promise.all(
    files.map(async (file) => parseProject(file, await fs.readFile(path.join(CONTENT_DIR, file), "utf8"))),
  );
  return projects.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}
