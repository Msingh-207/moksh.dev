---
slug: audash
title: AUDash
subtitle: Student timetable web app for Dr. B. R. Ambedkar University Delhi
track: dev
year: "2025"
role: Solo full-stack developer
order: 1
featured: true
summary: A full-stack timetable dashboard that turns AUD's scattered course schedules into a fast, filterable weekly view for students.
stack: [Python, Flask, React.js, HTML5, CSS3, Vercel]
metrics:
  - { label: Stack, value: Flask + React }
  - { label: Deploy, value: Vercel }
  - { label: Status, value: Live }
links:
  - { label: Live site, href: "https://audash.vercel.app", kind: live }
  - { label: GitHub repo, href: "https://github.com/Msingh-207/AUDash", kind: repo }
embeds: [audash]
---

## The problem

Timetables at AUD live across PDFs, notice boards and group chats. Students end up rebuilding their week by hand every semester, and clashes between electives are easy to miss.

## What I built

**AUDash** is a small full-stack app that parses course schedule data and renders it as a clean weekly grid you can filter by programme, semester and elective.

- **Backend:** a Python **Flask** API normalises raw schedule rows (course code, slot, room, faculty) into a consistent JSON shape.
- **Frontend:** a **React.js** client renders the week view, highlights clashes, and remembers your selected electives.
- **Styling:** hand-written **HTML5 / CSS3** with a mobile-first layout, since most students check it on their phone between classes.
- **Deployment:** shipped on **Vercel** so updates go live as soon as they are pushed.

## Architecture notes

```text
schedule source  ──►  Flask parser / API  ──►  JSON  ──►  React week grid
                          │                                   │
                          └── validation + clash detection ◄──┘
```

## What I'd do next

Add per-student calendar export (`.ics`), a room-finder view, and an admin upload flow so department coordinators can publish changes themselves.
