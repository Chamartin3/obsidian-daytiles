# Daytiles examples vault

A self-contained Obsidian vault that demos every feature of the Daytiles
plugin. Open the folder above (`examples-vault/`) directly in Obsidian as a
vault.

## Bootstrap

From the repo root:

```sh
npm install
npm run examples:bootstrap
```

That builds the plugin and installs it into `.obsidian/plugins/daytiles/`
(symlinked on POSIX, copied on Windows). After it finishes, open this folder
as a vault in Obsidian.

If you also want the **Dataview source** example in note 03 to render data,
install the [Dataview](https://blacksmithgu.github.io/obsidian-dataview/)
plugin from the community plugin store and reload.

## Reading order

Notes are numbered. Read top to bottom — each one builds on the previous.

| #   | Note            | Covers                                                  |
| --- | --------------- | ------------------------------------------------------- |
| 00  | Start here      | how this vault works                                    |
| 01  | Layouts         | month / week / weekday / custom                         |
| 02  | Shapes          | rect / rounded / circle / diamond + colors / highlights |
| 03  | Events          | inline / Dataview / heatmap / click-through actions     |

## Anchored dates

All examples are anchored to **2026** so the past/future fade looks consistent
no matter when you open the vault. Edit `startDate` / `endDate` in any block
to shift the range relative to today.
