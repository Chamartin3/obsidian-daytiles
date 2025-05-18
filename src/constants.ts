import { Layout, Shape, AlternationMode } from "daytiles";

export const PLUGIN_NAME = "daytiles";

export const CODE_BLOCK_LANGUAGE = "daytiles";

export const CSS_CLASS = {
  block: "DayTilesContainer",
  day: "DayTiles--day",
  dayPast: "DayTiles--day--past",
  dayPresent: "DayTiles--day--present",
  dayFuture: "DayTiles--day--future",
  rowLabel: "DayTiles--rowLabel",
  tooltip: "DayTiles--tooltip",
  error: "DayTiles--error",
  hint: "DayTiles--hint"
} as const;

export const CSS_VAR = {
  textColor: "--DayTiles-text"
} as const;

export const COMMAND_ID = {
  insertBlock: "insert-daytiles-block"
} as const;

export const DATAVIEW = {
  pluginId: "dataview",
  apiReadyEvent: "dataview:api-ready"
} as const;

export const EVENT_LINK_KIND = {
  vault: "vault",
  url: "url"
} as const;
export type EventLinkKind = (typeof EVENT_LINK_KIND)[keyof typeof EVENT_LINK_KIND];

export const EVENT_LINK_PREFIX: Record<EventLinkKind, string> = {
  [EVENT_LINK_KIND.vault]: "vault:",
  [EVENT_LINK_KIND.url]: "url:"
};

export const EVENT_SOURCE_KIND = {
  dataview: "dataview"
} as const;
export type EventSourceKind = (typeof EVENT_SOURCE_KIND)[keyof typeof EVENT_SOURCE_KIND];

export const DATAVIEW_FIELD = {
  start: "start",
  end: "end",
  type: "type",
  note: "note",
  wiki: "wiki",
  vault_link: "vault_link",
  url: "url",
  weight: "weight"
} as const;
export type DataviewField = keyof typeof DATAVIEW_FIELD;

export const THEME_MODE = {
  auto: "auto",
  light: "light",
  dark: "dark"
} as const;
export type ThemeMode = (typeof THEME_MODE)[keyof typeof THEME_MODE];

export interface DataviewFieldMap extends Record<DataviewField, string> {}

export interface DataviewSourceSpec {
  kind: typeof EVENT_SOURCE_KIND.dataview;
  query: string;
  fields?: Partial<DataviewFieldMap>;
}

export function buildInsertBlockSnippet(today: Date = new Date()): string {
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");
  return `\`\`\`daytiles
layout: weekday
startDate: ${y}-01-01
endDate: ${y}-12-31
events:
  - { start: ${y}-${m}-${d}, type: launch, note: Today }
\`\`\`
`;
}

export const DEFAULT_COLOR = {
  current: "#ffcf3a",
  day: "#dcdcdc",
  defaultEvent: "#ff7799",
  alternation: "#cfe3f3"
} as const;

export const DEFAULT_DISPLAY = {
  daySize: 16,
  gap: 4,
  startDayOfWeek: 1,
  showLabels: false,
  pastFade: 0.5,
  futureFade: 1,
  highlightCurrent: true,
  alternationSize: 7
} as const;

export const DEFAULT_PLUGIN_SETTINGS = {
  background: "",
  textColor: "",
  enableDataview: true,
  themeMode: THEME_MODE.auto
} as const;

export const BLOCK_FRAME = {
  padding: "0.6em",
  borderRadius: "6px",
  background: "transparent"
} as const;

export const LIGHT_PALETTE = {
  current: "#FFD700",
  dayColor: "#eee",
  pastFade: 0.6,
  defaultEventColor: "#ff5577",
  alternationColor: "#d2f0fa"
} as const;

export const DARK_PALETTE = {
  current: "#FFB300",
  dayColor: "#3a3a3a",
  pastFade: 0.7,
  defaultEventColor: "#ff7799",
  alternationColor: "#1d2a33"
} as const;

export const SETTINGS_PLACEHOLDER = {
  background: "transparent",
  textColor: "inherit"
} as const;

export const START_DAY_OF_WEEK = {
  sunday: 0,
  monday: 1
} as const;

export const LAYOUT_OPTIONS: Record<string, Layout> = {
  month: Layout.Month,
  week: Layout.Week,
  weekday: Layout.Weekday,
  custom: Layout.Custom
};

export const SHAPE_OPTIONS: Record<string, Shape> = {
  rect: Shape.Rect,
  square: Shape.Rect,
  rounded: Shape.RoundedRect,
  roundedrect: Shape.RoundedRect,
  "rounded-rect": Shape.RoundedRect,
  circle: Shape.Circle,
  diamond: Shape.Diamond
};

export const ALTERNATION_OPTIONS: Record<string, AlternationMode> = {
  none: AlternationMode.None,
  day: AlternationMode.Day,
  week: AlternationMode.Week,
  month: AlternationMode.Month,
  year: AlternationMode.Year,
  custom: AlternationMode.Custom
};

export const BOOLEAN_OPTIONS: Record<string, boolean> = {
  true: true,
  yes: true,
  false: false,
  no: false
};
