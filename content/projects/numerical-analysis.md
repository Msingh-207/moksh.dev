---
slug: numerical-analysis
title: Numerical Analysis & Mathematical Models
subtitle: Root-finding and economic modelling visualiser
track: quant
year: "2026"
role: Coursework → interactive tool
order: 4
summary: A browser-based visualiser for bisection, Newton–Raphson and secant methods, applied to textbook functions and a market-clearing price problem.
stack: [TypeScript, React, SVG, Numerical Methods, Mathematical Economics]
metrics:
  - { label: Methods, value: "3" }
  - { label: Tolerance, value: "1e-6" }
  - { label: Runtime, value: In-browser }
links: []
embeds: [root-finder]
---

## From coursework to code

My **Numerical Analysis** and **Mathematical Methods for Economics** papers cover root-finding by hand. Writing the algorithms myself made the convergence behaviour click in a way the worked examples never did.

## What it shows

- **Bisection** — guaranteed but linear convergence; the bracket halves every step.
- **Newton–Raphson** — quadratic convergence near the root, but sensitive to the starting point and flat derivatives.
- **Secant** — Newton without an explicit derivative; superlinear in practice.

## The economics angle

One of the presets is an **excess-demand function** `Z(p) = D(p) − S(p)` with `D(p) = 120 / p` and `S(p) = 4p + 10`. The root is the **market-clearing price** — the same equilibrium you would solve for on paper, found numerically.

## Notes

Step through iterations one at a time and watch the table: the error column shows why Newton's method usually wins after a few steps, and why bisection never surprises you.
