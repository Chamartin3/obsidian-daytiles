import { PluginSettingTab, Setting, type App } from "obsidian";
import type DaytilesPlugin from "../main";
import { AlternationMode } from "@daytiles/alternation";

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

    const s = this.plugin.settings;
    const colors = (s.defaults.colors ??= {});
    colors.alternation ??= { mode: AlternationMode.Month, color: "#1d2a33", size: 7 };

    const save = () => this.plugin.saveSettings();
    const num = (v: string, fb: number) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : fb;
    };

    new Setting(containerEl)
      .setName("Block background")
      .setDesc("Leave empty for transparent. Per-block override: `background: <css color>`.")
      .addText((t) =>
        t
          .setPlaceholder("transparent")
          .setValue(s.background)
          .onChange(async (v) => {
            s.background = v.trim();
            await save();
          }),
      );

    new Setting(containerEl)
      .setName("Label text color")
      .setDesc("Color for row labels. Empty inherits Obsidian's text color. Per-block override: `textColor: <css color>`.")
      .addText((t) =>
        t
          .setPlaceholder("inherit")
          .setValue(s.textColor)
          .onChange(async (v) => {
            s.textColor = v.trim();
            await save();
          }),
      );

    containerEl.createEl("h3", { text: "Layout" });

    new Setting(containerEl)
      .setName("Day size (px)")
      .addText((t) =>
        t.setValue(String(s.defaults.daySize ?? 16)).onChange(async (v) => {
          s.defaults.daySize = num(v, 16);
          await save();
        }),
      );

    new Setting(containerEl)
      .setName("Gap (px)")
      .addText((t) =>
        t.setValue(String(s.defaults.gap ?? 4)).onChange(async (v) => {
          s.defaults.gap = num(v, 4);
          await save();
        }),
      );

    new Setting(containerEl)
      .setName("Start day of week")
      .setDesc("0 = Sunday, 1 = Monday")
      .addDropdown((dd) =>
        dd
          .addOption("0", "Sunday")
          .addOption("1", "Monday")
          .setValue(String(s.defaults.startDayOfWeek ?? 1))
          .onChange(async (v) => {
            s.defaults.startDayOfWeek = Number(v);
            await save();
          }),
      );

    new Setting(containerEl)
      .setName("Show row labels")
      .addToggle((t) =>
        t.setValue(s.defaults.showLabels ?? false).onChange(async (v) => {
          s.defaults.showLabels = v;
          await save();
        }),
      );

    containerEl.createEl("h3", { text: "Default colors" });

    new Setting(containerEl)
      .setName("Day tile color")
      .addColorPicker((c) =>
        c.setValue(colors.dayColor ?? "#3a3a3a").onChange(async (v) => {
          colors.dayColor = v;
          await save();
        }),
      );

    new Setting(containerEl)
      .setName("Today highlight")
      .addColorPicker((c) =>
        c.setValue(colors.current ?? "#ffd54a").onChange(async (v) => {
          colors.current = v;
          await save();
        }),
      );

    new Setting(containerEl)
      .setName("Default event color")
      .addColorPicker((c) =>
        c.setValue(colors.defaultEventColor ?? "#ff7799").onChange(async (v) => {
          colors.defaultEventColor = v;
          await save();
        }),
      );

    new Setting(containerEl)
      .setName("Past fade")
      .setDesc("Brightness multiplier for past days (0–1).")
      .addText((t) =>
        t.setValue(String(colors.pastFade ?? 0.7)).onChange(async (v) => {
          colors.pastFade = num(v, 0.7);
          await save();
        }),
      );

    new Setting(containerEl)
      .setName("Future fade")
      .setDesc("Brightness multiplier for future days (0–1).")
      .addText((t) =>
        t.setValue(String(colors.futureFade ?? 1)).onChange(async (v) => {
          colors.futureFade = num(v, 1);
          await save();
        }),
      );

    containerEl.createEl("h3", { text: "Alternation band" });

    new Setting(containerEl)
      .setName("Mode")
      .addDropdown((dd) =>
        dd
          .addOption(AlternationMode.None, "None")
          .addOption(AlternationMode.Day, "Day")
          .addOption(AlternationMode.Week, "Week")
          .addOption(AlternationMode.Month, "Month")
          .addOption(AlternationMode.Year, "Year")
          .addOption(AlternationMode.Custom, "Custom")
          .setValue(colors.alternation!.mode)
          .onChange(async (v) => {
            colors.alternation!.mode = v as AlternationMode;
            await save();
          }),
      );

    new Setting(containerEl)
      .setName("Alternation color")
      .addColorPicker((c) =>
        c.setValue(colors.alternation!.color).onChange(async (v) => {
          colors.alternation!.color = v;
          await save();
        }),
      );

    new Setting(containerEl)
      .setName("Alternation size")
      .setDesc("Only used for `Custom` mode (days per band).")
      .addText((t) =>
        t.setValue(String(colors.alternation!.size ?? 7)).onChange(async (v) => {
          colors.alternation!.size = num(v, 7);
          await save();
        }),
      );

    containerEl.createEl("h3", { text: "Integrations" });

    new Setting(containerEl)
      .setName("Theme mode")
      .setDesc("Auto picks light or dark palette from Obsidian's theme.")
      .addDropdown((dd) =>
        dd
          .addOption("auto", "Auto")
          .addOption("light", "Light")
          .addOption("dark", "Dark")
          .setValue(s.themeMode)
          .onChange(async (v) => {
            s.themeMode = v as "auto" | "light" | "dark";
            await save();
          }),
      );

    new Setting(containerEl)
      .setName("Enable Dataview event source")
      .addToggle((t) =>
        t.setValue(s.enableDataview).onChange(async (v) => {
          s.enableDataview = v;
          await save();
        }),
      );
  }
}
