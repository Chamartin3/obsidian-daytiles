import { describe, test, expect } from "@jest/globals";
import { build_ } from "./setup";

describe("shape values", () => {
  test.each([
    { input: "rect", expected: "rect" },
    { input: "square", expected: "rect" },
    { input: "rounded", expected: "roundedRect" },
    { input: "roundedRect", expected: "roundedRect" },
    { input: "rounded-rect", expected: "roundedRect" },
    { input: "circle", expected: "circle" },
    { input: "diamond", expected: "diamond" }
  ])('shape "$input" coerces to $expected', ({ input, expected }) => {
    const { options } = build_(`shape: ${input}`);
    expect(options.shape).toBe(expected);
  });
});

describe("shape sizing", () => {
  test.each([
    {
      name: "rect with small tiles",
      yaml: `
shape: rect
daySize: 12
gap: 3
daysPerRow: 39
startDate: 2026-04-01
endDate: 2026-06-30
`,
      expected: { shape: "rect", daySize: 12, gap: 3, daysPerRow: 39 }
    },
    {
      name: "rounded medium tiles",
      yaml: `
shape: rounded
daySize: 20
gap: 4
daysPerRow: 23
startDate: 2026-04-01
endDate: 2026-06-30
`,
      expected: { shape: "roundedRect", daySize: 20, gap: 4, daysPerRow: 23 }
    },
    {
      name: "circle with large daySize",
      yaml: `
shape: circle
daySize: 50
gap: 5
daysPerRow: 10
startDate: 2026-04-01
endDate: 2026-06-30
`,
      expected: { shape: "circle", daySize: 50, gap: 5, daysPerRow: 10 }
    },
    {
      name: "diamond wide gaps",
      yaml: `
shape: diamond
daySize: 22
gap: 11
daysPerRow: 17
startDate: 2026-04-01
endDate: 2026-06-30
`,
      expected: { shape: "diamond", daySize: 22, gap: 11, daysPerRow: 17 }
    },
    {
      name: "rect dense, no gaps",
      yaml: `
shape: rect
daySize: 8
gap: 0
daysPerRow: 69
startDate: 2026-01-01
endDate: 2026-12-31
`,
      expected: { shape: "rect", daySize: 8, gap: 0, daysPerRow: 69 }
    }
  ])("$name", ({ yaml, expected }) => {
    const { options } = build_(yaml);
    expect(options.shape).toBe(expected.shape);
    expect(options.daySize).toBe(expected.daySize);
    expect(options.gap).toBe(expected.gap);
    expect(options.daysPerRow).toBe(expected.daysPerRow);
  });
});

describe("shape and size validation errors", () => {
  test("unknown shape value raises a parse error", () => {
    expect(() => build_(`shape: hexagon`)).toThrow(/unknown shape/);
  });

  test("non-numeric daySize raises a parse error", () => {
    expect(() => build_(`daySize: huge`)).toThrow(/daySize must be a number/);
  });
});
