import type { Editor } from "obsidian";
import type DaytilesPlugin from "../main";
import { COMMAND_ID, buildInsertBlockSnippet } from "../constants";

export function registerInsertCommand(plugin: DaytilesPlugin): void {
  plugin.addCommand({
    id: COMMAND_ID.insertBlock,
    name: "Insert daytiles block",
    editorCallback: (editor: Editor) => {
      editor.replaceSelection(buildInsertBlockSnippet());
    }
  });
}
