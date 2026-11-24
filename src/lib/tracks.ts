import type { TrackFilter, TrackId } from "./types";

export interface TrackMeta {
  id: TrackId;
  label: string;
  short: string;
  /** Tailwind text colour class for the track accent. */
  accent: string;
  /** Hex used in SVG thumbnails. */
  hex: string;
}

export const TRACKS: TrackMeta[] = [
  { id: "dev", label: "Software & Web", short: "DEV", accent: "text-accent", hex: "#818CF8" },
  { id: "quant", label: "Quant & Econ", short: "QNT", accent: "text-emerald", hex: "#34D399" },
  { id: "video", label: "Video & Motion", short: "VID", accent: "text-amber", hex: "#FBBF24" },
  { id: "3d", label: "3D & Audio", short: "3DA", accent: "text-fuchsia", hex: "#E879F9" },
  { id: "linux", label: "Systems / Linux", short: "SYS", accent: "text-sky", hex: "#38BDF8" },
];

export const FILTERS: { id: TrackFilter; label: string }[] = [
  { id: "all", label: "All" },
  ...TRACKS.map((t) => ({ id: t.id, label: t.label })),
];

const TRACK_IDS = new Set<string>(TRACKS.map((t) => t.id));

export function isTrackId(value: string | null | undefined): value is TrackId {
  return !!value && TRACK_IDS.has(value);
}

export function getTrack(id: TrackId): TrackMeta {
  return TRACKS.find((t) => t.id === id) ?? TRACKS[0];
}
