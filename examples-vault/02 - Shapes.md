# 02 — Shapes, sizes, gaps

`shape` changes the tile glyph. `daySize` and `gap` change how the row reads.
Each block targets roughly the same total width (~550px) — `daysPerRow` and
the date range are tuned to compensate for the larger tile sizes, so you can
compare shapes side-by-side without one example dwarfing the next.

## Rect — square tiles, small and tight

```daytiles
layout: custom
daysPerRow: 39
startDate: 2026-04-22
endDate: 2026-05-30
shape: rect
daySize: 12
gap: 2
colors:
  dayColor: "#cbd5e1"
  current: "#0f766e"
  eventTypeColors:
    work: "#0f766e"
events:
  - { start: 2026-04-29, type: work, note: Kickoff }
  - { start: 2026-05-06, type: work, note: Standup }
  - { start: 2026-05-20, type: work, note: Review }
```

## Rounded — softened corners, medium size

```daytiles
layout: custom
daysPerRow: 23
startDate: 2026-04-30
endDate: 2026-05-22
shape: rounded
daySize: 20
gap: 4
colors:
  dayColor: "#e7e5e4"
  current: "#881337"
  eventTypeColors:
    holiday: "#881337"
events:
  - { start: 2026-05-09, type: holiday, note: Saturday off }
  - { start: 2026-05-10, type: holiday, note: Sunday off }
  - { start: 2026-05-16, type: holiday, note: Saturday off }
```

## Circle — round tiles, large with generous gaps

```daytiles
layout: custom
daysPerRow: 10
startDate: 2026-05-06
endDate: 2026-05-15
shape: circle
daySize: 50
gap: 8
colors:
  dayColor: "#d1fae5"
  current: "#16a34a"
  eventTypeColors:
    deploy: "#14532d"
events:
  - { start: 2026-05-11, type: deploy, note: Today deploy }
```

## Diamond — rotated squares with wide gaps

```daytiles
layout: custom
daysPerRow: 17
startDate: 2026-05-03
endDate: 2026-05-19
shape: diamond
daySize: 22
gap: 10
colors:
  dayColor: "#ddd6fe"
  current: "#a855f7"
  eventTypeColors:
    spec: "#6d28d9"
    sync: "#5b21b6"
events:
  - { start: 2026-05-07, type: spec, note: RFC }
  - { start: 2026-05-14, type: sync, note: Team sync }
```

## Rect dense — one year in one block

```daytiles
layout: custom
daysPerRow: 69
startDate: 2026-01-01
endDate: 2026-12-31
shape: rect
daySize: 8
gap: 0
colors:
  dayColor: "#e7e5e4"
  alternation: { mode: month, color: "#a8a29e" }
  eventTypeColors:
    work:    "#0f766e"
    holiday: "#881337"
events:
  - { start: 2026-02-14, type: holiday, note: Valentine }
  - { start: 2026-04-13, end: 2026-04-17, type: work, note: Sprint }
  - { start: 2026-07-04, type: holiday, note: Independence Day }
  - { start: 2026-12-25, type: holiday, note: Christmas }
```

## Try it

Push `daySize` up to `80` on the circle block, or drop `gap` to `0` on the
rect block — the same shape reads completely differently.
