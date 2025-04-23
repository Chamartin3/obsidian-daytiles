import type { Plugin } from "obsidian";
import { renderBlock } from "./render";

export function registerCodeBlock(plugin: Plugin): void {
  plugin.registerMarkdownCodeBlockProcessor("daytiles", (source, el, ctx) => {
    return renderBlock(source, el, ctx, plugin);
  });
}
