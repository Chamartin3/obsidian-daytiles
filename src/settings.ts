import type { DaytilesOptions } from "@daytiles/daytiles";

export interface DaytilesPluginSettings {
  defaults: DaytilesOptions;
  enableDataview: boolean;
  themeMode: "auto" | "light" | "dark";
}

export const DEFAULT_SETTINGS: DaytilesPluginSettings = {
  defaults: {
    daySize: 16,
    gap: 4,
    startDayOfWeek: 1,
    showLabels: false
  },
  enableDataview: true,
  themeMode: "auto"
};

export function mergeWithDefaults(
  defaults: DaytilesOptions,
  overrides: DaytilesOptions,
): DaytilesOptions {
  return {
    ...defaults,
    ...overrides,
    colors: {
      ...(defaults.colors ?? {}),
      ...(overrides.colors ?? {})
    }
  };
}
