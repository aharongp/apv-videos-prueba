#!/usr/bin/env bash
# Normaliza las locuciones a -16 LUFS / -1.5 dBTP. Ejecutar siempre después de importar audios
# nuevos (ElevenLabs entrega algunas voces muy bajas, p. ej. -46 LUFS).
# Uso: bash scripts/normalize-vo.sh [archivo.wav ...]   (por defecto: public/audio/vo/*.wav)
set -euo pipefail
files=("$@")
[ ${#files[@]} -eq 0 ] && files=(public/audio/vo/*.wav)
for f in "${files[@]}"; do
  tmp="${f%.wav}.norm.wav"
  ffmpeg -y -loglevel error -i "$f" -af "loudnorm=I=-16:TP=-1.5:LRA=11" -ar 44100 -ac 1 "$tmp"
  mv "$tmp" "$f"
  echo "✓ $f $(ffmpeg -i "$f" -af ebur128 -f null - 2>&1 | grep -A6 Summary | grep 'I:' | tr -s ' ')"
done
