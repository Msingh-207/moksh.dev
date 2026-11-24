export type TrackId = "dev" | "quant" | "video" | "3d" | "linux";
export type TrackFilter = TrackId | "all";

export type EmbedId =
  | "audash"
  | "pipeline"
  | "macro-chart"
  | "root-finder"
  | "color-grade"
  | "fusion"
  | "nle-timeline"
  | "audio-lab"
  | "hyprland";

export interface ProjectLink {
  label: string;
  href: string;
  kind?: "live" | "repo" | "doc" | "video";
}

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface Project {
  slug: string;
  title: string;
  subtitle?: string;
  track: TrackId;
  year: string;
  role?: string;
  order: number;
  featured: boolean;
  summary: string;
  stack: string[];
  metrics: ProjectMetric[];
  links: ProjectLink[];
  embeds: EmbedId[];
  /** Optional local media, e.g. "/media/naqsh-reel.mp4". Rendered only when set. */
  video?: string;
  /** Optional local cover image, e.g. "/media/audash.png". Rendered only when set. */
  cover?: string;
  /** Markdown body of the case study. */
  body: string;
}
