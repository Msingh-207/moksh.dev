import type { TrackId } from "@/lib/types";

/** Small generative SVG thumbnail per track — no image files required. */
export function TrackGlyph({ track, hex }: { track: TrackId; hex: string }) {
  const common = { stroke: hex, fill: "none", strokeWidth: 1.5 } as const;
  return (
    <svg viewBox="0 0 120 64" className="h-full w-full" aria-hidden>
      {track === "dev" && (
        <g {...common}>
          <rect x="8" y="10" width="44" height="44" rx="6" opacity="0.5" />
          <path d="M22 26l-6 6 6 6M38 26l6 6-6 6M33 22l-6 20" />
          <path d="M60 18h48M60 28h36M60 38h44M60 48h28" opacity="0.4" />
        </g>
      )}
      {track === "quant" && (
        <g {...common}>
          <path d="M6 56h108M6 56V8" opacity="0.4" />
          <path d="M8 46 C 26 40, 34 18, 52 24 S 78 50, 92 26 S 108 14, 114 12" />
          <path d="M8 52 L 30 44 L 52 46 L 74 34 L 96 38 L 114 28" opacity="0.45" strokeDasharray="3 3" />
        </g>
      )}
      {track === "video" && (
        <g {...common}>
          <rect x="6" y="12" width="40" height="10" rx="2" />
          <rect x="48" y="12" width="26" height="10" rx="2" opacity="0.6" />
          <rect x="76" y="12" width="38" height="10" rx="2" />
          <rect x="18" y="28" width="56" height="10" rx="2" opacity="0.5" />
          <path d="M6 48 q 6 -8 12 0 t 12 0 t 12 0 t 12 0 t 12 0 t 12 0 t 12 0 t 12 0 t 12 0" opacity="0.6" />
          <path d="M62 6v54" stroke="#fb7185" />
        </g>
      )}
      {track === "3d" && (
        <g {...common}>
          <path d="M30 14 L52 26 L52 50 L30 62 L8 50 L8 26 Z" opacity="0.8" />
          <path d="M8 26 L30 38 L52 26 M30 38 V62" opacity="0.5" />
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i) => {
            const h = 6 + Math.abs(Math.sin(i * 1.7)) * 30;
            return <path key={i} d={`M${64 + i * 3.2} ${32 - h / 2}v${h}`} />;
          })}
        </g>
      )}
      {track === "linux" && (
        <g {...common}>
          <rect x="6" y="8" width="62" height="48" rx="4" opacity="0.6" />
          <rect x="72" y="8" width="42" height="22" rx="4" opacity="0.6" />
          <rect x="72" y="34" width="42" height="22" rx="4" opacity="0.6" />
          <path d="M14 22l6 5-6 5M24 34h14" />
        </g>
      )}
    </svg>
  );
}
