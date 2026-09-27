"""Verificación automática antes de entregar.

- Clips de escena (HyperFrames): la franja de subtítulos y las zonas no seguras deben quedar vacías (color de fondo)
  en todos los fotogramas muestreados; duración = escena + colchón.
- MP4 finales: 45,000 s y 1350 fotogramas, H.264 + AAC, 1080p, 30 fps; web ≤ 8 MB; sin fotogramas negros;
  zonas no seguras del vertical (250 px arriba, 420 px abajo) vacías; sonoridad integrada ≈ -14 LUFS.

Uso: python scripts/verify.py
"""
import json
import re
import subprocess
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
brand = json.loads((ROOT / "brand.json").read_text())
timing = json.loads((ROOT / "timing.json").read_text())
BG = np.array([int(brand["colors"]["background"][i : i + 2], 16) for i in (1, 3, 5)])
FPS = timing["fps"]
problems = []


def frames(path, w, h, step):
    cmd = ["ffmpeg", "-v", "error", "-i", str(path), "-vf", f"select='not(mod(n\\,{step}))'", "-vsync", "0", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"]
    raw = subprocess.run(cmd, capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(-1, h, w, 3)


def probe(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-count_frames", "-show_entries", "stream=codec_name,width,height,r_frame_rate,nb_read_frames:format=duration,size", "-of", "json", str(path)], capture_output=True, text=True, check=True).stdout
    return json.loads(out)


def band_dirty(arr, y0, y1, tol=10):
    band = arr[:, y0:y1, :, :].astype(int)
    diff = np.abs(band - BG).max(axis=3)
    return (diff > tol).mean(axis=(1, 2))  # fracción de píxeles no-fondo por fotograma


# 1. Clips -------------------------------------------------------------------------------------------------
for fmt, (w, h) in {"9x16": (1080, 1920), "16x9": (1920, 1080)}.items():
    L = brand["layouts"][fmt]
    for sc in timing["scenes"]:
        p = ROOT / "clips" / fmt / f"{sc['id']}.mp4"
        if not p.exists():
            problems.append(f"falta {p.relative_to(ROOT)}")
            continue
        info = probe(p)
        n = int(info["streams"][0]["nb_read_frames"])
        if n != sc["durationFrames"] + timing["clipTailFrames"]:
            problems.append(f"{p.name} {fmt}: {n} fotogramas (esperado {sc['durationFrames'] + timing['clipTailFrames']})")
        arr = frames(p, w, h, 5)
        y_cap = L["captionBand"]["top"] - 20
        dirty = band_dirty(arr, y_cap, h)
        if dirty.max() > 0.0005:
            problems.append(f"{sc['id']} {fmt}: contenido en la franja de subtítulos/inferior (y ≥ {y_cap}) · {dirty.max():.3%}")
        if fmt == "9x16":
            top = band_dirty(arr, 0, L["safeTop"])
            if top.max() > 0.0005:
                problems.append(f"{sc['id']} 9x16: contenido en los 250 px superiores · {top.max():.3%}")
        if sc["id"] == "escena-11":
            cta = band_dirty(arr[-10:], L["ctaBand"]["top"], L["ctaBand"]["bottom"])
            if cta.max() > 0.0005:
                problems.append(f"escena-11 {fmt}: la franja del CTA no está libre al final · {cta.max():.3%}")
print("clips revisados")

# 2. Finales -------------------------------------------------------------------------------------------------
finals = {
    "apv-primera-vez-9x16-web.mp4": (1080, 1920, True),
    "apv-primera-vez-9x16-social.mp4": (1080, 1920, False),
    "apv-primera-vez-16x9-web.mp4": (1920, 1080, True),
}
for name, (w, h, web) in finals.items():
    p = ROOT / "out" / name
    if not p.exists():
        problems.append(f"falta out/{name}")
        continue
    info = probe(p)
    v = next(s for s in info["streams"] if s["codec_name"] == "h264")
    a = [s for s in info["streams"] if s["codec_name"] == "aac"]
    dur = float(info["format"]["duration"])
    size_mb = int(info["format"]["size"]) / 1024 / 1024
    nb = int(v["nb_read_frames"])
    line = f"{name}: {v['width']}×{v['height']} · {v['r_frame_rate']} · {nb} fotogramas · {dur:.3f} s · {size_mb:.2f} MB"
    if (v["width"], v["height"]) != (w, h) or v["r_frame_rate"] != "30/1" or nb != 1350 or not a:
        problems.append("formato incorrecto → " + line)
    if abs(dur - 45.0) > 0.03:
        problems.append(f"{name}: duración {dur:.3f} s")
    if web and size_mb > 8:
        problems.append(f"{name}: {size_mb:.2f} MB (> 8 MB)")
    bd = subprocess.run(["ffmpeg", "-i", str(p), "-vf", "blackdetect=d=0.03:pix_th=0.10", "-an", "-f", "null", "-"], capture_output=True, text=True).stderr
    if "black_start" in bd:
        problems.append(f"{name}: fotogramas negros → {re.findall(r'black_start:[0-9.]+', bd)}")
    ld = subprocess.run(["ffmpeg", "-i", str(p), "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
    lufs = float(re.findall(r"I:\s+(-?[0-9.]+) LUFS", ld)[-1])
    if abs(lufs + 14) > 0.7:
        problems.append(f"{name}: sonoridad {lufs} LUFS")
    if h == 1920:
        arr = frames(p, w, h, 10)
        for y0, y1, lab in ((0, 250, "250 px superiores"), (1500, 1920, "420 px inferiores")):
            d = band_dirty(arr, y0, y1)
            if d.max() > 0.0005:
                problems.append(f"{name}: contenido en {lab} · {d.max():.3%}")
    print(line + f" · {lufs} LUFS")

print()
if problems:
    print("PROBLEMAS:")
    for p in problems:
        print(" -", p)
    raise SystemExit(1)
print("OK: todas las comprobaciones pasan")
