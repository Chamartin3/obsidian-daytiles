import { copyFileSync, mkdirSync, existsSync } from "node:fs";

if (!existsSync("dist")) mkdirSync("dist");

for (const f of ["manifest.json", "styles.css"]) {
  copyFileSync(f, `dist/${f}`);
  console.log(`copied ${f} -> dist/${f}`);
}
