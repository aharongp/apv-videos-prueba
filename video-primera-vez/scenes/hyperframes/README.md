# Escenas HyperFrames — cómo están hechas

Cada `escena-NN/` es un proyecto HyperFrames independiente con **dos composiciones**:

| Formato | Archivo | Tamaño |
|---|---|---|
| Vertical 9:16 (master) | `index.html` | 1080×1920 |
| Horizontal 16:9 | `compositions/horizontal.html` | 1920×1080 |

HyperFrames solo admite **una composición raíz por proyecto** (`lint`: `multiple_root_compositions`), por eso la
16:9 vive en `compositions/` y se renderiza con `--composition compositions/horizontal.html`. En ambos archivos
las rutas de assets son relativas a la raíz del proyecto (`assets/...`), también en `compositions/`.

## Fuente única de datos
Nunca escribas textos, colores ni duraciones a mano en una escena. `node scripts/sync-scenes.mjs` inyecta en cada
HTML, entre sus marcadores:
- `<!-- apv:brand --> … <!-- /apv:brand -->`: `@font-face` de Inter, variables CSS de `brand.json`
  (`--accent`, `--ink`, `--muted`, `--line`, `--soft`, `--bg`, `--white`, `--content-top`, `--content-h`,
  `--cta-top`, `--cta-bottom`, `--side`…) y clases base (`.stage`, `.hl`, `.red`, `.w/.wi`, `.step-badge`).
- `<!-- apv:data --> … <!-- /apv:data -->`: `window.APV` (brand, copy.json, timing.json) + `_shared/helpers.js`.
- El `data-duration` de la raíz = duración de la escena (timing.json) + 12 frames de colchón.

Los marcadores deben existir vacíos en el HTML; el script los rellena. Tras cambiar un texto o el timing:
`node scripts/sync-scenes.mjs` y volver a renderizar.

## API de `helpers.js`
```js
const S = APV.scene("escena-05");  // S.pantalla (textos de copy.json), S.dur (s), S.voStart, S.words
S.at("pujar", fallback)             // segundo (relativo a la escena) en que la voz dice esa palabra
APV.splitWords(el)                  // palabras → spans .w>.wi para entradas por palabra (tween yPercent 110→0)
APV.prepStroke(sel, root) / APV.draw(tl, nodes, at, dur)   // trazos SVG que se dibujan
APV.counter(tl, el, 0, 350, at, dur, fmt)                  // contador determinista
APV.carSVG({ kind: "sedan"|"suv"|"pickup", width })        // silueta lineal de auto (clase .stroke en los trazos)
APV.icon("lock"|"unlock"|"shield"|"check"|"gavel"|"search"|"phone"|"doc"|"building"|"bank"|"truck"|"tap", { size, stroke })
```

## Reglas de diseño (del brief)
- Flat, limpio, corporativo. Fondo `--bg`; **rojo `--accent` como único acento**; texto `--ink`. Sin degradados,
  sombras marcadas, brillos ni 3D (sombras: como mucho un borde `--line`).
- Solo ilustración vectorial propia: siluetas lineales, iconos de trazo, maquetas de interfaz dibujadas.
  Sin logos de Copart/IAA/fabricantes, sin fotos, sin personas. «Copart» solo como texto.
- Sin cifras de ahorro ni porcentajes. Montos del desglose como «$—».
- Movimiento: entradas por palabra/línea con `power2/power3.out` (sin rebotes exagerados), barridos o máscaras,
  trazos que se dibujan, contadores. Un cambio visual cada 1,5–3 s.
- **Zonas**: todo el contenido dentro de `.stage` (9:16: y 290–1230; 16:9: y 70–850). La franja inferior
  (9:16: y ≥ 1270; 16:9: y ≥ 880) queda **vacía** para los subtítulos de Remotion. En la escena 11 la franja
  `--cta-top`…`--cta-bottom` queda libre para el CTA.
- La animación termina antes de `S.dur`; el colchón final (12 frames) mantiene el último estado quieto
  (Remotion lo usa para la transición). Sin animaciones de salida.
- Sincroniza los golpes visuales con la voz usando `S.at("palabra", fallback)`; el fallback debe ser
  proporcional a `S.dur` para que funcione con cualquier timing.

## Comandos
```bash
node scripts/sync-scenes.mjs escena-05
cd scenes/hyperframes/escena-05 && ../../../node_modules/.bin/hyperframes lint
../../../node_modules/.bin/hyperframes snapshot --at 0.5,1.5,3 --no-end        # vertical
node scripts/scenes.mjs render escena-05     # → clips/9x16/escena-05.mp4 y clips/16x9/escena-05.mp4
```
