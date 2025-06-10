# 01 — Layouts

`layout` controls how days are arranged into rows. Four options. Each block
uses a single hue family — base, alternation, current-day, and events all
sit on the same color ramp so nothing fights.

Date ranges are anchored on **today (2026-05-11)**.

## Month — one row per calendar month

```daytiles
layout: month
startDate: 2026-04-01
endDate: 2026-06-30
showLabels: true
colors:
  dayColor: "#dbeafe"
  current: "#0284c7"
  alternation: { mode: month, color: "#93c5fd" }
  eventTypeColors:
    work:   "#1d4ed8"
    launch: "#1e3a8a"
events:
  - { start: 2026-04-13, type: work,   note: Kickoff }
  - { start: 2026-05-04, end: 2026-05-08, type: work, note: Sprint }
  - { start: 2026-06-02, type: launch, note: Beta }
```

## Week — one row per ISO week

```daytiles
layout: week
startDate: 2026-04-13
endDate: 2026-06-07
showLabels: true
colors:
  dayColor: "#fed7aa"
  current: "#ea580c"
  eventTypeColors:
    review:  "#9a3412"
    holiday: "#7c2d12"
events:
  - { start: 2026-04-20, end: 2026-04-24, type: review, note: Design review }
  - { start: 2026-05-25, type: holiday, note: Memorial Day }
```

## Weekday — columns aligned by weekday

```daytiles
layout: weekday
startDate: 2026-01-01
endDate: 2026-12-31
colors:
  dayColor: "#d1fae5"
  current: "#16a34a"
  alternation: { mode: month, color: "#6ee7b7" }
  eventTypeColors:
    travel: "#047857"
    deploy: "#064e3b"
events:
  - { start: 2026-02-15, type: deploy, note: v1 cut }
  - { start: 2026-05-04, end: 2026-05-11, type: travel, note: Conference }
  - { start: 2026-07-08, type: deploy, note: v2 cut }
```

## Custom — fixed days per row

```daytiles
layout: custom
daysPerRow: 21
startDate: 2026-04-01
endDate: 2026-06-30
colors:
  dayColor: "#ddd6fe"
  current: "#a855f7"
  alternation: { mode: custom, size: 21, color: "#a78bfa" }
  eventTypeColors:
    spec: "#6d28d9"
    sync: "#4c1d95"
events:
  - { start: 2026-04-08, type: spec, note: RFC draft }
  - { start: 2026-05-04, end: 2026-05-08, type: sync, note: Team week }
  - { start: 2026-06-15, type: spec, note: RFC v2 }
```

## Try it

Change `daysPerRow` in the last block to `7`, `14`, or `45` and watch the
shape morph. Custom is the only layout where `daysPerRow` is honored.
