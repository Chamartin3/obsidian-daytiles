// jsdom does not implement SVG geometry methods. Walk the SVG tree and
// return a bbox computed from the same x/y/width/height attributes the
// daytiles library writes, so render() can call getBBox() without throwing.

function num(v: string | null): number {
  const n = parseFloat(v ?? "");
  return Number.isFinite(n) ? n : 0;
}

function walk(node: Element, bump: (r: number, b: number) => void): void {
  for (const child of Array.from(node.children)) {
    const tag = child.tagName.toLowerCase();
    if (tag === "rect") {
      bump(
        num(child.getAttribute("x")) + num(child.getAttribute("width")),
        num(child.getAttribute("y")) + num(child.getAttribute("height"))
      );
    } else if (tag === "circle") {
      const cx = num(child.getAttribute("cx"));
      const cy = num(child.getAttribute("cy"));
      const r = num(child.getAttribute("r"));
      bump(cx + r, cy + r);
    } else if (tag === "polygon" || tag === "polyline") {
      for (const p of (child.getAttribute("points") ?? "").trim().split(/\s+/)) {
        const [px, py] = p.split(",").map(num);
        bump(px ?? 0, py ?? 0);
      }
    } else if (tag === "text") {
      bump(num(child.getAttribute("x")) + 40, num(child.getAttribute("y")) + 8);
    }
    walk(child, bump);
  }
}

(SVGElement.prototype as unknown as { getBBox: () => DOMRect }).getBBox =
  function getBBox(this: SVGElement): DOMRect {
    let maxX = 0;
    let maxY = 0;
    walk(this, (r, b) => {
      if (r > maxX) maxX = r;
      if (b > maxY) maxY = b;
    });
    return { x: 0, y: 0, width: maxX, height: maxY, top: 0, left: 0, right: maxX, bottom: maxY, toJSON: () => ({}) } as DOMRect;
  };
