import { BOOLEAN_OPTIONS, CSS_CLASS } from "./constants";

export function pickOption<T>(
  table: Record<string, T>,
  value: unknown,
  label: string
): T | undefined {
  if (value == null) return undefined;
  const key = String(value).toLowerCase();
  const hit = table[key];
  if (hit === undefined) throw new Error(`unknown ${label}: ${value}`);
  return hit;
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
  const hit = BOOLEAN_OPTIONS[String(value).toLowerCase()];
  if (hit === undefined) throw new Error(`${name} must be true/false`);
  return hit;
}

export function applyClass(el: HTMLElement, cls: keyof typeof CSS_CLASS): void {
  el.addClass(CSS_CLASS[cls]);
}

export function createChild(
  parent: HTMLElement,
  cls: keyof typeof CSS_CLASS,
  text?: string
): HTMLDivElement {
  const child = parent.createDiv({ cls: CSS_CLASS[cls] });
  if (text != null) child.setText(text);
  return child;
}
