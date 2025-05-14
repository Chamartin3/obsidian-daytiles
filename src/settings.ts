import type { DaytilesOptions } from "@daytiles/daytiles";
import { AlternationMode } from "@daytiles/alternation";

export interface DaytilesPluginSettings {
  defaults: DaytilesOptions;
  background: string;
  enableDataview: boolean;
  themeMode: "auto" | "light" | "dark";
}

export const DEFAULT_SETTINGS: DaytilesPluginSettings = {
  defaults: {
    daySize: 16,
    gap: 4,
    startDayOfWeek: 1,
    showLabels: false,
    colors: {
      current: "#ffd54a",
      dayColor: "#3a3a3a",
      pastFade: 0.7,
      futureFade: 1,
      highlightCurrent: true,
      defaultEventColor: "#ff7799",
      alternation: { mode: AlternationMode.Month, color: "#1d2a33", size: 7 }
    }
  },
  background: "#1e1e1e",
  enableDataview: true,
  themeMode: "auto"
};

export function mergeWithDefaults(
  defaults: DaytilesOptions,
  overrides: DaytilesOptions,
): DaytilesOptions {
  const baseColors = defaults.colors ?? {};
  const overrideColors = overrides.colors ?? {};
  return {
    ...defaults,
    ...overrides,
    colors: {
      ...baseColors,
      ...overrideColors,
      alternation: overrideColors.alternation
        ? { ...(baseColors.alternation ?? {}), ...overrideColors.alternation }
        : baseColors.alternation,
      highlight: overrideColors.highlight
        ? { ...(baseColors.highlight ?? { weekdays: {}, months: {} }), ...overrideColors.highlight }
        : baseColors.highlight
    }
  };
}
