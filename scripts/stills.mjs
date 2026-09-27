// Renderiza fotogramas sueltos para revisión rápida: node scripts/stills.mjs 30 400 900 ...
// COMPOSITION=CarsVSLEn para la versión en inglés.
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { mkdirSync } from "node:fs";
import path from "node:path";

const frames = process.argv.slice(2).map(Number);
const outDir = path.resolve(process.env.STILLS_DIR || "out/stills");
mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE || null;
const composition = await selectComposition({ serveUrl, id: process.env.COMPOSITION || "CarsVSL", browserExecutable });
for (const frame of frames) {
  const output = path.join(outDir, `f${String(frame).padStart(5, "0")}.jpg`);
  await renderStill({ serveUrl, composition, frame, output, imageFormat: "jpeg", jpegQuality: 80, browserExecutable, scale: 0.5 });
  console.log(output);
}
