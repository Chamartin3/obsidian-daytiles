import { describe, test, expect } from "@jest/globals";
import { resolveDataviewEvents } from "../src/sources/dataview";

interface FakeRow {
  [k: string]: unknown;
}

function makePlugin(rows: FakeRow[], headers: string[]) {
  return {
    app: {
      plugins: {
        plugins: {
          dataview: {
            api: {
              query: async () => ({
                successful: true,
                value: {
                  type: "table",
                  headers,
                  values: rows.map((r) => headers.map((h) => r[h]))
                }
              })
            }
          }
        }
      },
      workspace: { on: () => {}, off: () => {} }
    }
  } as never;
}

const SPEC = {
  kind: "dataview" as const,
  query: 'TABLE WITHOUT ID date AS start, file.link AS vault_link FROM "Journal"'
};

describe("resolveDataviewEvents — link normalization", () => {
  test("unwraps a Dataview Link object (path + subpath) into a plain target", async () => {
    const linkObj = { path: "Journal/2026-02-14", subpath: "", display: "2026-02-14" };
    const plugin = makePlugin(
      [{ start: "2026-02-14", vault_link: linkObj }],
      ["start", "vault_link"]
    );

    const events = await resolveDataviewEvents(plugin, SPEC, "Daytiles.md");

    expect(events).toHaveLength(1);
    expect(events[0].wiki).toBe("vault:Journal/2026-02-14");
  });

  test("preserves heading subpath when present on the Link object", async () => {
    const linkObj = { path: "Notes/Topic", subpath: "#Section", display: "Topic" };
    const plugin = makePlugin(
      [{ start: "2026-03-01", vault_link: linkObj }],
      ["start", "vault_link"]
    );

    const events = await resolveDataviewEvents(plugin, SPEC, "Daytiles.md");

    expect(events[0].wiki).toBe("vault:Notes/Topic#Section");
  });

  test("strips outer [[...]] from a stringified link", async () => {
    const plugin = makePlugin(
      [{ start: "2026-04-01", vault_link: "[[Journal/2026-04-01|2026-04-01]]" }],
      ["start", "vault_link"]
    );

    const events = await resolveDataviewEvents(plugin, SPEC, "Daytiles.md");

    expect(events[0].wiki).toBe("vault:Journal/2026-04-01|2026-04-01");
  });

  test("plain string vault_link passes through unchanged", async () => {
    const plugin = makePlugin(
      [{ start: "2026-05-01", vault_link: "Journal/2026-05-01" }],
      ["start", "vault_link"]
    );

    const events = await resolveDataviewEvents(plugin, SPEC, "Daytiles.md");

    expect(events[0].wiki).toBe("vault:Journal/2026-05-01");
  });

  test("url field beats vault_link and is encoded as url:", async () => {
    const plugin = makePlugin(
      [
        {
          start: "2026-06-01",
          vault_link: { path: "Notes/Topic" },
          url: "https://example.com"
        }
      ],
      ["start", "vault_link", "url"]
    );

    const events = await resolveDataviewEvents(plugin, SPEC, "Daytiles.md");

    expect(events[0].wiki).toBe("url:https://example.com");
  });

  test("missing link columns yield no wiki target", async () => {
    const plugin = makePlugin(
      [{ start: "2026-07-01" }],
      ["start"]
    );

    const events = await resolveDataviewEvents(plugin, SPEC, "Daytiles.md");

    expect(events[0].wiki).toBeUndefined();
  });
});
