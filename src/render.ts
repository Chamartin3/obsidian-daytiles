import { MarkdownRenderChild, type MarkdownPostProcessorContext } from "obsidian";
import type DaytilesPlugin from "../main";
import { Daytiles } from "@daytiles/daytiles";
import { parseOptions } from "./parseOptions";
import { buildOptions } from "./buildOptions";
import { renderError } from "./errors";
import { resolveDataviewEvents } from "./dataview";
import { mergeWithDefaults } from "./settings";
import { paletteFor } from "./theme";

const SVG_NS = "http://www.w3.org/2000/svg";

export async function renderBlock(
  source: string,
  el: HTMLElement,
  ctx: MarkdownPostProcessorContext,
  plugin: DaytilesPlugin,
): Promise<void> {
  el.empty();
  el.addClass("daytiles-block");
  el.style.padding = "0.6em";
  el.style.borderRadius = "6px";
  el.style.background = plugin.settings.background || "transparent";
  if (plugin.settings.textColor) el.style.setProperty("--daytiles-text", plugin.settings.textColor);

  let parsed;
  try {
    parsed = parseOptions(source);
  } catch (err: unknown) {
    console.error("[daytiles] parse error", err);
    return renderError(el, "daytiles: failed to parse block", String((err as Error).message));
  }

  let built;
  try {
    built = buildOptions(parsed.raw);
  } catch (err: unknown) {
    console.error("[daytiles] options error", err, parsed.raw);
    return renderError(el, "daytiles: invalid options", String((err as Error).message));
  }

  const child = new MarkdownRenderChild(el);
  ctx.addChild(child);

  const palette = paletteFor(plugin.settings.themeMode);
  const themed = {
    ...plugin.settings.defaults,
    colors: { ...palette, ...(plugin.settings.defaults.colors ?? {}) }
  };
  const merged = mergeWithDefaults(themed, built.options);
  if (built.background) el.style.background = built.background;
  if (built.textColor) el.style.setProperty("--daytiles-text", built.textColor);
  const dt = new Daytiles(merged);
  dt.onTileClick(({ event }) => {
    if (event?.wiki) {
      plugin.app.workspace.openLinkText(event.wiki, ctx.sourcePath, false);
    }
  });
  if (built.inlineEvents.length) dt.addEvents(built.inlineEvents);

  if (built.eventsSource?.kind === "dataview") {
    if (!plugin.settings.enableDataview) {
      return renderError(el, "daytiles: dataview source disabled in settings");
    }
    try {
      const events = await resolveDataviewEvents(plugin, built.eventsSource, ctx.sourcePath);
      if (events.length) dt.addEvents(events);
    } catch (err: unknown) {
      return renderError(el, "daytiles: dataview query failed", String((err as Error).message));
    }
  }

  const svg = document.createElementNS(SVG_NS, "svg") as SVGSVGElement;
  svg.setAttribute("xmlns", SVG_NS);
  el.appendChild(svg);

  console.log("[daytiles] block starting", {
    inlineEvents: built.inlineEvents.length,
    eventsSource: built.eventsSource?.kind ?? "inline",
    merged: simplify(merged)
  });

  const doRender = () => {
    try {
      dt.render(svg);
    } catch (err: unknown) {
      console.error("[daytiles] render error", err, merged);
      renderError(el, "daytiles: render failed", String((err as Error).message));
      return;
    }
    fixupSvgDimensions(svg);
    const w = svg.getAttribute("width");
    const h = svg.getAttribute("height");
    console.log("[daytiles] rendered", {
      childCount: svg.childElementCount,
      width: w,
      height: h
    });
    if (svg.childElementCount === 0) {
      renderError(
        el,
        "daytiles: render produced an empty SVG",
        "Check that startDate <= endDate and that layout/options are valid. " +
          `parsed: ${JSON.stringify(simplify(merged))}`,
      );
    } else if (!w || !h || w === "0" || h === "0") {
      renderError(
        el,
        "daytiles: SVG has zero dimensions",
        `${svg.childElementCount} children drawn but bbox came back empty. parsed: ${JSON.stringify(simplify(merged))}`,
      );
    }
  };

  if (svg.isConnected) {
    requestAnimationFrame(doRender);
  } else {
    doRender();
  }
}

function fixupSvgDimensions(svg: SVGSVGElement): void {
  const w = parseFloat(svg.getAttribute("width") ?? "0");
  const h = parseFloat(svg.getAttribute("height") ?? "0");
  if (w > 0 && h > 0) return;

  let maxX = 0;
  let maxY = 0;
  const bump = (right: number, bottom: number): void => {
    if (right > maxX) maxX = right;
    if (bottom > maxY) maxY = bottom;
  };

  for (const node of Array.from(svg.children) as SVGElement[]) {
    visitForBounds(node, bump);
  }

  if (maxX > 0 && maxY > 0) {
    const W = Math.ceil(maxX) + 1;
    const H = Math.ceil(maxY) + 1;
    svg.setAttribute("width", String(W));
    svg.setAttribute("height", String(H));
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.style.maxWidth = "100%";
    svg.style.height = "auto";
  }
}

function visitForBounds(node: SVGElement, bump: (r: number, b: number) => void): void {
  const tag = node.tagName.toLowerCase();
  if (tag === "g" || tag === "svg") {
    for (const child of Array.from(node.children) as SVGElement[]) {
      visitForBounds(child, bump);
    }
    return;
  }
  if (tag === "rect") {
    const x = num(node.getAttribute("x"));
    const y = num(node.getAttribute("y"));
    const w = num(node.getAttribute("width"));
    const h = num(node.getAttribute("height"));
    bump(x + w, y + h);
    return;
  }
  if (tag === "circle") {
    const cx = num(node.getAttribute("cx"));
    const cy = num(node.getAttribute("cy"));
    const r = num(node.getAttribute("r"));
    bump(cx + r, cy + r);
    return;
  }
  if (tag === "polygon" || tag === "polyline") {
    const points = (node.getAttribute("points") ?? "").trim().split(/\s+/);
    for (const p of points) {
      const [px, py] = p.split(",").map(num);
      bump(px ?? 0, py ?? 0);
    }
    return;
  }
  if (tag === "text") {
    const x = num(node.getAttribute("x"));
    const y = num(node.getAttribute("y"));
    bump(x + 40, y + 8); // text width is unknown; reserve a sensible margin
    return;
  }
}

function num(value: string | null | undefined): number {
  const n = parseFloat(value ?? "0");
  return Number.isFinite(n) ? n : 0;
}

function simplify(value: unknown, depth = 0): unknown {
  if (depth > 3) return "...";
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.slice(0, 5).map((v) => simplify(v, depth + 1));
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    out[k] = simplify(v, depth + 1);
  }
  return out;
}
