# Start here

This is a tour of the Daytiles plugin. Each numbered note adds one concept.
Run them in order or jump around.

## What a Daytiles block looks like

Every block is a fenced ```` ```daytiles ```` code block whose body is YAML.
The plugin parses the YAML, builds a calendar, and replaces the block with
the rendered SVG.

```daytiles
layout: weekday
startDate: 2026-01-01
endDate: 2026-12-31
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
  - { start: 2026-02-14, type: holiday, note: Valentine }
  - { start: 2026-04-13, end: 2026-04-17, type: work, note: Sprint }
  - { start: 2026-05-11, type: work, note: Today }
  - { start: 2026-07-04, type: holiday, note: Independence Day }
  - { start: 2026-08-10, end: 2026-08-21, type: travel, note: Summer trip }
  - { start: 2026-12-25, type: holiday, note: Christmas }
```

A year of weekday tiles with weekend highlights and a handful of events.
Defaults everywhere else.

## Anchored dates

All examples in this vault are anchored to **2026**. Past tiles fade slightly,
future tiles render full-strength. If you open the vault much later than 2026,
the entire range will be "past" — that's fine, the visuals stay the same;
only the fade attribute differs.

To re-anchor a block to your current year, edit `startDate` and `endDate`.

## Where to tweak global defaults

Open *Settings → Community plugins → Daytiles*. Defaults set there apply to
every block; per-block options shallow-merge over them. The block frame
(background, label text color) lives there too.

## Next

Open **01 - Layouts** to see how `layout` reshapes the same date range four
different ways.
