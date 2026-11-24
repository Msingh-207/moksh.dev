---
slug: hyprland-rice
title: EndeavourOS + Hyprland Wayland Rice
subtitle: Arch-based desktop, tuned to the last pixel
track: linux
year: "2026"
role: Tinkerer
order: 8
featured: true
summary: A Wayland desktop on EndeavourOS with Hyprland, Waybar, Rofi and Kitty, a Cyberpunk 2077 GRUB theme, and local quantised LLM / PyTorch experiments on an RTX 5060.
stack: [EndeavourOS, Arch Linux, Wayland, Hyprland, Lua, Waybar, Rofi, Kitty, GRUB, PyTorch, CUDA]
metrics:
  - { label: Compositor, value: Hyprland }
  - { label: GPU, value: RTX 5060 8GB }
  - { label: Boot, value: Dual-boot }
links:
  - { label: GitHub, href: "https://github.com/Msingh-207", kind: repo }
embeds: [hyprland]
---

## The setup

**EndeavourOS** (Arch Linux) dual-booted alongside Windows 11 on an HP OMEN 15, running the **Hyprland** Wayland compositor.

- **Hyprland** — dynamic tiling, animations and window rules, scripted with **Lua** helpers for workspace and monitor logic.
- **Waybar** — custom modules for workspaces, CPU/GPU temperature, network and media.
- **Rofi** — app launcher, power menu and clipboard picker, themed to match.
- **Kitty** — GPU-accelerated terminal with a matching colour scheme.
- **GRUB** — a custom **Cyberpunk 2077** boot theme, because the first thing you see should look good too.

## Local AI experiments

The **RTX 5060 (8 GB)** runs quantised LLMs locally (4-/5-bit GGUF models) and small **PyTorch** experiments with CUDA — enough to learn how inference, VRAM limits and quantisation trade-offs actually feel.

```bash
$ nvidia-smi --query-gpu=name,memory.used,memory.total --format=csv
name, memory.used [MiB], memory.total [MiB]
NVIDIA GeForce RTX 5060 Laptop GPU, 5120 MiB, 8188 MiB
```

## Lessons

Read the Arch Wiki first. Keep dotfiles in Git. Snapshot before you update the kernel.
