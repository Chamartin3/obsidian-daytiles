import type { DaytilesOptions } from "@daytiles/daytiles";
import { AlternationMode } from "@daytiles/alternation";

export interface DaytilesPluginSettings {
  defaults: DaytilesOptions;
  background: string;
  textColor: string;
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
      current: "#ffcf3a",
      dayColor: "#dcdcdc",
      pastFade: 0.85,
      futureFade: 1,
      highlightCurrent: true,
      defaultEventColor: "#ff7799",
      alternation: { mode: AlternationMode.Month, color: "#f0f3f7", size: 7 }
    }
  },
  background: "",
  textColor: "",
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
