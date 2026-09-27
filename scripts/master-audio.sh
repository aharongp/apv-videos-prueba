#!/usr/bin/env bash
# Normaliza el audio de los videos renderizados a -16 LUFS / -1.5 dBTP (redes sociales y YouTube).
# Uso: bash scripts/master-audio.sh out/cars-vsl.mp4 [otro.mp4 ...]
set -euo pipefail
for f in "$@"; do
  tmp="${f%.mp4}.tmp.mp4"
  ffmpeg -y -loglevel error -i "$f" -c:v copy -af "loudnorm=I=-16:TP=-1.5:LRA=11" -ar 48000 -c:a aac -b:a 192k -movflags +faststart "$tmp"
  mv "$tmp" "$f"
  echo "✓ $f"
done
