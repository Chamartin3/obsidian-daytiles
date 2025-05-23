import type { DaytilesOptions } from "daytiles";
import { DEFAULT_CALENDAR_CONFIG } from "./defaults";
import { DEFAULT_PLUGIN_SETTINGS, type ThemeMode } from "../constants";

export interface DaytilesPluginSettings {
  defaults: DaytilesOptions;
  background: string;
  textColor: string;
  enableDataview: boolean;
  themeMode: ThemeMode;
}

export const DEFAULT_SETTINGS: DaytilesPluginSettings = {
  defaults: DEFAULT_CALENDAR_CONFIG,
  ...DEFAULT_PLUGIN_SETTINGS
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
