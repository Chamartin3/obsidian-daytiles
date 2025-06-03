import { describe, test, expect } from "@jest/globals";
import { build_, toISO } from "./setup";

describe("inline event list", () => {
  test("single event with default color (no type)", () => {
    const { inlineEvents } = build_(`
events:
  - { start: 2026-04-13, note: Lunch }
`);
    expect(inlineEvents).toHaveLength(1);
    expect(toISO(inlineEvents[0].start)).toBe("2026-04-13");
    expect(inlineEvents[0].type).toBeUndefined();
    expect(inlineEvents[0].note).toBe("Lunch");
  });

  test("typed single-day event", () => {
    const { inlineEvents } = build_(`
events:
  - { start: 2026-04-20, type: work, note: Standup }
`);
    expect(inlineEvents[0].type).toBe("work");
  });

  test("ranged event preserves start and end", () => {
    const { inlineEvents } = build_(`
events:
  - { start: 2026-05-04, end: 2026-05-08, type: work, note: Sprint }
`);
    expect(toISO(inlineEvents[0].start)).toBe("2026-05-04");
    expect(toISO(inlineEvents[0].end)).toBe("2026-05-08");
  });

  test("weight passes through for heatmap intensity", () => {
    const { inlineEvents } = build_(`
events:
  - { start: 2026-04-13, type: code, weight: 3 }
`);
    expect(inlineEvents[0].weight).toBe(3);
  });

  test("multiple mixed events preserve order", () => {
    const { inlineEvents } = build_(`
events:
  - { start: 2026-04-13, note: A }
  - { start: 2026-04-14, type: work }
  - { start: 2026-04-20, end: 2026-04-22, type: travel }
  - { start: 2026-04-25, type: review }
`);
    expect(inlineEvents).toHaveLength(4);
    expect(inlineEvents[2].type).toBe("travel");
    expect(toISO(inlineEvents[2].end)).toBe("2026-04-22");
  });

  test("missing start raises a parse error", () => {
    expect(() => build_(`events:\n  - { type: work }`)).toThrow(/event missing 'start'/);
  });

  test("non-mapping event raises a parse error", () => {
    expect(() => build_(`events:\n  - "2026-04-13"`)).toThrow(/each event must be a mapping/);
  });
});

describe("event link encoding", () => {
  test.each([
    {
      name: "url overrides wiki and vault_link",
      yaml: `
events:
  - { start: 2026-04-13, url: "https://x.test", vault_link: ignored, wiki: ignored }
`,
      expected: "url:https://x.test"
    },
    {
      name: "vault_link encoded as vault:",
      yaml: `
events:
  - { start: 2026-04-13, vault_link: "Notes/A" }
`,
      expected: "vault:Notes/A"
    },
    {
      name: "wiki falls back to vault: encoding",
      yaml: `
events:
  - { start: 2026-04-13, wiki: "Notes/B" }
`,
      expected: "vault:Notes/B"
    },
    {
      name: "no link fields yields undefined",
      yaml: `
events:
  - { start: 2026-04-13 }
`,
      expected: undefined
    }
  ])("$name", ({ yaml, expected }) => {
    const { inlineEvents } = build_(yaml);
    expect(inlineEvents[0].wiki).toBe(expected);
  });
});

describe("dataview event source", () => {
  test("source: dataview captures query and fields", () => {
    const built = build_(`
events:
  source: dataview
  query: 'TABLE start, type FROM "Journal"'
  fields:
    start: due
    type: kind
`);
    expect(built.inlineEvents).toHaveLength(0);
    expect(built.eventsSource?.kind).toBe("dataview");
    expect(built.eventsSource?.query).toBe('TABLE start, type FROM "Journal"');
    expect(built.eventsSource?.fields).toEqual({ start: "due", type: "kind" });
  });

  test("events object without dataview source raises a parse error", () => {
    expect(() => build_(`events:\n  source: csv\n  query: foo`)).toThrow(
      /events must be a list, or \{ source: dataview/
    );
  });
});
