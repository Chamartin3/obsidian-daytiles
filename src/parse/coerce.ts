import type { Layout, Shape, AlternationMode } from "daytiles";
import {
  LAYOUT_OPTIONS,
  SHAPE_OPTIONS,
  ALTERNATION_OPTIONS
} from "../constants";
import { pickOption } from "../utils";

export { asNumber, asBoolean } from "../utils";

export function coerceLayout(value: unknown): Layout | undefined {
  return pickOption(LAYOUT_OPTIONS, value, "layout");
}

export function coerceShape(value: unknown): Shape | undefined {
  return pickOption(SHAPE_OPTIONS, value, "shape");
}

export function coerceAlternationMode(value: unknown): AlternationMode | undefined {
  return pickOption(ALTERNATION_OPTIONS, value, "alternation mode");
}
