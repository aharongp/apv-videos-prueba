# APV Motors — VSL «cars.apvmotorusa.com»

Video de ventas (VSL) en estilo motion graphics que explica cómo usar **cars.apvmotorusa.com**,
califica al prospecto y cierra indicando que **un asesor lo atenderá y lo guiará en su compra**.

| Entregable | Herramienta | Formato | Archivo |
|---|---|---|---|
| VSL completo (~2:17) · español | Remotion | 1920×1080 · 30 fps | `out/cars-vsl.mp4` |
| Teaser vertical (21 s) · español | HyperFrames | 1080×1920 · 30 fps | `out/cars-teaser-hyperframes.mp4` |
| VSL completo (~2:22) · inglés (EE. UU.) | Remotion | 1920×1080 · 30 fps | `out/cars-vsl-en.mp4` |
| Teaser vertical (21 s) · inglés (EE. UU.) | HyperFrames | 1080×1920 · 30 fps | `out/cars-teaser-hyperframes-en.mp4` |

Estrategia, guion y recomendaciones de venta: [`docs/VSL-estrategia.md`](docs/VSL-estrategia.md).
Voces aprobadas y cómo reutilizarlas: [`docs/voces.md`](docs/voces.md).

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

### Voz
La locución final es femenina, cálida y **conversacional**, con **acento latinoamericano** neutro: se generó
con **Seed Audio** (ByteDance) vía Higgsfield clonando la muestra pública de la voz **«Valeria – Warm &
Expressive»** de ElevenLabs (`WwdAeR5vLd7Sa27ddCLi`, `es-latin-american`, categoría *conversational*) como
`audio_references`. El clon conserva el timbre de la original (F0 ≈ 211 Hz) y su entonación (~12 semitonos de
rango); Whisper la reconoce como español nativo (0,99). Antes se probaron Marisol (acento inglés) y «Anita –
Rapid-Fire» (latina, pero aguda y acelerada: sonaba rústica).
Los textos enviados están en el campo `tts` de `src/data/script.json`; la URL se escribe
**"cars punto, a, pe, be, motor usa punto com"** (verificado con Whisper: se entiende "cars.apbmotorusa.com").

### Versión en inglés (EE. UU.)
El mismo proyecto genera ambos idiomas. La composición `CarsVSLEn` usa `src/data/script.en.json`,
`src/data/durations.en.json`, `public/audio/vo-en/` y `public/audio/music-en.mp3`; los textos en pantalla
se traducen con `useT()` (`src/i18n.tsx`: `t("español", "English")`). Voz: clon en Seed Audio de
**«Tawny | Warm Conversational American»** de ElevenLabs (`Rv3wiuHHQq0rSS4QVaQ8`); la URL se escribe
"cars dot, A, P, V, motor, U, S, A, dot com" (Whisper: "cars.apvmotorusa.com").
```bash
node scripts/generate-voiceover.mjs --probe --lang en   # duraciones → src/data/durations.en.json
npm run music:en                                        # → public/audio/music-en.mp3
npm run render:en                                       # → out/cars-vsl-en.mp4
npm run hf:render:en                                    # → out/cars-teaser-hyperframes-en.mp4
```

Para reemplazar o regenerar una escena, guarda el audio como `public/audio/vo/<id>.wav` y ejecuta:
```bash
.venv/bin/python scripts/compress-pauses.py public/audio/vo/*.wav   # acorta pausas largas entre frases
bash scripts/normalize-vo.sh                                         # nivela las voces a -16 LUFS (¡imprescindible!)
node scripts/generate-voiceover.mjs --probe                          # mide duraciones → src/data/durations.json
.venv/bin/python scripts/generate-music.py                           # música y SFX ajustados a las nuevas duraciones
npm run render
```
(Sin servicio externo, `node scripts/generate-voiceover.mjs` genera una voz local de respaldo con Kokoro vía
`hyperframes tts`; requiere `pip install kokoro-onnx soundfile` y `HYPERFRAMES_PYTHON`.)

## HyperFrames (teaser vertical)
```bash
npm run hf:lint
npm run hf:preview   # estudio de HyperFrames
npm run hf:render    # → out/cars-teaser-hyperframes.mp4
```
Composición: `hyperframes/cars-teaser/index.html` (HTML + GSAP), con locución propia en la misma voz latina.

## Nota
La interfaz que aparece en el video es una **recreación fiel** de cars.apvmotorusa.com (mismos textos,
colores, tipografía, logo y flujo de compra). Los vehículos, lotes y montos son ilustrativos; el cálculo
de tarifas usa las mismas tablas que la calculadora del sitio.
