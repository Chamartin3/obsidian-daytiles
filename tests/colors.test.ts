import { describe, test, expect } from "@jest/globals";
import { build_ } from "./setup";

describe("alternation modes", () => {
  test.each([
    { mode: "none" },
    { mode: "day" },
    { mode: "week" },
    { mode: "month" },
    { mode: "year" },
    { mode: "custom" }
  ])('alternation mode "$mode" passes through', ({ mode }) => {
    const { options } = build_(`
colors:
  alternation: { mode: ${mode}, color: "#abcdef" }
`);
    expect(options.colors?.alternation?.mode).toBe(mode);
    expect(options.colors?.alternation?.color).toBe("#abcdef");
  });

  test("unknown alternation mode raises a parse error", () => {
    expect(() => build_(`colors:\n  alternation: { mode: spiral }`)).toThrow(
      /unknown alternation mode/
    );
  });
});

describe("fade and current-day flags", () => {
  test("pastFade and futureFade pass through as numbers", () => {
    const { options } = build_(`
colors:
  pastFade: 0.4
  futureFade: 0.9
`);
    expect(options.colors?.pastFade).toBe(0.4);
    expect(options.colors?.futureFade).toBe(0.9);
  });

  test.each([
    { input: "false", expected: false },
    { input: '"no"', expected: false },
    { input: '"yes"', expected: true },
    { input: "true", expected: true }
  ])("highlightCurrent accepts $input", ({ input, expected }) => {
    const { options } = build_(`colors:\n  highlightCurrent: ${input}`);
    expect(options.colors?.highlightCurrent).toBe(expected);
  });

  test("non-numeric fade raises a parse error", () => {
    expect(() => build_(`colors:\n  pastFade: lots`)).toThrow(/pastFade must be a number/);
  });
});

describe("heatmap options", () => {
  test("heatmap on with low/high bounds passes through", () => {
    const { options } = build_(`
colors:
  heatmap: true
  heatmapLow: 0.15
  heatmapHigh: 0.85
`);
    expect(options.colors?.heatmap).toBe(true);
    expect(options.colors?.heatmapLow).toBe(0.15);
    expect(options.colors?.heatmapHigh).toBe(0.85);
  });
});

describe("event color overrides", () => {
  test("defaultEventColor passes through", () => {
    const { options } = build_(`colors:\n  defaultEventColor: "#ff00aa"`);
    expect(options.colors?.defaultEventColor).toBe("#ff00aa");
  });

  test("eventTypeColors map is copied", () => {
    const { options } = build_(`
colors:
  eventTypeColors:
    work: "#1d4ed8"
    travel: "#047857"
    review: "#9a3412"
`);
    expect(options.colors?.eventTypeColors).toEqual({
      work: "#1d4ed8",
      travel: "#047857",
      review: "#9a3412"
    });
  });
});

describe("highlight maps", () => {
  test("weekdays highlight map is copied", () => {
    const { options } = build_(`
colors:
  highlight:
    weekdays: { 0: "#dcfce7", 6: "#dcfce7" }
`);
    expect(options.colors?.highlight?.weekdays).toEqual({ 0: "#dcfce7", 6: "#dcfce7" });
    expect(options.colors?.highlight?.months).toEqual({});
  });

  test("months highlight map is copied", () => {
    const { options } = build_(`
colors:
  highlight:
    months: { 1: "#fee2e2", 12: "#dbeafe" }
`);
    expect(options.colors?.highlight?.months).toEqual({ 1: "#fee2e2", 12: "#dbeafe" });
  });
});

describe("block-level visuals", () => {
  test("background and textColor are extracted from the block", () => {
    const built = build_(`
background: "#0f172a"
textColor: "#e2e8f0"
`);
    expect(built.background).toBe("#0f172a");
    expect(built.textColor).toBe("#e2e8f0");
  });
});
