import { Plugin } from "obsidian";
import { registerCodeBlock } from "./src/codeBlockProcessor";

export default class DaytilesPlugin extends Plugin {
  async onload(): Promise<void> {
    registerCodeBlock(this);
  }

  async onunload(): Promise<void> {
    /* no-op: registrations are torn down by Obsidian */
  }
}
