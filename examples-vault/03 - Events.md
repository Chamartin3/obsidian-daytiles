# 03 — Events

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
startDate: 2026-04-06
endDate: 2026-05-24
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
  - { start: 2026-04-09,                                 note: Untyped }
  - { start: 2026-04-13, end: 2026-04-17, type: work,    note: Sprint }
  - { start: 2026-04-27, type: holiday,                  note: Off day }
  - { start: 2026-05-11, type: launch,                   note: Today launch }
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
startDate: 2026-03-02
endDate: 2026-05-17
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
  - { start: 2026-03-02, type: code,    weight: 3 }
  - { start: 2026-03-03, type: meeting, weight: 2 }
  - { start: 2026-03-04, type: code,    weight: 4 }
  - { start: 2026-03-05, type: meeting, weight: 3 }
  - { start: 2026-03-06, type: code,    weight: 5 }
  - { start: 2026-03-07, type: meeting, weight: 1 }
  - { start: 2026-03-08, type: code,    weight: 2 }
  - { start: 2026-03-09, type: code,    weight: 5 }
  - { start: 2026-03-10, type: meeting, weight: 4 }
  - { start: 2026-03-11, type: code,    weight: 6 }
  - { start: 2026-03-12, type: meeting, weight: 3 }
  - { start: 2026-03-13, type: code,    weight: 4 }
  - { start: 2026-03-14, type: meeting, weight: 2 }
  - { start: 2026-03-15, type: code,    weight: 1 }
  - { start: 2026-03-16, type: code,    weight: 7 }
  - { start: 2026-03-17, type: meeting, weight: 5 }
  - { start: 2026-03-18, type: code,    weight: 4 }
  - { start: 2026-03-19, type: meeting, weight: 6 }
  - { start: 2026-03-20, type: code,    weight: 5 }
  - { start: 2026-03-21, type: meeting, weight: 3 }
  - { start: 2026-03-22, type: code,    weight: 2 }
  - { start: 2026-03-23, type: meeting, weight: 8 }
  - { start: 2026-03-24, type: code,    weight: 5 }
  - { start: 2026-03-25, type: meeting, weight: 7 }
  - { start: 2026-03-26, type: code,    weight: 4 }
  - { start: 2026-03-27, type: meeting, weight: 5 }
  - { start: 2026-03-28, type: code,    weight: 3 }
  - { start: 2026-03-29, type: meeting, weight: 2 }
  - { start: 2026-03-30, type: code,    weight: 9 }
  - { start: 2026-03-31, type: meeting, weight: 6 }
  - { start: 2026-04-01, type: code,    weight: 7 }
  - { start: 2026-04-02, type: meeting, weight: 5 }
  - { start: 2026-04-03, type: code,    weight: 4 }
  - { start: 2026-04-04, type: meeting, weight: 3 }
  - { start: 2026-04-05, type: code,    weight: 2 }
  - { start: 2026-04-06, type: meeting, weight: 7 }
  - { start: 2026-04-07, type: code,    weight: 8 }
  - { start: 2026-04-08, type: meeting, weight: 6 }
  - { start: 2026-04-09, type: code,    weight: 5 }
  - { start: 2026-04-10, type: meeting, weight: 4 }
  - { start: 2026-04-11, type: code,    weight: 3 }
  - { start: 2026-04-12, type: meeting, weight: 2 }
  - { start: 2026-04-13, type: code,    weight: 10 }
  - { start: 2026-04-14, type: meeting, weight: 7 }
  - { start: 2026-04-15, type: code,    weight: 8 }
  - { start: 2026-04-16, type: meeting, weight: 5 }
  - { start: 2026-04-17, type: code,    weight: 6 }
  - { start: 2026-04-18, type: meeting, weight: 3 }
  - { start: 2026-04-19, type: code,    weight: 4 }
  - { start: 2026-04-20, type: meeting, weight: 11 }
  - { start: 2026-04-21, type: code,    weight: 9 }
  - { start: 2026-04-22, type: meeting, weight: 8 }
  - { start: 2026-04-23, type: code,    weight: 7 }
  - { start: 2026-04-24, type: meeting, weight: 5 }
  - { start: 2026-04-25, type: code,    weight: 4 }
  - { start: 2026-04-26, type: meeting, weight: 3 }
  - { start: 2026-04-27, type: code,    weight: 12 }
  - { start: 2026-04-28, type: meeting, weight: 9 }
  - { start: 2026-04-29, type: code,    weight: 8 }
  - { start: 2026-04-30, type: meeting, weight: 6 }
  - { start: 2026-05-01, type: code,    weight: 7 }
  - { start: 2026-05-02, type: meeting, weight: 4 }
  - { start: 2026-05-03, type: code,    weight: 5 }
  - { start: 2026-05-04, type: code,    weight: 14 }
  - { start: 2026-05-05, type: meeting, weight: 10 }
  - { start: 2026-05-06, type: code,    weight: 9 }
  - { start: 2026-05-07, type: meeting, weight: 8 }
  - { start: 2026-05-08, type: code,    weight: 7 }
  - { start: 2026-05-09, type: meeting, weight: 5 }
  - { start: 2026-05-10, type: code,    weight: 4 }
  - { start: 2026-05-11, type: code,    weight: 12 }
  - { start: 2026-05-11, type: meeting, weight: 6 }
  - { start: 2026-05-12, type: meeting, weight: 11 }
  - { start: 2026-05-13, type: code,    weight: 8 }
  - { start: 2026-05-14, type: meeting, weight: 7 }
  - { start: 2026-05-15, type: code,    weight: 6 }
  - { start: 2026-05-16, type: meeting, weight: 4 }
  - { start: 2026-05-17, type: code,    weight: 3 }
```

## Dataview query

When you don't want to maintain the list by hand, point at a Dataview query.
Each result row becomes an event.

> **Requires** the [Dataview](https://blacksmithgu.github.io/obsidian-dataview/)
> community plugin. Without it, this block renders empty with an inline
> error message.

The vault's `Journal/` folder is seeded with dated notes whose frontmatter
looks like:

```yaml
---
date: 2026-02-14
type: launch
note: Beta cut
---
```

```daytiles
layout: weekday
startDate: 2026-01-01
endDate: 2026-12-31
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
startDate: 2026-03-01
endDate: 2026-06-30
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
  - { start: 2026-03-12, type: doc,    note: Kickoff,        vault_link: "00 - Start here" }
  - { start: 2026-04-08, type: review, note: Layouts review, vault_link: "01 - Layouts" }
  - { start: 2026-05-11, type: spec,   note: Shapes review,  vault_link: "02 - Shapes" }
  - { start: 2026-06-15, type: doc,    note: Events review,  vault_link: "03 - Events" }
```

Subpaths after `#` for headings work too (`vault_link: "01 - Layouts#Week"`).
Missing targets prompt Obsidian to create the note.

### Open an external URL

```daytiles
layout: month
startDate: 2026-04-01
endDate: 2026-06-30
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
  - { start: 2026-04-22, type: doc,  note: Obsidian help, url: "https://help.obsidian.md" }
  - { start: 2026-05-11, type: repo, note: Daytiles repo, url: "https://github.com/Chamartin3/daytiles" }
  - { start: 2026-06-15, type: api,  note: Dataview docs, url: "https://blacksmithgu.github.io/obsidian-dataview/" }
```

`url` opens in your default browser (`target=_blank`, `rel=noopener`).

### Actions from Dataview

Both targets work as Dataview fields too. Add columns to the query and map
them through `fields`:

```daytiles
layout: weekday
startDate: 2026-01-01
endDate: 2026-12-31
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

`file.link` gives each journal note a self-link so clicking the tile jumps
straight back to that day's entry.

## Try it

Replace `FROM "Journal"` with one of your own folders. Add `date` plus a
`type` (and any of the optional fields above) to a note in that folder and
it'll land on the calendar. Then swap a `vault_link` for a `url` to redirect
clicks to the browser.
