# APV Motors — VSL «cars.apvmotorusa.com»

Video de ventas (VSL) en estilo motion graphics que explica cómo usar **cars.apvmotorusa.com**,
califica al prospecto y cierra indicando que **un asesor lo atenderá y lo guiará en su compra**.

| Entregable | Herramienta | Formato | Archivo |
|---|---|---|---|
| VSL completo (~2:09) | Remotion | 1920×1080 · 30 fps | `out/cars-vsl.mp4` |
| Teaser vertical (21 s) | HyperFrames | 1080×1920 · 30 fps | `out/cars-teaser-hyperframes.mp4` |

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

### Cambiar la voz o el guion
```bash
python3 -m venv .venv && .venv/bin/pip install kokoro-onnx soundfile numpy scipy
export HYPERFRAMES_PYTHON=$PWD/.venv/bin/python
# edita src/data/script.json y luego:
npm run voiceover          # todas las escenas (o: node scripts/generate-voiceover.mjs hook cta)
.venv/bin/python scripts/generate-music.py   # música y SFX ajustados a las nuevas duraciones
npm run render
```
Para usar un locutor humano: guarda cada archivo como `public/audio/vo/<id>.wav`, ejecuta
`node scripts/generate-voiceover.mjs --probe` (solo mide duraciones) y vuelve a generar la música.

## HyperFrames (teaser vertical)
```bash
npm run hf:lint
npm run hf:preview   # estudio de HyperFrames
npm run hf:render    # → out/cars-teaser-hyperframes.mp4
```
Composición: `hyperframes/cars-teaser/index.html` (HTML + GSAP; locución generada con `hyperframes tts`).

## Nota
La interfaz que aparece en el video es una **recreación fiel** de cars.apvmotorusa.com (mismos textos,
colores, tipografía, logo y flujo de compra). Los vehículos, lotes y montos son ilustrativos; el cálculo
de tarifas usa las mismas tablas que la calculadora del sitio.
