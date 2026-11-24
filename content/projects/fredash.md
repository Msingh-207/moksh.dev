---
slug: fredash
title: FREDash — Macroeconomic Data Dashboard
subtitle: Cross-country indicators from the FRED API
track: quant
year: "2026"
role: Data + full-stack
order: 3
featured: true
summary: An interactive dashboard that pulls macro indicators from the FRED API and lets you compare inflation, growth and unemployment across countries.
stack: [Python, Pandas, NumPy, Matplotlib, Flask, React, FRED API]
metrics:
  - { label: Source, value: FRED API }
  - { label: Indicators, value: CPI · GDP · UNRATE }
  - { label: Countries, value: "4+" }
links: []
embeds: [macro-chart]
---

## Why

Macroeconomics coursework is full of claims like *"inflation surged everywhere after 2021"*. I wanted a tool that lets me check those claims against real series in a few clicks.

## Pipeline

1. **Fetch** — a Python client calls the St. Louis Fed **FRED API** for each series (e.g. CPI, real GDP growth, unemployment rate) and caches the responses.
2. **Clean** — **Pandas** aligns frequencies (monthly → annual averages), handles missing observations and rebases indices.
3. **Analyse** — **NumPy** for growth rates, rolling means and simple correlations between indicators.
4. **Serve** — a **Flask** API exposes tidy JSON per country/indicator.
5. **Visualise** — a **React** front end renders interactive charts; **Matplotlib** produces static exports for reports.

## Try it

The chart above is a lightweight, dependency-free version of the dashboard's main view. Toggle countries and switch indicators; hover for exact values.

> The embedded figures are an illustrative annual sample for demonstration. The full app pulls live series from FRED.

## Next

Add a Phillips-curve scatter view, a policy-rate overlay, and an India-focused panel using RBI DBIE data.
