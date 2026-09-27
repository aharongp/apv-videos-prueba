# Voces aprobadas

Registro de las voces elegidas para los videos de APV Motors, para reutilizarlas en próximos proyectos.

## Español latino — «Valeria» (aprobada por el cliente)
Voz femenina, cálida y **conversacional**, acento latinoamericano neutro. Usada en el VSL y el teaser en
español de cars.apvmotorusa.com (etiqueta git `vsl-es-valeria`).

| Dato | Valor |
|---|---|
| Voz de origen | ElevenLabs «Valeria – Warm & Expressive» · `WwdAeR5vLd7Sa27ddCLi` · es-latin-american · conversational |
| Muestra de referencia | https://storage.googleapis.com/eleven-public-prod/database/workspace/1e0ed333cdf84056a91c444d973a0282/voices/WwdAeR5vLd7Sa27ddCLi/vgFagzms8lULREjFZZpU.mp3 |
| Motor | Higgsfield `generate_audio` · modelo `seed_audio` · `sample_rate: 44100` |
| Referencia ya importada en Higgsfield | `medias: [{ value: "b42f78f0-55e3-4731-a81b-c7c50e826521", role: "audio_references" }]` |
| Rasgos medidos | F0 ≈ 211 Hz · rango ≈ 12 semitonos · Whisper: español 0,99 |

Cómo reutilizarla:
1. En Higgsfield, `generate_audio` con `model: "seed_audio"`, el `prompt` = texto a locutar y la referencia de
   arriba en `medias` (si el media_id ya no existe, reimportar la muestra con `media_import_url`).
2. Escribir siglas y URLs de forma fonética: «cars punto, a, pe, be, motor usa punto com», «a, pe, be Motors».
   Si una frase corta sale apresurada, separar con comas y usar `speech_rate: -15`.
3. Pasar el audio por el pipeline: `scripts/compress-pauses.py` → `scripts/normalize-vo.sh` (−16 LUFS).
4. Revisar siempre con Whisper: el clon a veces añade un ruido o sílaba suelta al final (recortar).

Usos: VSL y teaser en español de cars.apvmotorusa.com; video «primera vez» de 45 s (`video-primera-vez/`,
tomas en `video-primera-vez/assets/vo-raw/`). En tomas cortas el clon puede añadir sílabas sueltas al final
(p. ej. «¿Cuánto?» tras «pujar»): transcribir cada toma sin `initial_prompt` y regenerar la que falle.

Descartadas: Marisol (preset Seed Audio, acento inglés) y «Anita – Rapid-Fire» (latina pero aguda y
acelerada, sonaba rústica).

## Inglés (EE. UU.) — «Tawny»
Voz femenina estadounidense, cálida y conversacional (estilo UGC para anuncios). Usada en el VSL y el teaser en
inglés (`out/cars-vsl-en.mp4`, `out/cars-teaser-hyperframes-en.mp4`).

| Dato | Valor |
|---|---|
| Voz de origen | ElevenLabs «Tawny \| Warm Conversational American» · `Rv3wiuHHQq0rSS4QVaQ8` · en-american · conversational |
| Muestra de referencia | https://storage.googleapis.com/eleven-public-prod/database/workspace/f7bb55cae85b4f4a9796277e7347538a/voices/Rv3wiuHHQq0rSS4QVaQ8/XaBGHbbCCMckQGa62Mwg.mp3 |
| Referencia ya importada en Higgsfield | `medias: [{ value: "990a506c-044e-4fc8-95e7-b0d7ca23ae10", role: "audio_references" }]` |
| Rasgos medidos | F0 ≈ 194 Hz · rango ≈ 10 semitonos · Whisper: inglés 0,99–1,0 |

Escritura fonética: «cars dot, A, P, V, motor, U, S, A, dot com», «A, P, V Motors», «V.I.N.».
Descartada: «Lara Lane» (más plana y lenta).
