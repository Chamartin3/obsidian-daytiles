import { copyFileSync, mkdirSync, existsSync, writeFileSync } from "node:fs";

if (!existsSync("dist")) mkdirSync("dist");

for (const f of ["manifest.json", "styles.css"]) {
  copyFileSync(f, `dist/${f}`);
  console.log(`copied ${f} -> dist/${f}`);
}

if (!existsSync("dist/.hotreload")) {
  writeFileSync("dist/.hotreload", "");
  console.log("created dist/.hotreload");
}
