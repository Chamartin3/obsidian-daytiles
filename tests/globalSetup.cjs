const { buildSync } = require("esbuild");
const { mkdirSync } = require("node:fs");
const { join } = require("node:path");

module.exports = function bundleDaytiles() {
  const cache = join(__dirname, ".cache");
  mkdirSync(cache, { recursive: true });
  buildSync({
    entryPoints: [join(__dirname, "..", "node_modules", "daytiles", "dist", "index.js")],
    bundle: true,
    format: "cjs",
    platform: "neutral",
    mainFields: ["module", "main"],
    conditions: ["import"],
    target: "es2020",
    outfile: join(cache, "daytiles.cjs"),
    logLevel: "silent"
  });
};
