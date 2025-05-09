import { Plugin } from "obsidian";
import { registerCodeBlock } from "./src/codeBlockProcessor";
import { DEFAULT_SETTINGS, type DaytilesPluginSettings } from "./src/settings";
import { DaytilesSettingTab } from "./src/settingsTab";
import { registerInsertCommand } from "./src/insertCommand";

export default class DaytilesPlugin extends Plugin {
  settings: DaytilesPluginSettings = DEFAULT_SETTINGS;

  async onload(): Promise<void> {
    await this.loadSettings();
    this.addSettingTab(new DaytilesSettingTab(this.app, this));
    registerCodeBlock(this);
    registerInsertCommand(this);
  }

  async onunload(): Promise<void> {
    /* no-op: registrations are torn down by Obsidian */
  }

  async loadSettings(): Promise<void> {
    const data = (await this.loadData()) as Partial<DaytilesPluginSettings> | null;
    this.settings = {
      ...DEFAULT_SETTINGS,
      ...(data ?? {}),
      defaults: { ...DEFAULT_SETTINGS.defaults, ...(data?.defaults ?? {}) }
    };
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }
}
