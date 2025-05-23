import { CSS_CLASS } from "../constants";

export function renderError(el: HTMLElement, message: string, hint?: string): void {
  el.empty();
  const box = el.createDiv({ cls: CSS_CLASS.error });
  box.setText(message);
  if (hint) {
    el.createDiv({ cls: CSS_CLASS.hint, text: hint });
  }
}
