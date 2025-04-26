import type { DaytilesOptions, DaytilesEventInput } from "@daytiles/daytiles";
import type { ColorSettings, ColorHighlights } from "@daytiles/colors";
import type { AlternationSettings } from "@daytiles/alternation";
import {
  coerceLayout,
  coerceShape,
  coerceAlternationMode,
  asNumber,
  asBoolean
} from "./coerce";

type Raw = Record<string, unknown>;

export interface BuiltBlock {
  options: DaytilesOptions;
  inlineEvents: DaytilesEventInput[];
  eventsSource?: { kind: "dataview"; query: string; fields?: Record<string, string> };
}

export function buildOptions(raw: Raw): BuiltBlock {
  const options: DaytilesOptions = {};

  if ("layout" in raw) options.layout = coerceLayout(raw.layout);
  if ("shape" in raw) options.shape = coerceShape(raw.shape);
  if ("startDate" in raw) options.startDate = raw.startDate as string;
  if ("endDate" in raw) options.endDate = raw.endDate as string;
  if ("year" in raw) options.year = asNumber(raw.year, "year") ?? null;
  if ("daySize" in raw) options.daySize = asNumber(raw.daySize, "daySize");
  if ("gap" in raw) options.gap = asNumber(raw.gap, "gap");
  if ("startDayOfWeek" in raw)
    options.startDayOfWeek = asNumber(raw.startDayOfWeek, "startDayOfWeek");
  if ("daysPerRow" in raw) options.daysPerRow = asNumber(raw.daysPerRow, "daysPerRow");
  if ("showLabels" in raw) options.showLabels = asBoolean(raw.showLabels, "showLabels");
  if ("labelWidth" in raw) options.labelWidth = asNumber(raw.labelWidth, "labelWidth");

  if ("colors" in raw && raw.colors && typeof raw.colors === "object") {
    options.colors = buildColors(raw.colors as Raw);
  }

  const inlineEvents: DaytilesEventInput[] = [];
  let eventsSource: BuiltBlock["eventsSource"];

  if ("events" in raw) {
    const ev = raw.events;
    if (Array.isArray(ev)) {
      for (const e of ev) inlineEvents.push(parseEvent(e));
    } else if (ev && typeof ev === "object") {
      const evObj = ev as Raw;
      if (evObj.source === "dataview") {
        eventsSource = {
          kind: "dataview",
          query: String(evObj.query ?? ""),
          fields: (evObj.fields ?? undefined) as Record<string, string> | undefined
        };
      } else {
        throw new Error("events must be a list, or { source: dataview, query: ... }");
      }
    }
  }

  return { options, inlineEvents, eventsSource };
}

function buildColors(raw: Raw): Partial<ColorSettings> {
  const colors: Partial<ColorSettings> = {};

  if ("current" in raw) colors.current = String(raw.current);
  if ("dayColor" in raw) colors.dayColor = String(raw.dayColor);
  if ("pastFade" in raw) colors.pastFade = asNumber(raw.pastFade, "colors.pastFade")!;
  if ("futureFade" in raw) colors.futureFade = asNumber(raw.futureFade, "colors.futureFade")!;
  if ("highlightCurrent" in raw)
    colors.highlightCurrent = asBoolean(raw.highlightCurrent, "colors.highlightCurrent")!;
  if ("defaultEventColor" in raw) colors.defaultEventColor = String(raw.defaultEventColor);
  if ("eventTypeColors" in raw && raw.eventTypeColors && typeof raw.eventTypeColors === "object") {
    colors.eventTypeColors = { ...(raw.eventTypeColors as Record<string, string>) };
  }
  if ("alternation" in raw && raw.alternation && typeof raw.alternation === "object") {
    const a = raw.alternation as Raw;
    const built: Partial<AlternationSettings> = {};
    if ("mode" in a) built.mode = coerceAlternationMode(a.mode);
    if ("color" in a) built.color = String(a.color);
    if ("size" in a) built.size = asNumber(a.size, "colors.alternation.size");
    colors.alternation = built as AlternationSettings;
  }
  if ("highlight" in raw && raw.highlight && typeof raw.highlight === "object") {
    const h = raw.highlight as Raw;
    const built: ColorHighlights = { weekdays: {}, months: {} };
    if (h.weekdays && typeof h.weekdays === "object") {
      built.weekdays = { ...(h.weekdays as Record<number, string>) };
    }
    if (h.months && typeof h.months === "object") {
      built.months = { ...(h.months as Record<number, string>) };
    }
    colors.highlight = built;
  }

  return colors;
}

function parseEvent(input: unknown): DaytilesEventInput {
  if (!input || typeof input !== "object") {
    throw new Error("each event must be a mapping");
  }
  const e = input as Raw;
  if (!e.start) throw new Error("event missing 'start'");
  return {
    start: e.start as string,
    end: e.end as string | undefined,
    color: e.color as string | undefined,
    type: e.type as string | undefined,
    note: e.note as string | undefined,
    wiki: e.wiki as string | undefined
  };
}
