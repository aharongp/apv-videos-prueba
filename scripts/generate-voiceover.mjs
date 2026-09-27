// Mide la locución de cada escena (public/audio/vo/<id>.wav) y escribe src/data/durations.json
// para que Remotion ajuste el timing. La locución final se genera con Seed Audio (ver README);
// sin argumentos, este script genera una voz local de respaldo con el TTS de HyperFrames (Kokoro-82M).
//
// Requisitos: python con `kokoro-onnx soundfile` (ver README) y
// HYPERFRAMES_PYTHON apuntando a ese python si no es el del sistema.
//
// Uso: node scripts/generate-voiceover.mjs [idEscena ...]
//      node scripts/generate-voiceover.mjs --probe   (solo mide WAVs existentes, p. ej. de un locutor)
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const script = JSON.parse(readFileSync(join(root, "src/data/script.json"), "utf8"));
const outDir = join(root, "public/audio/vo");
const durationsPath = join(root, "src/data/durations.json");
mkdirSync(outDir, { recursive: true });

const probeOnly = process.argv.includes("--probe");
const only = process.argv.slice(2).filter((a) => a !== "--probe");
const hf = join(root, "node_modules/.bin/hyperframes");

const probe = (file) =>
  Number(
    execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file])
      .toString()
      .trim(),
  );

const durations = existsSync(durationsPath) ? JSON.parse(readFileSync(durationsPath, "utf8")) : {};

for (const scene of script.scenes) {
  const file = join(outDir, `${scene.id}.wav`);
  if (!probeOnly && (only.length === 0 || only.includes(scene.id))) {
    console.log(`→ ${scene.id}`);
    execFileSync(hf, ["tts", scene.tts, "-v", "ef_dora", "-s", "1.05", "-o", file], {
      stdio: ["ignore", "ignore", "inherit"],
    });
  }
  durations[scene.id] = Math.round(probe(file) * 1000) / 1000;
}

writeFileSync(durationsPath, JSON.stringify(durations, null, 2) + "\n");
console.log(durations);
