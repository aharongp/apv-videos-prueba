#!/usr/bin/env bash
# Descarga una toma de locución generada (Higgsfield · Seed Audio, voz Valeria) a assets/vo-raw/<escena>.wav
# Uso: bash scripts/get-vo.sh escena-01 <url>
set -euo pipefail
cd "$(dirname "$0")/.."
curl -sSL -o "assets/vo-raw/$1.wav" "$2"
echo "assets/vo-raw/$1.wav"
