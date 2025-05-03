import type DaytilesPlugin from "../main";
import { renderBlock } from "./render";

export function registerCodeBlock(plugin: DaytilesPlugin): void {
  plugin.registerMarkdownCodeBlockProcessor("daytiles", (source, el, ctx) => {
    return renderBlock(source, el, ctx, plugin);
  });
}
