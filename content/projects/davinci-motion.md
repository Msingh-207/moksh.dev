---
slug: davinci-motion
title: DaVinci Resolve Motion Graphics & Kinetic Typography
subtitle: Fusion compositing · Fairlight sound design · Colour
track: video
year: "2025–26"
role: Editor · Motion designer · Colourist
order: 5
featured: true
summary: Post-production showcase built in DaVinci Resolve — node-based Fusion compositing, kinetic typography, Fairlight sound design and a log-to-final colour grade.
stack: [DaVinci Resolve, Fusion, Fairlight, Color Page, Photoshop]
metrics:
  - { label: NLE, value: DaVinci Resolve }
  - { label: Pipeline, value: Log → Rec.709 }
  - { label: Pages, value: Edit · Fusion · Color · Fairlight }
links: []
embeds: [color-grade, fusion]
---

## Kinetic typography in Fusion

Type animation is built node-by-node in **Fusion**: `Text+` layers driven by follower modifiers, merged over footage, with motion blur and glow passes stacked on top. Keeping it in nodes rather than layers makes every look re-usable as a macro.

## Colour

Footage is shot flat (log), so the grade starts with a **Color Space Transform** to Rec.709, then primaries for balance, and secondaries for skin and sky. Drag the slider above to compare a raw log frame with the final grade.

> Drop your own frames into `/public/media/` (see the README there) to replace the procedurally rendered comparison scene.

## Fairlight sound design

Whooshes, risers and impacts are cut to the type animation on the **Fairlight** page, with bus compression and a limiter on the master so the edit lands consistently on phone speakers.

## Workflow

Edit page for structure → Fusion for motion → Color for look → Fairlight for sound → Deliver with platform-specific presets.
