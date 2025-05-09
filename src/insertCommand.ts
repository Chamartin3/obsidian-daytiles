import type { Editor } from "obsidian";
import type DaytilesPlugin from "../main";

const SNIPPET = `\`\`\`daytiles
layout: weekday
startDate: 2026-01-01
endDate: 2026-12-31
events:
  - { start: 2026-03-15, color: "#f55", note: Launch }
\`\`\`
`;

export function registerInsertCommand(plugin: DaytilesPlugin): void {
  plugin.addCommand({
    id: "insert-daytiles-block",
    name: "Insert daytiles block",
    editorCallback: (editor: Editor) => {
      editor.replaceSelection(SNIPPET);
    }
  });
}
