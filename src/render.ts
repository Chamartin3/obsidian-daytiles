import { MarkdownRenderChild, type MarkdownPostProcessorContext } from "obsidian";
import type DaytilesPlugin from "../main";
import { Daytiles } from "@daytiles/daytiles";
import { parseOptions } from "./parseOptions";
import { buildOptions } from "./buildOptions";
import { renderError } from "./errors";
import { resolveDataviewEvents } from "./dataview";
import { mergeWithDefaults } from "./settings";

const SVG_NS = "http://www.w3.org/2000/svg";

export async function renderBlock(
  source: string,
  el: HTMLElement,
  ctx: MarkdownPostProcessorContext,
  plugin: DaytilesPlugin,
): Promise<void> {
  el.empty();
  el.addClass("daytiles-block");

  let parsed;
  try {
    parsed = parseOptions(source);
  } catch (err: unknown) {
    return renderError(el, "daytiles: failed to parse block", String((err as Error).message));
  }

  let built;
  try {
    built = buildOptions(parsed.raw);
  } catch (err: unknown) {
    return renderError(el, "daytiles: invalid options", String((err as Error).message));
  }

  const child = new MarkdownRenderChild(el);
  ctx.addChild(child);

  const merged = mergeWithDefaults(plugin.settings.defaults, built.options);
  const dt = new Daytiles(merged);
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

  const svg = document.createElementNS(SVG_NS, "svg");
  el.appendChild(svg);
  try {
    dt.render(svg);
  } catch (err: unknown) {
    return renderError(el, "daytiles: render failed", String((err as Error).message));
  }
}
