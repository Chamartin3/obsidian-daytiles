import { describe, test, expect } from "@jest/globals";
import { build_, toISO } from "./setup";

describe("layouts", () => {
  test.each([
    {
      name: "month",
      yaml: `
layout: month
startDate: 2026-04-01
endDate: 2026-06-30
showLabels: true
colors:
  dayColor: "#dbeafe"
  alternation: { mode: month, color: "#93c5fd" }
`,
      expected: {
        layout: "month",
        startDate: "2026-04-01",
        endDate: "2026-06-30",
        showLabels: true,
        alternationMode: "month"
      }
    },
    {
      name: "week",
      yaml: `
layout: week
startDate: 2026-04-13
endDate: 2026-06-07
colors:
  dayColor: "#fed7aa"
  current: "#ea580c"
`,
      expected: { layout: "week", current: "#ea580c" }
    },
    {
      name: "weekday",
      yaml: `
layout: weekday
startDate: 2026-01-01
endDate: 2026-12-31
colors:
  alternation: { mode: month, color: "#6ee7b7" }
`,
      expected: { layout: "weekday", alternationMode: "month", alternationColor: "#6ee7b7" }
    },
    {
      name: "custom",
      yaml: `
layout: custom
daysPerRow: 21
startDate: 2026-04-01
endDate: 2026-06-30
colors:
  alternation: { mode: custom, size: 21, color: "#a78bfa" }
`,
      expected: { layout: "custom", daysPerRow: 21, alternationMode: "custom", alternationSize: 21 }
    }
  ])("$name layout flows configuration through", ({ yaml, expected }) => {
    const { options } = build_(yaml);
    if (expected.layout) expect(options.layout).toBe(expected.layout);
    if (expected.startDate) expect(toISO(options.startDate)).toBe(expected.startDate);
    if (expected.endDate) expect(toISO(options.endDate)).toBe(expected.endDate);
    if (expected.showLabels != null) expect(options.showLabels).toBe(expected.showLabels);
    if (expected.daysPerRow) expect(options.daysPerRow).toBe(expected.daysPerRow);
    if (expected.current) expect(options.colors?.current).toBe(expected.current);
    if (expected.alternationMode)
      expect(options.colors?.alternation?.mode).toBe(expected.alternationMode);
    if (expected.alternationColor)
      expect(options.colors?.alternation?.color).toBe(expected.alternationColor);
    if (expected.alternationSize)
      expect(options.colors?.alternation?.size).toBe(expected.alternationSize);
  });
});

describe("layout validation errors", () => {
  test("unknown layout value raises a parse error", () => {
    expect(() => build_(`layout: spiral`)).toThrow(/unknown layout/);
  });
});

describe("layout option passthrough", () => {
  test("daysPerRow set without custom layout still passes through", () => {
    const { options } = build_(`
layout: month
daysPerRow: 30
startDate: 2026-01-01
endDate: 2026-01-31
`);
    expect(options.layout).toBe("month");
    expect(options.daysPerRow).toBe(30);
  });

  test("month layout with events captures inline list and ranges", () => {
    const { inlineEvents } = build_(`
layout: month
startDate: 2026-04-01
endDate: 2026-06-30
events:
  - { start: 2026-04-13, type: work, note: Kickoff }
  - { start: 2026-05-04, end: 2026-05-08, type: work, note: Sprint }
`);
    expect(inlineEvents).toHaveLength(2);
    expect(toISO(inlineEvents[1].end)).toBe("2026-05-08");
  });
});
