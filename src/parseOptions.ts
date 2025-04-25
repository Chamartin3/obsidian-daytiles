import { load as yamlLoad } from "js-yaml";

export interface ParsedBlock {
  raw: Record<string, unknown>;
}

export function parseOptions(source: string): ParsedBlock {
  const trimmed = source.trim();
  if (!trimmed) return { raw: {} };
  const data = yamlLoad(trimmed);
  if (data == null) return { raw: {} };
  if (typeof data !== "object" || Array.isArray(data)) {
    throw new Error("daytiles: top-level block must be a mapping (key: value pairs).");
  }
  return { raw: data as Record<string, unknown> };
}
