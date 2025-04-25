import { Layout } from "@daytiles/settings";
import { Shape } from "@daytiles/shapes";
import { AlternationMode } from "@daytiles/alternation";

export function coerceLayout(value: unknown): Layout | undefined {
  if (value == null) return undefined;
  const v = String(value).toLowerCase();
  switch (v) {
    case "month": return Layout.Month;
    case "week": return Layout.Week;
    case "weekday": return Layout.Weekday;
    case "custom": return Layout.Custom;
  }
  throw new Error(`unknown layout: ${value}`);
}

export function coerceShape(value: unknown): Shape | undefined {
  if (value == null) return undefined;
  const v = String(value).toLowerCase();
  switch (v) {
    case "rect":
    case "square": return Shape.Rect;
    case "rounded":
    case "roundedrect":
    case "rounded-rect": return Shape.RoundedRect;
    case "circle": return Shape.Circle;
    case "diamond": return Shape.Diamond;
  }
  throw new Error(`unknown shape: ${value}`);
}

export function coerceAlternationMode(value: unknown): AlternationMode | undefined {
  if (value == null) return undefined;
  const v = String(value).toLowerCase();
  switch (v) {
    case "none": return AlternationMode.None;
    case "day": return AlternationMode.Day;
    case "week": return AlternationMode.Week;
    case "month": return AlternationMode.Month;
    case "year": return AlternationMode.Year;
    case "custom": return AlternationMode.Custom;
  }
  throw new Error(`unknown alternation mode: ${value}`);
}

export function asNumber(value: unknown, name: string): number | undefined {
  if (value == null) return undefined;
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) throw new Error(`${name} must be a number`);
  return n;
}

export function asBoolean(value: unknown, name: string): boolean | undefined {
  if (value == null) return undefined;
  if (typeof value === "boolean") return value;
  const v = String(value).toLowerCase();
  if (v === "true" || v === "yes") return true;
  if (v === "false" || v === "no") return false;
  throw new Error(`${name} must be true/false`);
}
