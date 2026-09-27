// Sincroniza brand.json + copy.json + timing.json (raíz) con cada proyecto HyperFrames de escena.
// - Inyecta en index.html (9:16) y compositions/horizontal.html (16:9) el bloque <!-- apv:brand --> (fuentes, colores)
//   y el bloque <!-- apv:data --> (datos + utilidades), entre sus marcadores.
// - Ajusta el data-duration de la composición raíz a (duración de escena + colchón) según timing.json.
// - Copia fuentes, logo y GSAP a scenes/hyperframes/escena-NN/assets/.
// Uso: node scripts/sync-scenes.mjs [escena-01 ...]
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (f) => JSON.parse(readFileSync(join(root, f), "utf8"));
const brand = read("brand.json");
const copy = read("copy.json");
const timing = read("timing.json");
const fps = brand.video.fps;
const tail = brand.video.clipTailFrames;
const helpers = readFileSync(join(root, "scenes/hyperframes/_shared/helpers.js"), "utf8");
const require = createRequire(import.meta.url);
const gsapPath = require.resolve("gsap/dist/gsap.min.js");

const only = process.argv.slice(2);
const scenesDir = join(root, "scenes/hyperframes");
const ids = readdirSync(scenesDir).filter((d) => /^escena-\d\d$/.test(d) && (only.length === 0 || only.includes(d)));

const fontFaces = (base) =>
  Object.entries(brand.font.files)
    .map(([w, f]) => `@font-face{font-family:"${brand.font.family}";font-weight:${w};font-style:normal;src:url("${base}assets/fonts/${f.split("/").pop()}") format("woff2")}`)
    .join("\n      ");

const brandBlock = (layoutKey, base) => {
  const L = brand.layouts[layoutKey];
  const c = brand.colors;
  return `<!-- apv:brand -->
    <style>
      ${fontFaces(base)}
      :root{--accent:${c.accent};--accent-dark:${c.accentDark};--ink:${c.ink};--ink2:${c.ink2};--muted:${c.muted};--line:${c.line};--soft:${c.soft};--bg:${c.background};--white:${c.white};
        --font:"${brand.font.family}",sans-serif;--hl-weight:${brand.font.headlineWeight};--hl-track:${brand.font.headlineTracking};
        --W:${L.width}px;--H:${L.height}px;--side:${L.sideMargin}px;--content-top:${L.content.top}px;--content-bottom:${L.content.bottom}px;
        --content-h:${L.content.bottom - L.content.top}px;--cta-top:${L.ctaBand.top}px;--cta-bottom:${L.ctaBand.bottom}px}
      html,body{margin:0;padding:0;background:var(--bg);font-family:var(--font);color:var(--ink);-webkit-font-smoothing:antialiased}
      #root{position:relative;width:100%;height:100%;overflow:hidden;background:var(--bg)}
      .stage{position:absolute;left:var(--side);right:var(--side);top:var(--content-top);height:var(--content-h);display:flex;flex-direction:column;align-items:center;justify-content:center;box-sizing:border-box}
      .hl{font-weight:var(--hl-weight);letter-spacing:var(--hl-track);line-height:1.02;margin:0;text-align:center;color:var(--ink)}
      .red{color:var(--accent)}
      .w{display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.08em}
      .wi{display:inline-block}
      .step-badge{display:flex;align-items:center;justify-content:center;border-radius:999px;background:var(--accent);color:var(--white);font-weight:900}
    </style>
    <!-- /apv:brand -->`;
};

const dataBlock = (layoutKey, base) => `<!-- apv:data -->
    <script>
      window.APV = ${JSON.stringify({ fps, layout: layoutKey, base, brand: { colors: brand.colors, layout: brand.layouts[layoutKey] }, copy, timing })};
    </script>
    <script>
${helpers}
    </script>
    <!-- /apv:data -->`;

const replaceBlock = (html, tag, block) => {
  const re = new RegExp(`<!-- apv:${tag} -->[\\s\\S]*?<!-- /apv:${tag} -->`);
  if (!re.test(html)) throw new Error(`Falta el marcador <!-- apv:${tag} --> … <!-- /apv:${tag} -->`);
  return html.replace(re, block);
};

for (const id of ids) {
  const dir = join(scenesDir, id);
  const t = timing.scenes.find((s) => s.id === id);
  if (!t) throw new Error(`timing.json no tiene ${id}`);
  // HyperFrames redondea hacia arriba (duración × fps): se resta 1/1000 de frame para obtener exactamente N frames.
  const clipSeconds = ((t.durationFrames + tail - 0.001) / fps).toFixed(6);

  mkdirSync(join(dir, "assets/fonts"), { recursive: true });
  for (const f of Object.values(brand.font.files)) copyFileSync(join(root, f), join(dir, "assets/fonts", f.split("/").pop()));
  copyFileSync(join(root, brand.logo.file), join(dir, "assets/apv-logo.png"));
  copyFileSync(gsapPath, join(dir, "assets/gsap.min.js"));

  // La 16:9 vive en compositions/ porque HyperFrames admite una sola composición raíz por proyecto;
  // las rutas son relativas a la raíz del proyecto también ahí (así lo sirve HyperFrames).
  for (const [file, layoutKey, base] of [["index.html", "9x16", ""], ["compositions/horizontal.html", "16x9", ""]]) {
    const p = join(dir, file);
    if (!existsSync(p)) continue;
    let html = readFileSync(p, "utf8");
    html = replaceBlock(html, "brand", brandBlock(layoutKey, base));
    html = replaceBlock(html, "data", dataBlock(layoutKey, base));
    html = html.replace(/(data-composition-id="main"[^>]*?data-duration=")[^"]*(")/, `$1${clipSeconds}$2`);
    writeFileSync(p, html);
  }
  console.log(`✓ ${id}: ${t.durationFrames} + ${tail} frames = ${clipSeconds}s`);
}
