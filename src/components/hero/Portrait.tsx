"use client";

import { useState } from "react";

/**
 * Portrait inside the hero orb.
 * Drop a square image at /public/media/portrait.png and it is picked up automatically
 * (the page checks for the file at build time). Until then — or if the image fails
 * to load — a stylised developer avatar is shown, so it never looks broken.
 */
export function Portrait({ src }: { src: string | null }) {
  const [failed, setFailed] = useState(false);

  if (src && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt="Portrait of Moksh Singh"
        className="size-full object-cover"
        onError={() => setFailed(true)}
        draggable={false}
      />
    );
  }
  return <AvatarFallback />;
}

function AvatarFallback() {
  return (
    <svg viewBox="0 0 320 320" className="size-full" role="img" aria-label="Stylised developer avatar">
      <defs>
        <radialGradient id="av-bg" cx="50%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#2a2f6b" />
          <stop offset="60%" stopColor="#151937" />
          <stop offset="100%" stopColor="#0b0d17" />
        </radialGradient>
        <linearGradient id="av-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="av-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c7d2fe" />
          <stop offset="100%" stopColor="#a5b4fc" />
        </linearGradient>
        <linearGradient id="av-screen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#818cf8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="320" height="320" fill="url(#av-bg)" />
      {/* faint code lines in the background */}
      <g stroke="#818cf8" strokeOpacity="0.18" strokeWidth="4" strokeLinecap="round">
        <path d="M40 70h60M110 70h40M40 88h90M60 106h70M40 124h40" />
        <path d="M200 60h70M210 78h50M200 96h80" />
      </g>
      {/* shoulders / hoodie */}
      <path d="M58 320c4-62 46-104 102-104s98 42 102 104z" fill="url(#av-body)" />
      <path d="M128 222c8 20 20 30 32 30s24-10 32-30" fill="none" stroke="#c4b5fd" strokeOpacity="0.5" strokeWidth="4" strokeLinecap="round" />
      {/* neck + head */}
      <rect x="142" y="186" width="36" height="34" rx="14" fill="#a5b4fc" />
      <circle cx="160" cy="150" r="50" fill="url(#av-skin)" />
      {/* hair */}
      <path d="M110 146c-4-38 22-62 52-62 32 0 56 22 50 58-10-20-30-30-52-30-20 0-38 12-50 34z" fill="#1e1b4b" />
      {/* glasses */}
      <g fill="none" stroke="#1e1b4b" strokeWidth="5">
        <rect x="124" y="142" width="30" height="22" rx="8" />
        <rect x="166" y="142" width="30" height="22" rx="8" />
        <path d="M154 152h12" />
      </g>
      <path d="M146 176q14 10 28 0" fill="none" stroke="#1e1b4b" strokeWidth="4" strokeLinecap="round" />
      {/* headphones */}
      <path d="M106 160a54 54 0 0 1 108 0" fill="none" stroke="#312e81" strokeWidth="9" strokeLinecap="round" />
      <rect x="98" y="150" width="16" height="32" rx="7" fill="#4f46e5" />
      <rect x="206" y="150" width="16" height="32" rx="7" fill="#4f46e5" />
      {/* laptop glow */}
      <path d="M70 320l26-46h128l26 46z" fill="#0b0d17" stroke="#818cf8" strokeOpacity="0.6" strokeWidth="2" />
      <ellipse cx="160" cy="276" rx="90" ry="18" fill="url(#av-screen)" opacity="0.35" />
      <circle cx="160" cy="298" r="4" fill="#a5b4fc" />
    </svg>
  );
}
