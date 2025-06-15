#!/usr/bin/env node
import { readFileSync, readdirSync, statSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import { load as yamlLoad } from "js-yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repo = join(__dirname, "..");
const tmpDir = join(repo, "dist", ".verify");
mkdirSync(tmpDir, { recursive: true });

const entry = join(tmpDir, "entry.ts");
writeFileSync(
  entry,
  `import { parseOptions } from "${repo}/src/parse/parseOptions";
import { buildOptions } from "${repo}/src/parse/buildOptions";
import { Daytiles } from "daytiles";
export function verify(src: string): void {
  const parsed = parseOptions(src);
  const built = buildOptions(parsed.raw);
  const dt = new Daytiles(built.options);
  if (built.inlineEvents.length) dt.addEvents(built.inlineEvents);
}
`
);

const out = join(tmpDir, "verify.cjs");
await build({
  entryPoints: [entry],
  outfile: out,
  bundle: true,
  platform: "node",
  format: "cjs",
  logLevel: "silent"
});

const { verify } = await import(out);

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) yield* walk(p);
    else if (name.endsWith(".md")) yield p;
  }
}

function extractBlocks(md) {
  const re = /```daytiles\n([\s\S]*?)```/g;
  const blocks = [];
  let m;
  while ((m = re.exec(md)) !== null) blocks.push(m[1]);
  return blocks;
}

const roots = process.argv.slice(2);
if (roots.length === 0) {
  console.error("usage: verify-examples.mjs <path> [<path>...]");
  process.exit(2);
}

let total = 0;
let failed = 0;

for (const root of roots) {
  const files = statSync(root).isDirectory() ? [...walk(root)] : [root];
  for (const file of files) {
    const md = readFileSync(file, "utf8");
    const blocks = extractBlocks(md);
    blocks.forEach((src, i) => {
      total++;
      try {
        verify(src);
      } catch (err) {
        failed++;
        console.error(`\nFAIL ${file} block #${i + 1}: ${err.message}`);
        console.error(src.split("\n").map((l) => "    " + l).join("\n"));
      }
    });
  }
}

rmSync(tmpDir, { recursive: true, force: true });
console.log(`\n${total - failed}/${total} blocks ok`);
process.exit(failed === 0 ? 0 : 1);
