import {
  BaseCalendarSettings,
  AlternationMode,
  type CalendarSettings,
  type ColorSettings
} from "daytiles";
import { DEFAULT_COLOR, DEFAULT_DISPLAY } from "../constants";

const DEFAULT_COLORS: ColorSettings = {
  ...BaseCalendarSettings.colors,
  current: DEFAULT_COLOR.current,
  dayColor: DEFAULT_COLOR.day,
  pastFade: DEFAULT_DISPLAY.pastFade,
  futureFade: DEFAULT_DISPLAY.futureFade,
  highlightCurrent: DEFAULT_DISPLAY.highlightCurrent,
  defaultEventColor: DEFAULT_COLOR.defaultEvent,
  alternation: {
    mode: AlternationMode.None,
    color: DEFAULT_COLOR.alternation,
    size: DEFAULT_DISPLAY.alternationSize
  }
};

export const DEFAULT_CALENDAR_CONFIG: CalendarSettings = {
  ...BaseCalendarSettings,
  daySize: DEFAULT_DISPLAY.daySize,
  gap: DEFAULT_DISPLAY.gap,
  startDayOfWeek: DEFAULT_DISPLAY.startDayOfWeek,
  showLabels: DEFAULT_DISPLAY.showLabels,
  colors: DEFAULT_COLORS
};
