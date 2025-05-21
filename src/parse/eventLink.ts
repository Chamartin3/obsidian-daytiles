export interface EventLink {
  kind: "vault" | "url";
  target: string;
}

export function encodeEventLink(
  raw: { vault_link?: unknown; url?: unknown; wiki?: unknown },
): string | undefined {
  if (raw.url != null) return `url:${String(raw.url)}`;
  if (raw.vault_link != null) return `vault:${String(raw.vault_link)}`;
  if (raw.wiki != null) return `vault:${String(raw.wiki)}`;
  return undefined;
}

export function decodeEventLink(encoded: string | undefined): EventLink | null {
  if (!encoded) return null;
  if (encoded.startsWith("url:")) return { kind: "url", target: encoded.slice(4) };
  if (encoded.startsWith("vault:")) return { kind: "vault", target: encoded.slice(6) };
  return { kind: "vault", target: encoded };
}
