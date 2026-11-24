# moksh.dev — Bento OS portfolio

Personal portfolio for **Moksh Singh** — full-stack developer, economics undergrad and video editor.

**Stack:** Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS v4 · Framer Motion · cmdk · Lucide React

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build (type-check + prerender)
npm run lint
```

Deploy: push to GitHub and import the repo in Vercel — no configuration needed.

## Features

- **⌘K / Ctrl+K command palette** — jump to sections, filter the archive, open any case study, copy email, open résumé/socials, toggle UI sounds and motion.
- **Bento hero** — identity, live IST telemetry, discipline quick-jump, and a tabbed live-preview "showreel" (AUDash UI, DaVinci Fusion, Hyprland).
- **Archive / Vault** — Markdown-powered projects with URL-synced filters (`?track=dev|quant|video|3d|linux`) and deep-linkable case studies (`?project=audash`).
- **Interactive case studies** — macro indicator chart, root-finding visualiser, before/after colour-grade slider, Web Audio stem player, CI/CD pipeline, NLE timeline, Hyprland desktop mock.
- **Printable résumé** at `/resume`, generated from the same data.

## Adding a project

Create `content/projects/<slug>.md`:

```md
---
slug: my-project
title: My Project
subtitle: One-line descriptor
track: dev            # dev | quant | video | 3d | linux
year: "2026"
role: Solo developer
order: 9              # sort order in the archive
featured: false       # featured projects also appear on /resume
summary: One or two sentences shown on the card.
stack: [React, Flask]
metrics:
  - { label: Users, value: "500+" }
links:
  - { label: Live site, href: "https://example.com", kind: live }
  - { label: GitHub, href: "https://github.com/...", kind: repo }
embeds: []            # optional: audash | pipeline | macro-chart | root-finder | color-grade | fusion | nle-timeline | audio-lab | hyprland
# video: /media/clip.mp4   # optional, file in /public/media
# cover: /media/shot.png   # optional, file in /public/media
---

## Markdown body

Rendered in the case-study drawer.
```

That's it — the archive, filters, palette and counts pick it up automatically.

## Structure

```
content/projects/          Markdown case studies
public/media/              your own .mp4 / .png / .pdf (see README inside)
src/app/                   layout, home page, /resume
src/components/
  bento/                   hero grid cards
  archive/                 filter bar, cards, case-study drawer
  command-palette/         ⌘K palette
  interactive/             chart, sliders, players, previews
  nav/ sections/ ui/ providers/
src/lib/                   site data, tracks, content loader, URL state
```

Personal details (links, timeline, stack, workstation) live in `src/lib/site.ts`.
