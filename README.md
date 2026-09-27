# APV Motors — VSL «cars.apvmotorusa.com»

Video de ventas (VSL) en estilo motion graphics que explica cómo usar **cars.apvmotorusa.com**,
califica al prospecto y cierra indicando que **un asesor lo atenderá y lo guiará en su compra**.

| Entregable | Herramienta | Formato | Archivo |
|---|---|---|---|
| VSL completo (~2:30) | Remotion | 1920×1080 · 30 fps | `out/cars-vsl.mp4` |
| Teaser vertical (25 s) | HyperFrames | 1080×1920 · 30 fps | `out/cars-teaser-hyperframes.mp4` |

Estrategia, guion y recomendaciones de venta: [`docs/VSL-estrategia.md`](docs/VSL-estrategia.md).

## Requisitos
- Node.js ≥ 22 y FFmpeg (`apt-get install ffmpeg`)
- Chrome headless (`npx hyperframes browser ensure` lo descarga)
- Para regenerar voz/música: Python 3 con `kokoro-onnx soundfile numpy scipy`

```bash
npm install
```

## Remotion (VSL principal)
```bash
npm run studio   # editor visual en el navegador
npm run render   # → out/cars-vsl.mp4
npm run still    # miniatura
```
Si Remotion no encuentra Chrome, añade `--browser-executable=<ruta>` (p. ej. el que instala `npx hyperframes browser ensure`).

Estructura:
- `src/data/script.json` — guion: texto de subtítulos (`caption`) y texto para la voz (`tts`, con pronunciación fonética de la URL).
- `src/data/durations.json` — duración de cada locución (generada). El timing de todas las escenas se calcula a partir de aquí.
- `src/theme.ts` — branding de cars.apvmotorusa.com (colores de su CSS, Inter, logo en `public/brand/`).
- `src/scenes/` — `Intro.tsx` (gancho, problema, solución), `Demo.tsx` (los 5 pasos reales del sitio), `Close.tsx` (valor y planes, calificación, objeción, CTA, asesor).
- `src/components/` — fondo animado, subtítulos palabra por palabra, navegador y cursor, recreación de la UI del sitio (`Site.tsx`: registro, filtros, fichas Copart, calculadora de tarifas, tope de oferta, chat con asesor), autos SVG, iconos.

### Voz (ElevenLabs)
La locución final usa **ElevenLabs**: voz *Pedro Alejandro | Latin Voiceover* (`6SsnyXR5jQuiqQTyhK2q`,
español latino) con el modelo `eleven_multilingual_v2`. Los textos que se envían están en el campo `tts`
de `src/data/script.json`; la URL se escribe fonéticamente como **"cars punto a pe be motor usa punto com"**
(verificado con transcripción: la voz dice "cars.apbmotorusa.com").

Para regenerar una escena: genera el audio en ElevenLabs con ese texto, guárdalo como
`public/audio/vo/<id>.wav` y ejecuta:
```bash
bash scripts/normalize-vo.sh                       # nivela las voces a -16 LUFS (¡imprescindible!)
node scripts/generate-voiceover.mjs --probe        # mide duraciones → src/data/durations.json
.venv/bin/python scripts/generate-music.py         # música y SFX ajustados a las nuevas duraciones
npm run render
```
(Sin ElevenLabs, `node scripts/generate-voiceover.mjs` genera una voz local de respaldo con Kokoro vía
`hyperframes tts`; requiere `pip install kokoro-onnx soundfile` y `HYPERFRAMES_PYTHON`.)

## HyperFrames (teaser vertical)
```bash
npm run hf:lint
npm run hf:preview   # estudio de HyperFrames
npm run hf:render    # → out/cars-teaser-hyperframes.mp4
```
Composición: `hyperframes/cars-teaser/index.html` (HTML + GSAP). Su locución se armó con fragmentos de las locuciones de ElevenLabs del VSL (gancho, urgencia, URL y asesor).

## Nota
La interfaz que aparece en el video es una **recreación fiel** de cars.apvmotorusa.com (mismos textos,
colores, tipografía, logo y flujo de compra). Los vehículos, lotes y montos son ilustrativos; el cálculo
de tarifas usa las mismas tablas que la calculadora del sitio.
