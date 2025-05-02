import { PluginSettingTab, Setting, type App } from "obsidian";
import type DaytilesPlugin from "../main";

export class DaytilesSettingTab extends PluginSettingTab {
  plugin: DaytilesPlugin;

  constructor(app: App, plugin: DaytilesPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Daytiles defaults" });

    new Setting(containerEl)
      .setName("Default day size (px)")
      .setDesc("Tile edge size used when a block doesn't specify one.")
      .addText((text) =>
        text
          .setValue(String(this.plugin.settings.defaults.daySize ?? 16))
          .onChange(async (value) => {
            const n = Number(value);
            if (Number.isFinite(n)) {
              this.plugin.settings.defaults.daySize = n;
              await this.plugin.saveSettings();
            }
          }),
      );

    new Setting(containerEl)
      .setName("Default gap (px)")
      .addText((text) =>
        text
          .setValue(String(this.plugin.settings.defaults.gap ?? 4))
          .onChange(async (value) => {
            const n = Number(value);
            if (Number.isFinite(n)) {
              this.plugin.settings.defaults.gap = n;
              await this.plugin.saveSettings();
            }
          }),
      );

    new Setting(containerEl)
      .setName("Start day of week")
      .setDesc("0 = Sunday, 1 = Monday")
      .addDropdown((dd) =>
        dd
          .addOption("0", "Sunday")
          .addOption("1", "Monday")
          .setValue(String(this.plugin.settings.defaults.startDayOfWeek ?? 1))
          .onChange(async (value) => {
            this.plugin.settings.defaults.startDayOfWeek = Number(value);
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Theme mode")
      .setDesc("Picks default palette. 'Auto' follows Obsidian's theme.")
      .addDropdown((dd) =>
        dd
          .addOption("auto", "Auto")
          .addOption("light", "Light")
          .addOption("dark", "Dark")
          .setValue(this.plugin.settings.themeMode)
          .onChange(async (value) => {
            this.plugin.settings.themeMode = value as "auto" | "light" | "dark";
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Enable Dataview event source")
      .setDesc("Allow blocks to populate events from a Dataview query.")
      .addToggle((t) =>
        t.setValue(this.plugin.settings.enableDataview).onChange(async (value) => {
          this.plugin.settings.enableDataview = value;
          await this.plugin.saveSettings();
        }),
      );
  }
}
