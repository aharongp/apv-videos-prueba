// Ensamblaje final: Remotion → master de audio → codificación de entrega → subtítulos → pósteres y capturas.
// Requiere los 22 clips en ../clips (node ../scripts/scenes.mjs render) y assets/vo.mp3 + assets/music.mp3.
// Uso (desde assembly/): npm run build  [-- PrimeraVez916Web ...]
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { execFileSync } from "node:child_process";
import { cpSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const asm = join(here, "..");
const root = join(asm, "..");
const out = join(root, "out");
const tmp = join(asm, "out");
const timing = JSON.parse(readFileSync(join(root, "timing.json"), "utf8"));
const brand = JSON.parse(readFileSync(join(root, "brand.json"), "utf8"));
const FPS = timing.fps;
mkdirSync(out, { recursive: true });
mkdirSync(tmp, { recursive: true });

const ff = (...args) => execFileSync("ffmpeg", ["-y", "-hide_banner", "-loglevel", "error", ...args], { stdio: "inherit" });
const ffOut = (...args) => execFileSync("ffmpeg", ["-hide_banner", ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });

// 1. public/ con los medios compartidos -------------------------------------------------------------
const pub = join(asm, "public");
rmSync(pub, { recursive: true, force: true });
mkdirSync(join(pub, "audio"), { recursive: true });
cpSync(join(root, "clips"), join(pub, "clips"), { recursive: true });
cpSync(join(root, "assets/vo.mp3"), join(pub, "audio/vo.mp3"));
cpSync(join(root, "assets/music.mp3"), join(pub, "audio/music.mp3"));
cpSync(join(root, "assets/fonts"), join(pub, "fonts"), { recursive: true });

// 2. Render de las composiciones ------------------------------------------------------------------
const targets = [
  { id: "PrimeraVez916Web", file: "apv-primera-vez-9x16-web.mp4", web: true },
  { id: "PrimeraVez916Social", file: "apv-primera-vez-9x16-social.mp4", web: false },
  { id: "PrimeraVez169Web", file: "apv-primera-vez-16x9-web.mp4", web: true },
];
const only = process.argv.slice(2);
const serveUrl = await bundle({ entryPoint: join(asm, "src/index.ts"), publicDir: pub });

for (const t of targets.filter((t) => only.length === 0 || only.includes(t.id))) {
  const composition = await selectComposition({ serveUrl, id: t.id });
  const raw = join(tmp, `raw-${t.file}`);
  console.log(`→ render ${t.id} (${composition.width}×${composition.height}, ${composition.durationInFrames} f)`);
  await renderMedia({ serveUrl, composition, codec: "h264", crf: 14, audioCodec: "aac", audioBitrate: "320k", outputLocation: raw, concurrency: null });

  // 3. Master de audio: loudnorm en dos pasadas, lineal, -14 LUFS / -1.5 dBTP --------------------------
  const probe = ffOut("-i", raw, "-af", "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-").toString();
  const m = JSON.parse(probe.slice(probe.lastIndexOf("{"), probe.lastIndexOf("}") + 1));
  const ln = `loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`;
  const master = join(tmp, `master-${t.file}.m4a`);
  ff("-i", raw, "-vn", "-af", `${ln},aresample=48000`, "-c:a", "aac", "-b:a", "128k", master);

  // 4. Codificación de entrega (H.264 High, yuv420p, faststart). Web: 2 pasadas a tasa fija para ≤ 8 MB.
  const final = join(out, t.file);
  const common = ["-c:v", "libx264", "-profile:v", "high", "-pix_fmt", "yuv420p", "-r", String(FPS), "-preset", "slow", "-movflags", "+faststart"];
  if (t.web) {
    const seconds = timing.totalFrames / FPS;
    const kbps = Math.floor(((7.6 * 1024 * 1024 * 8) / seconds - 128 * 1000) / 1000); // margen bajo 8 MB
    const passlog = join(tmp, `pass-${t.id}`);
    ff("-i", raw, ...common, "-b:v", `${kbps}k`, "-maxrate", `${Math.round(kbps * 1.6)}k`, "-bufsize", `${kbps * 2}k`, "-pass", "1", "-passlogfile", passlog, "-an", "-f", "mp4", "/dev/null");
    ff("-i", raw, "-i", master, "-map", "0:v", "-map", "1:a", ...common, "-b:v", `${kbps}k`, "-maxrate", `${Math.round(kbps * 1.6)}k`, "-bufsize", `${kbps * 2}k`, "-pass", "2", "-passlogfile", passlog, "-c:a", "copy", "-t", String(seconds), final);
  } else {
    ff("-i", raw, "-i", master, "-map", "0:v", "-map", "1:a", ...common, "-crf", "19", "-c:a", "copy", "-t", String(timing.totalFrames / FPS), final);
  }
  const mb = statSync(final).size / 1024 / 1024;
  console.log(`✓ ${final} · ${mb.toFixed(2)} MB`);
}

// 5. Subtítulos .vtt / .srt (desde timing.json + copy.json, los mismos que se incrustan) -----------------
const ts = (frame, sep) => {
  const ms = Math.round((frame / FPS) * 1000);
  const h = String(Math.floor(ms / 3600000)).padStart(2, "0");
  const m = String(Math.floor((ms % 3600000) / 60000)).padStart(2, "0");
  const s = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
  return `${h}:${m}:${s}${sep}${String(ms % 1000).padStart(3, "0")}`;
};
const vtt = ["WEBVTT", ""];
const srt = [];
timing.captions.forEach((c, i) => {
  vtt.push(`${i + 1}`, `${ts(c.startFrame, ".")} --> ${ts(c.endFrame, ".")}`, ...c.lines, "");
  srt.push(`${i + 1}`, `${ts(c.startFrame, ",")} --> ${ts(c.endFrame, ",")}`, ...c.lines, "");
});
writeFileSync(join(out, "subtitulos-es.vtt"), vtt.join("\n"));
writeFileSync(join(out, "subtitulos-es.srt"), srt.join("\n"));

// 6. Pósteres (escena 1, pregunta completa, sin subtítulos: del clip de HyperFrames) -------------------
const s1 = timing.scenes[0];
const posterAt = ((s1.durationFrames - 4) / FPS).toFixed(3);
ff("-ss", posterAt, "-i", join(root, "clips/9x16/escena-01.mp4"), "-frames:v", "1", "-q:v", "2", join(out, "poster-9x16.jpg"));
ff("-ss", posterAt, "-i", join(root, "clips/16x9/escena-01.mp4"), "-frames:v", "1", "-q:v", "2", join(out, "poster-16x9.jpg"));

// 7. Capturas para RESUMEN.md (versión 9:16 web, a ~70 % de cada escena) --------------------------------
const web916 = join(out, "apv-primera-vez-9x16-web.mp4");
if (existsSync(web916)) {
  mkdirSync(join(out, "capturas"), { recursive: true });
  for (const id of ["escena-01", "escena-03", "escena-06", "escena-08", "escena-10", "escena-11"]) {
    const s = timing.scenes.find((x) => x.id === id);
    const at = ((s.startFrame + Math.round(s.durationFrames * (id === "escena-11" ? 0.9 : 0.72))) / FPS).toFixed(3);
    ff("-ss", at, "-i", web916, "-frames:v", "1", "-q:v", "3", "-vf", "scale=540:-1", join(out, "capturas", `${id}.jpg`));
  }
}
console.log("✓ subtítulos, pósteres y capturas en", out, "·", brand.video.durationFrames, "frames");
