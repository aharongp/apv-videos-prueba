// Lint / render de todas las escenas HyperFrames.
//   node scripts/scenes.mjs lint   [escena-01 ...]
//   node scripts/scenes.mjs render [escena-01 ...]   → clips/9x16/escena-NN.mp4 y clips/16x9/escena-NN.mp4
import { execFileSync } from "node:child_process";
import { readdirSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const [cmd = "lint", ...only] = process.argv.slice(2);
const hf = join(root, "node_modules/.bin/hyperframes");
const scenesDir = join(root, "scenes/hyperframes");
const ids = readdirSync(scenesDir).filter((d) => /^escena-\d\d$/.test(d) && (only.length === 0 || only.includes(d)));
const run = (args, cwd) => execFileSync(hf, args, { cwd, stdio: "inherit" });

for (const id of ids) {
  const dir = join(scenesDir, id);
  if (cmd === "lint") {
    run(["lint"], dir);
  } else if (cmd === "render") {
    for (const [fmt, comp] of [["9x16", "."], ["16x9", "compositions/horizontal.html"]]) {
      mkdirSync(join(root, "clips", fmt), { recursive: true });
      const out = join(root, "clips", fmt, `${id}.mp4`);
      run(["render", "--composition", comp, "--quality", "delivery", "--fps", "30", "--quiet", "--output", out], dir);
      console.log(`✓ ${out}`);
    }
  } else {
    throw new Error(`Comando desconocido: ${cmd}`);
  }
}
