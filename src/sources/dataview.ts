import type DaytilesPlugin from "../main";
import type { DaytilesEventInput } from "daytiles";
import { encodeEventLink } from "../parse/eventLink";
import { DATAVIEW, DATAVIEW_FIELD, EVENT_SOURCE_KIND } from "../constants";

interface DataviewQueryResult {
  successful: boolean;
  value?: { type: "table"; headers: string[]; values: unknown[][] };
  error?: string;
}

interface DataviewApi {
  query(source: string, originFile?: string): Promise<DataviewQueryResult>;
}

interface DataviewSourceSpec {
  kind: typeof EVENT_SOURCE_KIND.dataview;
  query: string;
  fields?: Record<string, string>;
}

const DEFAULT_FIELDS = DATAVIEW_FIELD;

export function getDataviewApi(plugin: DaytilesPlugin): DataviewApi | null {
  const app = plugin.app as unknown as {
    plugins?: { plugins?: Record<string, { api?: DataviewApi }> };
  };
  return app.plugins?.plugins?.[DATAVIEW.pluginId]?.api ?? null;
}

export function waitForDataview(plugin: DaytilesPlugin, timeoutMs = 4000): Promise<DataviewApi | null> {
  const direct = getDataviewApi(plugin);
  if (direct) return Promise.resolve(direct);
  return new Promise((resolve) => {
    let resolved = false;
    const finish = (api: DataviewApi | null) => {
      if (resolved) return;
      resolved = true;
      resolve(api);
    };
    const handler = () => finish(getDataviewApi(plugin));
    plugin.app.workspace.on(DATAVIEW.apiReadyEvent as never, handler);
    setTimeout(() => {
      plugin.app.workspace.off(DATAVIEW.apiReadyEvent as never, handler);
      finish(getDataviewApi(plugin));
    }, timeoutMs);
  });
}

export async function resolveDataviewEvents(
  plugin: DaytilesPlugin,
  spec: DataviewSourceSpec,
  sourcePath: string,
): Promise<DaytilesEventInput[]> {
  const api = await waitForDataview(plugin);
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
      type: get("type") ? String(get("type")) : undefined,
      note: get("note") ? String(get("note")) : undefined,
      wiki: encodeEventLink({
        url: get("url"),
        vault_link: get("vault_link"),
        wiki: get("wiki")
      }),
      weight: get("weight") != null ? Number(get("weight")) : undefined
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
