import type { ColorSettings } from "daytiles";
import { AlternationMode } from "daytiles";
import {
  LIGHT_PALETTE,
  DARK_PALETTE,
  DEFAULT_DISPLAY,
  THEME_MODE,
  type ThemeMode
} from "../constants";

function palette(p: typeof LIGHT_PALETTE | typeof DARK_PALETTE): Partial<ColorSettings> {
  return {
    current: p.current,
    dayColor: p.dayColor,
    pastFade: p.pastFade,
    defaultEventColor: p.defaultEventColor,
    alternation: {
      mode: AlternationMode.None,
      color: p.alternationColor,
      size: DEFAULT_DISPLAY.alternationSize
    }
  };
}

export function isObsidianDark(): boolean {
  return document.body.classList.contains("theme-dark");
}

export function paletteFor(mode: ThemeMode): Partial<ColorSettings> {
  if (mode === THEME_MODE.light) return palette(LIGHT_PALETTE);
  if (mode === THEME_MODE.dark) return palette(DARK_PALETTE);
  return isObsidianDark() ? palette(DARK_PALETTE) : palette(LIGHT_PALETTE);
}
