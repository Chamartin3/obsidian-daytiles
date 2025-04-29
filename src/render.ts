import { MarkdownRenderChild, type MarkdownPostProcessorContext, type Plugin } from "obsidian";
import { Daytiles } from "@daytiles/daytiles";
import { parseOptions } from "./parseOptions";
import { buildOptions } from "./buildOptions";
import { renderError } from "./errors";
import { resolveDataviewEvents } from "./dataview";

const SVG_NS = "http://www.w3.org/2000/svg";

export async function renderBlock(
  source: string,
  el: HTMLElement,
  ctx: MarkdownPostProcessorContext,
  plugin: Plugin,
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

  const dt = new Daytiles(built.options);
  if (built.inlineEvents.length) dt.addEvents(built.inlineEvents);

  if (built.eventsSource?.kind === "dataview") {
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
