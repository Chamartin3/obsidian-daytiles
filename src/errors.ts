export function renderError(el: HTMLElement, message: string, hint?: string): void {
  el.empty();
  const box = el.createDiv({ cls: "daytiles-error" });
  box.setText(message);
  if (hint) {
    el.createDiv({ cls: "daytiles-hint", text: hint });
  }
}
