
## What a Daytiles block looks like

Every block is a fenced ```` ```daytiles ```` code block whose body is YAML.
The plugin parses the YAML, builds a calendar, and replaces the block with
the rendered SVG.

```daytiles
layout: weekday
startDate: 2024-12-10
endDate: 2025-12-09
shape: rounded
colors:
  alternation: { mode: month, color: "#cfe3f3" }
  highlight:
    weekdays: { 0: "#d4f5d4", 6: "#d4f5d4" }
  eventTypeColors:
    work:    "#0f766e"
    holiday: "#881337"
    travel:  "#4c1d95"
events:
  - { start: 2025-01-23, type: holiday, note: Valentine }
  - { start: 2025-03-22, end: 2025-03-26, type: work, note: Sprint }
  - { start: 2025-04-19, type: work, note: Today }
  - { start: 2025-06-12, type: holiday, note: Independence Day }
  - { start: 2025-07-19, end: 2025-07-30, type: travel, note: Summer trip }
  - { start: 2025-12-03, type: holiday, note: Christmas }
```

A year of weekday tiles with weekend highlights and a handful of events.
Defaults everywhere else.

## Where to tweak global defaults

Open *Settings → Community plugins → Daytiles*. Defaults set there apply to
every block; per-block options shallow-merge over them. The block frame
(background, label text color) lives there too.

---

# Layouts

`layout` controls how days are arranged into rows. Four options. Each block
uses a single hue family — base, alternation, current-day, and events all
sit on the same color ramp so nothing fights.

## Month — one row per calendar month

```daytiles
layout: month
startDate: 2025-03-10
endDate: 2025-06-08
showLabels: true
colors:
  dayColor: "#dbeafe"
  current: "#0284c7"
  alternation: { mode: month, color: "#93c5fd" }
  eventTypeColors:
    work:   "#1d4ed8"
    launch: "#1e3a8a"
events:
  - { start: 2025-03-22, type: work,   note: Kickoff }
  - { start: 2025-04-12, end: 2025-04-16, type: work, note: Sprint }
  - { start: 2025-05-11, type: launch, note: Beta }
```

## Week — one row per ISO week

```daytiles
layout: week
startDate: 2025-03-22
endDate: 2025-05-16
showLabels: true
colors:
  dayColor: "#fed7aa"
  current: "#ea580c"
  eventTypeColors:
    review:  "#9a3412"
    holiday: "#7c2d12"
events:
  - { start: 2025-03-29, end: 2025-04-02, type: review, note: Design review }
  - { start: 2025-05-03, type: holiday, note: Memorial Day }
```

## Weekday — columns aligned by weekday

```daytiles
layout: weekday
startDate: 2024-12-10
endDate: 2025-12-09
colors:
  dayColor: "#d1fae5"
  current: "#16a34a"
  alternation: { mode: month, color: "#6ee7b7" }
  eventTypeColors:
    travel: "#047857"
    deploy: "#064e3b"
events:
  - { start: 2025-01-24, type: deploy, note: v1 cut }
  - { start: 2025-04-12, end: 2025-04-19, type: travel, note: Conference }
  - { start: 2025-06-16, type: deploy, note: v2 cut }
```

## Custom — fixed days per row

```daytiles
layout: custom
daysPerRow: 21
startDate: 2025-03-10
endDate: 2025-06-08
colors:
  dayColor: "#ddd6fe"
  current: "#a855f7"
  alternation: { mode: custom, size: 21, color: "#a78bfa" }
  eventTypeColors:
    spec: "#6d28d9"
    sync: "#4c1d95"
events:
  - { start: 2025-03-17, type: spec, note: RFC draft }
  - { start: 2025-04-12, end: 2025-04-16, type: sync, note: Team week }
  - { start: 2025-05-24, type: spec, note: RFC v2 }
```

Change `daysPerRow` to `7`, `14`, or `45` and watch the shape morph. Custom
is the only layout where `daysPerRow` is honored.

---

# Shapes, sizes, gaps

`shape` changes the tile glyph. `daySize` and `gap` change how the row reads.
Each block targets roughly the same total width (~550px) — `daysPerRow` and
the date range are tuned to compensate for the larger tile sizes, so you can
compare shapes side-by-side without one example dwarfing the next.

## Rect — square tiles, small and tight

```daytiles
layout: custom
daysPerRow: 39
startDate: 2025-03-31
endDate: 2025-05-08
shape: rect
daySize: 12
gap: 2
colors:
  dayColor: "#cbd5e1"
  current: "#0f766e"
  eventTypeColors:
    work: "#0f766e"
events:
  - { start: 2025-04-07, type: work, note: Kickoff }
  - { start: 2025-04-14, type: work, note: Standup }
  - { start: 2025-04-28, type: work, note: Review }
```

## Rounded — softened corners, medium size

```daytiles
layout: custom
daysPerRow: 23
startDate: 2025-04-08
endDate: 2025-04-30
shape: rounded
daySize: 20
gap: 4
colors:
  dayColor: "#e7e5e4"
  current: "#881337"
  eventTypeColors:
    holiday: "#881337"
events:
  - { start: 2025-04-17, type: holiday, note: Saturday off }
  - { start: 2025-04-18, type: holiday, note: Sunday off }
  - { start: 2025-04-24, type: holiday, note: Saturday off }
```

## Circle — round tiles, large with generous gaps

```daytiles
layout: custom
daysPerRow: 10
startDate: 2025-04-14
endDate: 2025-04-23
shape: circle
daySize: 50
gap: 8
colors:
  dayColor: "#d1fae5"
  current: "#16a34a"
  eventTypeColors:
    deploy: "#14532d"
events:
  - { start: 2025-04-19, type: deploy, note: Today deploy }
```

## Diamond — rotated squares with wide gaps

```daytiles
layout: custom
daysPerRow: 17
startDate: 2025-04-11
endDate: 2025-04-27
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
  - { start: 2025-04-15, type: spec, note: RFC }
  - { start: 2025-04-22, type: sync, note: Team sync }
```

## Rect dense — one year in one small block

```daytiles
layout: custom
daysPerRow: 69
startDate: 2024-12-10
endDate: 2025-12-09
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
  - { start: 2025-01-23, type: holiday, note: Valentine }
  - { start: 2025-03-22, end: 2025-03-26, type: work, note: Sprint }
  - { start: 2025-06-12, type: holiday, note: Independence Day }
  - { start: 2025-12-03, type: holiday, note: Christmas }
```

Push `daySize` up to `80` on the circle block, or drop `gap` to `0` on the
rect block — the same shape reads completely differently.

---

# Events

Events come from one of two places: an **inline list** in the block, or a
**Dataview query** that pulls them from your vault.

Events don't carry a raw hex color — they carry a `type`. Colors live in a
palette under `colors.eventTypeColors`, and events reference them by name.
That way, retinting the calendar is one edit in one place.

## Inline list

Each entry is a `start` (and optionally `end`, `type`, `note`, `weight`).
The block below shows four kinds of events in one list:

- **Default color** — no `type` set, falls back to `colors.defaultEventColor`
- **Typed single day** — `type` resolved through `colors.eventTypeColors`
- **Typed date range** — `start` + `end` paints every tile in between
- **Another single day** — different `type`, different color

```daytiles
layout: week
startDate: 2025-03-15
endDate: 2025-05-02
shape: rounded
showLabels: true
colors:
  dayColor: "#c7d2fe"
  current: "#4338ca"
  defaultEventColor: "#a8a29e"
  eventTypeColors:
    work:    "#312e81"
    launch:  "#9a3412"
    holiday: "#14532d"
events:
  - { start: 2025-03-18,                                 note: Untyped }
  - { start: 2025-03-22, end: 2025-03-26, type: work,    note: Sprint }
  - { start: 2025-04-05, type: holiday,                  note: Off day }
  - { start: 2025-04-19, type: launch,                   note: Today launch }
```

Hover a tile to see its `note`.

## Heatmap

Flip `colors.heatmap: true` and the tile is tinted by accumulated event
**weight** (or count) between `heatmapLow` and `heatmapHigh`. Each tile picks
its hue from the dominant `type` on that day — so different event types
produce different colored gradients, and overlapping types on the same tile
fight for dominance. Untyped events fall back to `defaultEventColor`.

```daytiles
layout: weekday
startDate: 2025-02-08
endDate: 2025-04-25
shape: rounded
daySize: 18
gap: 3
colors:
  dayColor: "#f1f5f9"
  pastFade: 1
  heatmap: true
  heatmapLow: 0.2
  heatmapHigh: 0.75
  defaultEventColor: "#64748b"
  eventTypeColors:
    code:    "#0ea5e9"
    meeting: "#f59e0b"
events:
  - { start: 2025-02-08, type: code,    weight: 3 }
  - { start: 2025-02-09, type: meeting, weight: 2 }
  - { start: 2025-02-10, type: code,    weight: 4 }
  - { start: 2025-02-11, type: meeting, weight: 3 }
  - { start: 2025-02-12, type: code,    weight: 5 }
  - { start: 2025-02-13, type: meeting, weight: 1 }
  - { start: 2025-02-14, type: code,    weight: 2 }
  - { start: 2025-02-15, type: code,    weight: 5 }
  - { start: 2025-02-16, type: meeting, weight: 4 }
  - { start: 2025-02-17, type: code,    weight: 6 }
  - { start: 2025-02-18, type: meeting, weight: 3 }
  - { start: 2025-02-19, type: code,    weight: 4 }
  - { start: 2025-02-20, type: meeting, weight: 2 }
  - { start: 2025-02-21, type: code,    weight: 1 }
  - { start: 2025-02-22, type: code,    weight: 7 }
  - { start: 2025-02-23, type: meeting, weight: 5 }
  - { start: 2025-02-24, type: code,    weight: 4 }
  - { start: 2025-02-25, type: meeting, weight: 6 }
  - { start: 2025-02-26, type: code,    weight: 5 }
  - { start: 2025-02-27, type: meeting, weight: 3 }
  - { start: 2025-02-28, type: code,    weight: 2 }
  - { start: 2025-03-01, type: meeting, weight: 8 }
  - { start: 2025-03-02, type: code,    weight: 5 }
  - { start: 2025-03-03, type: meeting, weight: 7 }
  - { start: 2025-03-04, type: code,    weight: 4 }
  - { start: 2025-03-05, type: meeting, weight: 5 }
  - { start: 2025-03-06, type: code,    weight: 3 }
  - { start: 2025-03-07, type: meeting, weight: 2 }
  - { start: 2025-03-08, type: code,    weight: 9 }
  - { start: 2025-03-09, type: meeting, weight: 6 }
  - { start: 2025-03-10, type: code,    weight: 7 }
  - { start: 2025-03-11, type: meeting, weight: 5 }
  - { start: 2025-03-12, type: code,    weight: 4 }
  - { start: 2025-03-13, type: meeting, weight: 3 }
  - { start: 2025-03-14, type: code,    weight: 2 }
  - { start: 2025-03-15, type: meeting, weight: 7 }
  - { start: 2025-03-16, type: code,    weight: 8 }
  - { start: 2025-03-17, type: meeting, weight: 6 }
  - { start: 2025-03-18, type: code,    weight: 5 }
  - { start: 2025-03-19, type: meeting, weight: 4 }
  - { start: 2025-03-20, type: code,    weight: 3 }
  - { start: 2025-03-21, type: meeting, weight: 2 }
  - { start: 2025-03-22, type: code,    weight: 10 }
  - { start: 2025-03-23, type: meeting, weight: 7 }
  - { start: 2025-03-24, type: code,    weight: 8 }
  - { start: 2025-03-25, type: meeting, weight: 5 }
  - { start: 2025-03-26, type: code,    weight: 6 }
  - { start: 2025-03-27, type: meeting, weight: 3 }
  - { start: 2025-03-28, type: code,    weight: 4 }
  - { start: 2025-03-29, type: meeting, weight: 11 }
  - { start: 2025-03-30, type: code,    weight: 9 }
  - { start: 2025-03-31, type: meeting, weight: 8 }
  - { start: 2025-04-01, type: code,    weight: 7 }
  - { start: 2025-04-02, type: meeting, weight: 5 }
  - { start: 2025-04-03, type: code,    weight: 4 }
  - { start: 2025-04-04, type: meeting, weight: 3 }
  - { start: 2025-04-05, type: code,    weight: 12 }
  - { start: 2025-04-06, type: meeting, weight: 9 }
  - { start: 2025-04-07, type: code,    weight: 8 }
  - { start: 2025-04-08, type: meeting, weight: 6 }
  - { start: 2025-04-09, type: code,    weight: 7 }
  - { start: 2025-04-10, type: meeting, weight: 4 }
  - { start: 2025-04-11, type: code,    weight: 5 }
  - { start: 2025-04-12, type: code,    weight: 14 }
  - { start: 2025-04-13, type: meeting, weight: 10 }
  - { start: 2025-04-14, type: code,    weight: 9 }
  - { start: 2025-04-15, type: meeting, weight: 8 }
  - { start: 2025-04-16, type: code,    weight: 7 }
  - { start: 2025-04-17, type: meeting, weight: 5 }
  - { start: 2025-04-18, type: code,    weight: 4 }
  - { start: 2025-04-19, type: code,    weight: 12 }
  - { start: 2025-04-19, type: meeting, weight: 6 }
  - { start: 2025-04-20, type: meeting, weight: 11 }
  - { start: 2025-04-21, type: code,    weight: 8 }
  - { start: 2025-04-22, type: meeting, weight: 7 }
  - { start: 2025-04-23, type: code,    weight: 6 }
  - { start: 2025-04-24, type: meeting, weight: 4 }
  - { start: 2025-04-25, type: code,    weight: 3 }
```

## Dataview query

When you don't want to maintain the list by hand, point at a Dataview query.
Each result row becomes an event.

> **Requires** the [Dataview](https://blacksmithgu.github.io/obsidian-dataview/)
> community plugin. Without it, this block renders empty with an inline
> error message.

Notes in the queried folder should carry frontmatter like:

```yaml
---
date: 2025-01-23
type: launch
note: Beta cut
---
```

```daytiles
layout: weekday
startDate: 2024-12-10
endDate: 2025-12-09
shape: rounded
colors:
  dayColor: "#d1fae5"
  alternation: { mode: month, color: "#6ee7b7" }
  eventTypeColors:
    work:     "#0f766e"
    launch:   "#9a3412"
    vacation: "#14532d"
events:
  source: dataview
  query: |
    TABLE WITHOUT ID date AS start, type, note
    FROM "Journal"
    WHERE date
    SORT date ASC
  fields:
    start: start
    type:  type
    note:  note
```

### Field mapping

`fields` renames Dataview result columns into daytiles event keys (left =
daytiles key, right = column name). Only `start` is mandatory.

```yaml
fields:
  start:      start       # required
  type:       type        # looked up in colors.eventTypeColors
  note:       note        # tooltip
  vault_link: vault_link  # see "Actions" below
  url:        url         # see "Actions" below
  weight:     weight      # heatmap intensity
```

## Actions — clicking a tile

Clicking a colored tile can open something. Events support two link targets:

- `vault_link` — opens a note inside this vault (like an Obsidian internal link)
- `url` — opens an external URL in the browser

Set whichever fits. If both are present, `url` wins.

### Open a vault note

`vault_link` resolves the same way a `[[wiki link]]` does: relative to the
current note's folder first, then by title across the vault.

```daytiles
layout: month
startDate: 2025-02-07
endDate: 2025-06-08
shape: rounded
showLabels: true
colors:
  dayColor: "#ddd6fe"
  alternation: { mode: month, color: "#a78bfa" }
  eventTypeColors:
    doc:    "#4c1d95"
    review: "#881337"
    spec:   "#115e59"
events:
  - { start: 2025-02-18, type: doc,    note: Kickoff,        vault_link: "Daytiles" }
  - { start: 2025-03-17, type: review, note: Layouts review, vault_link: "Daytiles#Layouts" }
  - { start: 2025-04-19, type: spec,   note: Shapes review,  vault_link: "Daytiles#Shapes, sizes, gaps" }
  - { start: 2025-05-24, type: doc,    note: Events review,  vault_link: "Daytiles#Events" }
```

Subpaths after `#` for headings work too. Missing targets prompt Obsidian to
create the note.

### Open an external URL

```daytiles
layout: month
startDate: 2025-03-10
endDate: 2025-06-08
shape: rounded
showLabels: true
colors:
  dayColor: "#c7d2fe"
  alternation: { mode: month, color: "#a5b4fc" }
  eventTypeColors:
    doc:  "#312e81"
    repo: "#9a3412"
    api:  "#0f766e"
events:
  - { start: 2025-03-31, type: doc,  note: Obsidian help, url: "https://help.obsidian.md" }
  - { start: 2025-04-19, type: repo, note: Daytiles repo, url: "https://github.com/Chamartin3/daytiles" }
  - { start: 2025-05-24, type: api,  note: Dataview docs, url: "https://blacksmithgu.github.io/obsidian-dataview/" }
```

`url` opens in your default browser (`target=_blank`, `rel=noopener`).

### Actions from Dataview

Both targets work as Dataview fields too. Add columns to the query and map
them through `fields`:

```daytiles
layout: weekday
startDate: 2024-12-10
endDate: 2025-12-09
shape: rounded
colors:
  dayColor: "#d1fae5"
  alternation: { mode: month, color: "#6ee7b7" }
  eventTypeColors:
    work:     "#0f766e"
    launch:   "#9a3412"
    vacation: "#14532d"
events:
  source: dataview
  query: |
    TABLE WITHOUT ID date AS start, type, note, file.link AS vault_link
    FROM "Journal"
    WHERE date
  fields:
    start:      start
    type:       type
    note:       note
    vault_link: vault_link
```

`file.link` gives each result a self-link so clicking the tile jumps straight
to that note.
