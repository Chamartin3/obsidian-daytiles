import { describe, test, expect, beforeEach } from "@jest/globals";
import { Daytiles } from "daytiles";
import { build_ } from "./setup";

const SVG_NS = "http://www.w3.org/2000/svg";

function render(yaml: string): SVGSVGElement {
  const built = build_(yaml);
  const dt = new Daytiles(built.options);
  if (built.inlineEvents.length) dt.addEvents(built.inlineEvents);
  const svg = document.createElementNS(SVG_NS, "svg") as SVGSVGElement;
  dt.render(svg);
  return svg;
}

function fillsOf(svg: SVGSVGElement): string[] {
  return Array.from(svg.querySelectorAll<SVGElement>("[fill]")).map(
    (n) => n.getAttribute("fill") ?? ""
  );
}

function tagCounts(svg: SVGSVGElement): Record<string, number> {
  const out: Record<string, number> = {};
  for (const n of Array.from(svg.querySelectorAll("*"))) {
    const t = n.tagName.toLowerCase();
    out[t] = (out[t] ?? 0) + 1;
  }
  return out;
}

describe("svg is produced", () => {
  test("month layout renders a non-empty svg with tiles", () => {
    const svg = render(`
layout: month
startDate: 2026-04-01
endDate: 2026-04-30
daySize: 16
gap: 4
`);
    expect(svg.childElementCount).toBeGreaterThan(0);
    expect(svg.querySelectorAll("rect").length).toBeGreaterThanOrEqual(30);
  });

  test("invalid range still returns an svg (possibly empty), never throws", () => {
    expect(() =>
      render(`
layout: month
startDate: 2026-04-30
endDate: 2026-04-01
`)
    ).not.toThrow();
  });
});

describe("shape choice drives tile element type", () => {
  test.each([
    { shape: "rect", tag: "rect" },
    { shape: "rounded", tag: "rect" },
    { shape: "circle", tag: "circle" },
    { shape: "diamond", tag: "polygon" }
  ])("shape $shape draws $tag elements", ({ shape, tag }) => {
    const svg = render(`
layout: month
shape: ${shape}
startDate: 2026-04-01
endDate: 2026-04-14
daySize: 16
gap: 4
`);
    expect(tagCounts(svg)[tag]).toBeGreaterThanOrEqual(14);
  });

  test("rounded shape sets a corner radius", () => {
    const svg = render(`
layout: month
shape: rounded
startDate: 2026-04-01
endDate: 2026-04-14
daySize: 20
`);
    const rounded = Array.from(svg.querySelectorAll("rect")).filter(
      (r) => parseFloat(r.getAttribute("rx") ?? "0") > 0
    );
    expect(rounded.length).toBeGreaterThanOrEqual(14);
  });
});

describe("colors actually paint tiles", () => {
  test("dayColor appears on background tiles", () => {
    const svg = render(`
layout: month
startDate: 2026-04-01
endDate: 2026-04-14
colors:
  dayColor: "#dbeafe"
  highlightCurrent: false
`);
    expect(fillsOf(svg)).toContain("#dbeafe");
  });

  test("alternation color appears alongside base dayColor", () => {
    const svg = render(`
layout: month
startDate: 2026-04-01
endDate: 2026-04-30
colors:
  dayColor: "#dbeafe"
  alternation: { mode: week, color: "#93c5fd" }
  highlightCurrent: false
`);
    const fills = fillsOf(svg);
    expect(fills).toContain("#dbeafe");
    expect(fills).toContain("#93c5fd");
  });

  test("eventTypeColors paint event tiles with the configured hue", () => {
    const svg = render(`
layout: month
startDate: 2026-04-01
endDate: 2026-04-30
colors:
  dayColor: "#dbeafe"
  eventTypeColors:
    work: "#1d4ed8"
  highlightCurrent: false
events:
  - { start: 2026-04-13, type: work, note: Kickoff }
`);
    expect(fillsOf(svg)).toContain("#1d4ed8");
  });

  test("defaultEventColor paints untyped events", () => {
    const svg = render(`
layout: month
startDate: 2026-04-01
endDate: 2026-04-30
colors:
  dayColor: "#eee"
  defaultEventColor: "#ff00aa"
  highlightCurrent: false
events:
  - { start: 2026-04-13, note: Anything }
`);
    expect(fillsOf(svg)).toContain("#ff00aa");
  });
});

describe("layout shapes the grid", () => {
  test("custom layout honors daysPerRow when computing column positions", () => {
    const svg = render(`
layout: custom
daysPerRow: 7
startDate: 2026-04-01
endDate: 2026-04-14
daySize: 16
gap: 4
`);
    const xs = Array.from(svg.querySelectorAll("rect"))
      .map((r) => parseFloat(r.getAttribute("x") ?? "NaN"))
      .filter((n) => Number.isFinite(n));
    const distinct = new Set(xs);
    expect(distinct.size).toBe(7);
  });
});

describe("heatmap mode tints by event weight", () => {
  test("heatmap renders without throwing and paints distinct fills per weight", () => {
    const svg = render(`
layout: month
startDate: 2026-04-01
endDate: 2026-04-21
colors:
  dayColor: "#ffffff"
  heatmap: true
  eventTypeColors:
    code: "#0ea5e9"
  highlightCurrent: false
events:
  - { start: 2026-04-05, type: code, weight: 1 }
  - { start: 2026-04-10, type: code, weight: 5 }
  - { start: 2026-04-15, type: code, weight: 10 }
`);
    const fills = new Set(fillsOf(svg));
    expect(fills.size).toBeGreaterThan(1);
  });
});

describe("event ranges span multiple tiles", () => {
  test("ranged event paints every day between start and end", () => {
    const svg = render(`
layout: month
startDate: 2026-05-01
endDate: 2026-05-31
colors:
  dayColor: "#fff"
  eventTypeColors:
    sprint: "#1e3a8a"
  highlightCurrent: false
events:
  - { start: 2026-05-04, end: 2026-05-08, type: sprint, note: Sprint }
`);
    const sprintTiles = fillsOf(svg).filter((f) => f === "#1e3a8a");
    expect(sprintTiles.length).toBeGreaterThanOrEqual(5);
  });
});
