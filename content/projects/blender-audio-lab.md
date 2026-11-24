---
slug: blender-audio-lab
title: Blender 3D & FL Studio Audio Lab
subtitle: Turntable renders + instrumental stems
track: 3d
year: "2026"
role: 3D artist · Producer
order: 7
summary: Lighting and turntable studies in Blender, paired with a custom Web Audio waveform player for instrumental arrangements and sound-design stems from FL Studio.
stack: [Blender, Cycles, EEVEE, FL Studio, Web Audio API, Canvas]
metrics:
  - { label: 3D, value: Blender }
  - { label: DAW, value: FL Studio }
  - { label: Player, value: Web Audio }
links: []
embeds: [audio-lab]
---

## Blender

Turntable studies are about **lighting**, not modelling: a three-point setup (key, fill, rim), an HDRI for reflections, and a slow 360° rotation so the form reads from every angle. Renders in **Cycles** for finals and **EEVEE** for quick look-dev.

## FL Studio

Instrumental arrangements are built as separate **stems** — drums, bass, keys — so each can be mixed (or muted) independently. The player above is a custom **Web Audio API** component: it synthesises a short loop in the browser, draws the waveform on a `<canvas>`, and lets you solo stems.

> To use real exports, drop `.mp3`/`.wav` stems into `/public/media/audio/` — see the README in `/public/media/`.

## What I'm practising

Animation curves in Blender's Graph Editor, and sidechain / bus processing in FL Studio's mixer.
