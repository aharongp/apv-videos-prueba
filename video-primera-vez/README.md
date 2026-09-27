# APV Motors — video «primera vez» (45 s)

Video explicativo en motion graphics para hispanohablantes en EE. UU. que nunca han comprado en una subasta.
Uso: landing `/lp?v=primera-vez` y Reels/TikTok. Entregables en `out/` (ver `out/RESUMEN.md`).

## Reparto de trabajo
| Herramienta | Hace | Dónde |
|---|---|---|
| **HyperFrames** | Toda la animación de escena (HTML + CSS + GSAP), en 9:16 y 16:9 | `scenes/hyperframes/escena-01 … escena-11` → `clips/` |
| **Remotion** | Línea de tiempo, transiciones, voz + música con ducking, subtítulos, CTA web/social, exportación | `assembly/` |

Fuente única compartida por las dos herramientas (en la raíz):
- `brand.json` — colores, tipografía, logo y zonas (tomados de `aharongp/landing-apv`, `public/styles.css`).
- `copy.json` — guion literal de la locución, textos de pantalla y CTA.
- `timing.json` — duración de cada escena, tiempos por palabra y subtítulos. **Generado** desde la locución real.

## Requisitos
Node.js ≥ 22, FFmpeg y Python 3 con `numpy soundfile faster-whisper` (solo para `build-timing.py`).
```bash
npm install && npm --prefix assembly install
npx skills add heygen-com/hyperframes   # skills oficiales (se instalan en .agents/, ignorado por git)
```

## Pipeline
```bash
# 1. Locución (voz «Valeria», ver ../docs/voces.md): tomas por escena en assets/vo-raw/escena-NN.wav
python3 scripts/build-timing.py      # recorta, normaliza, transcribe, reparte 1350 frames → timing.json + assets/vo.mp3
python3 scripts/make-music.py        # música original 45 s, 104 BPM, -18 LUFS → assets/music.mp3
# 2. Escenas HyperFrames
node scripts/sync-scenes.mjs         # inyecta brand/copy/timing y duraciones en cada escena
node scripts/scenes.mjs lint
node scripts/scenes.mjs render       # → clips/9x16/escena-NN.mp4 y clips/16x9/escena-NN.mp4 (22 clips)
# 3. Ensamblaje Remotion + master + subtítulos + pósteres + capturas
npm --prefix assembly run build      # → out/*.mp4, out/subtitulos-es.{vtt,srt}, out/poster-*.jpg, out/capturas/
python3 scripts/verify.py            # comprobaciones de entrega
```
Si cambias un texto: edítalo en `copy.json`, `node scripts/sync-scenes.mjs`, renderiza esa escena y vuelve a
ensamblar. Si cambias la voz: `build-timing.py` recalcula todo y hay que volver a renderizar las escenas.
Detalles de las escenas: `scenes/hyperframes/README.md`.
