import type DaytilesPlugin from "../main";
import type { DaytilesEventInput } from "@daytiles/daytiles";

interface DataviewQueryResult {
  successful: boolean;
  value?: { type: "table"; headers: string[]; values: unknown[][] };
  error?: string;
}

interface DataviewApi {
  query(source: string, originFile?: string): Promise<DataviewQueryResult>;
}

interface DataviewSourceSpec {
  kind: "dataview";
  query: string;
  fields?: Record<string, string>;
}

const DEFAULT_FIELDS = {
  start: "start",
  end: "end",
  color: "color",
  type: "type",
  note: "note",
  wiki: "wiki"
};

export function getDataviewApi(plugin: DaytilesPlugin): DataviewApi | null {
  const app = plugin.app as unknown as {
    plugins?: { plugins?: Record<string, { api?: DataviewApi }> };
  };
  return app.plugins?.plugins?.["dataview"]?.api ?? null;
}

export async function resolveDataviewEvents(
  plugin: DaytilesPlugin,
  spec: DataviewSourceSpec,
  sourcePath: string,
): Promise<DaytilesEventInput[]> {
  const api = getDataviewApi(plugin);
  if (!api) {
    throw new Error("Dataview plugin is not installed or not enabled");
  }
  if (!spec.query.trim()) {
    throw new Error("dataview events require a non-empty 'query'");
  }

  const result = await api.query(spec.query, sourcePath);
  if (!result.successful || !result.value) {
    throw new Error(result.error ?? "unknown dataview error");
  }
  if (result.value.type !== "table") {
    throw new Error("dataview query must be a TABLE");
  }

  const fields = { ...DEFAULT_FIELDS, ...(spec.fields ?? {}) };
  const headers = result.value.headers;
  const idx = (name: string) => headers.indexOf(name);

  return result.value.values.map((row) => {
    const get = (key: keyof typeof fields): unknown => {
      const i = idx(fields[key]);
      return i >= 0 ? row[i] : undefined;
    };
    const start = get("start");
    if (start == null) {
      throw new Error(`row missing required '${fields.start}' field`);
    }
    return {
      start: stringifyDate(start),
      end: get("end") ? stringifyDate(get("end")) : undefined,
      color: get("color") ? String(get("color")) : undefined,
      type: get("type") ? String(get("type")) : undefined,
      note: get("note") ? String(get("note")) : undefined,
      wiki: get("wiki") ? String(get("wiki")) : undefined
    };
  });
}

function stringifyDate(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (value instanceof Date) return isoDate(value);
  const v = value as { toISODate?: () => string; toISO?: () => string };
  if (typeof v.toISODate === "function") return v.toISODate();
  if (typeof v.toISO === "function") return v.toISO().slice(0, 10);
  return String(value);
}

function isoDate(d: Date): string {
  const y = String(d.getFullYear()).padStart(4, "0");
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
