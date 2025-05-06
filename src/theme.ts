import type { ColorSettings } from "@daytiles/colors";
import { AlternationMode } from "@daytiles/alternation";

export const LIGHT_PALETTE: Partial<ColorSettings> = {
  current: "#FFD700",
  dayColor: "#eee",
  pastFade: 0.6,
  defaultEventColor: "#ff5577",
  alternation: { mode: AlternationMode.Month, color: "#d2f0fa", size: 7 }
};

export const DARK_PALETTE: Partial<ColorSettings> = {
  current: "#FFB300",
  dayColor: "#3a3a3a",
  pastFade: 0.7,
  defaultEventColor: "#ff7799",
  alternation: { mode: AlternationMode.Month, color: "#1d2a33", size: 7 }
};

export function isObsidianDark(): boolean {
  return document.body.classList.contains("theme-dark");
}

export function paletteFor(mode: "auto" | "light" | "dark"): Partial<ColorSettings> {
  if (mode === "light") return LIGHT_PALETTE;
  if (mode === "dark") return DARK_PALETTE;
  return isObsidianDark() ? DARK_PALETTE : LIGHT_PALETTE;
}
