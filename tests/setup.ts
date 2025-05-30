import { parseOptions } from "../src/parse/parseOptions";
import { buildOptions } from "../src/parse/buildOptions";

export function build_(yaml: string) {
  return buildOptions(parseOptions(yaml).raw);
}

export function toISO(v: unknown): unknown {
  return v instanceof Date ? v.toISOString().slice(0, 10) : v;
}
