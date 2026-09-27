"""Construye timing.json y la pista de voz a partir de las tomas de locución.

1. Recorta silencios, acorta pausas largas y normaliza cada toma (assets/vo-raw/escena-NN.wav → assets/vo/escena-NN.wav).
2. Transcribe cada toma con marcas de tiempo por palabra (faster-whisper).
3. Reparte los 1350 frames (45,0 s) entre las 11 escenas: cada escena dura al menos su locución + respiro
   y el resto se reparte según la duración nominal del guion (copy.json → nominal).
4. Genera los bloques de subtítulos (máx. 2 líneas × 32 caracteres) con el texto literal de copy.json.
5. Monta la pista completa de 45,0 s: assets/vo.wav y assets/vo.mp3.

Requisitos: ffmpeg, python con numpy, soundfile y faster-whisper.
Uso: python scripts/build-timing.py
"""
import json
import re
import subprocess
import unicodedata
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
brand = json.loads((ROOT / "brand.json").read_text())
copy = json.loads((ROOT / "copy.json").read_text())
FPS = brand["video"]["fps"]
TOTAL = brand["video"]["durationFrames"]
SR = 44100
LEAD = 5  # frames entre el inicio de la escena y la voz
LEAD_FIRST = 9
BREATH = 5  # frames mínimos de respiro tras la voz (la transición de 10 f añade la pausa entre escenas)
FINAL_HOLD = 30  # «mantener 1 s fijo al final»
MIN_SCENE = 45  # 1,5 s
MAX_PAUSE = 0.28  # s: pausas internas más largas se acortan
CAPTION_CHARS = 32

raw_dir, vo_dir = ROOT / "assets/vo-raw", ROOT / "assets/vo"
vo_dir.mkdir(parents=True, exist_ok=True)


def ff(*args):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *args], check=True)


def compress_pauses(path: Path):
    x, sr = sf.read(path)
    win = int(0.02 * sr)
    rms = np.sqrt(np.convolve(x**2, np.ones(win) / win, mode="same"))
    silent = rms < 10 ** (-42 / 20)
    keep = np.ones(len(x), bool)
    i = 0
    while i < len(x):
        if silent[i]:
            j = i
            while j < len(x) and silent[j]:
                j += 1
            if (j - i) / sr > MAX_PAUSE:
                keep[i + int(MAX_PAUSE * sr) : j] = False
            i = j
        else:
            i += 1
    sf.write(path, x[keep], sr)


def duration(path: Path) -> float:
    return len(sf.read(path)[0]) / SR


# 1. Preparar tomas -----------------------------------------------------------------------------
scenes = copy["scenes"]
for s in scenes:
    src, dst = raw_dir / f"{s['id']}.wav", vo_dir / f"{s['id']}.wav"
    trim = "silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse"
    ff("-i", str(src), "-af", trim, "-ar", str(SR), "-ac", "1", str(dst))
    compress_pauses(dst)
    tmp = dst.with_suffix(".norm.wav")
    ff("-i", str(dst), "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", str(SR), "-ac", "1", str(tmp))
    tmp.replace(dst)

# 2. Transcribir ------------------------------------------------------------------------------------
from faster_whisper import WhisperModel  # noqa: E402

model = WhisperModel("small", compute_type="int8")


def norm(w: str) -> str:
    w = unicodedata.normalize("NFD", w.lower())
    return re.sub(r"[^a-z0-9]", "", "".join(c for c in w if unicodedata.category(c) != "Mn"))


words_by_scene = {}
for s in scenes:
    segs, _ = model.transcribe(str(vo_dir / f"{s['id']}.wav"), language="es", word_timestamps=True)  # sin initial_prompt: provoca alucinaciones en tomas cortas
    words_by_scene[s["id"]] = [{"w": w.word.strip(), "t0": float(w.start), "t1": float(w.end)} for seg in segs for w in seg.words]

# 3. Repartir la duración -----------------------------------------------------------------------------
vo_frames = {s["id"]: int(np.ceil(duration(vo_dir / f"{s['id']}.wav") * FPS)) for s in scenes}
need, nominal = [], []
for i, s in enumerate(scenes):
    lead = LEAD_FIRST if i == 0 else LEAD
    hold = FINAL_HOLD if i == len(scenes) - 1 else BREATH
    need.append(max(MIN_SCENE, lead + vo_frames[s["id"]] + hold))
    nominal.append(round(s["nominal"] * FPS))
if sum(need) > TOTAL:
    raise SystemExit(f"La locución no cabe en 45 s: necesita {sum(need)} frames")
dur = [max(n, m) for n, m in zip(need, nominal)]
excess = sum(dur) - TOTAL
if excess > 0:  # recortar solo donde hay holgura
    slack = [d - n for d, n in zip(dur, need)]
    total_slack = sum(slack)
    cut = [int(np.floor(excess * sl / total_slack)) for sl in slack]
    dur = [d - c for d, c in zip(dur, cut)]
elif excess < 0:
    add = [int(np.floor(-excess * m / sum(nominal))) for m in nominal]
    dur = [d + a for d, a in zip(dur, add)]
# ajuste fino para sumar exactamente TOTAL (sobre la escena con más holgura)
while sum(dur) != TOTAL:
    k = int(np.argmax([d - n for d, n in zip(dur, need)]))
    dur[k] += 1 if sum(dur) < TOTAL else -1

# 4. Subtítulos -----------------------------------------------------------------------------------------


def split_lines(ws):
    """Mejor reparto en ≤2 líneas de ≤32 caracteres (líneas equilibradas). None si no cabe."""
    text = " ".join(ws)
    if len(text) <= 26:  # frase corta: una sola línea
        return [text]
    best = None
    for k in range(1, len(ws)):
        a, b = " ".join(ws[:k]), " ".join(ws[k:])
        if len(a) <= CAPTION_CHARS and len(b) <= CAPTION_CHARS:
            score = abs(len(a) - len(b)) - (6 if re.search(r"[,;:]$", ws[k - 1]) else 0)
            if best is None or score < best[0]:
                best = (score, [a, b])
    if best:
        return best[1]
    return [text] if len(text) <= CAPTION_CHARS else None


def caption_blocks(text: str):
    """Subtítulos: frases completas cuando caben en 2 líneas; si no, se parte la frase en bloques
    equilibrados (prefiriendo cortar tras una coma). Frases cortas consecutivas se unen si caben."""
    sentences = [s.split() for s in re.split(r"(?<=[.?!])\s+", text.strip()) if s]
    pieces = []
    for ws in sentences:
        if split_lines(ws):
            pieces.append(ws)
            continue
        best = None
        for k in range(1, len(ws)):
            a, b = ws[:k], ws[k:]
            if split_lines(a) and split_lines(b):
                score = abs(len(" ".join(a)) - len(" ".join(b))) - (12 if re.search(r"[,;:]$", ws[k - 1]) else 0)
                if best is None or score < best[0]:
                    best = (score, [a, b])
        pieces.extend(best[1])
    blocks = []
    for ws in pieces:
        if blocks and split_lines(blocks[-1] + ws) and len(" ".join(blocks[-1] + ws)) <= 2 * CAPTION_CHARS - 4:
            blocks[-1] = blocks[-1] + ws
        else:
            blocks.append(ws)
    return [{"words": b, "lines": split_lines(b)} for b in blocks]


out_scenes, captions, start = [], [], 0
for i, s in enumerate(scenes):
    sid = s["id"]
    lead = LEAD_FIRST if i == 0 else LEAD
    vo_start = start + lead
    ww = words_by_scene[sid]
    script_words = s["locucion"].split()
    aligned = len(ww) == len(script_words)
    vo_len = vo_frames[sid] / FPS
    # tiempos por palabra del guion (s, relativos al inicio de la voz)
    if aligned:
        times = [(w["t0"], w["t1"]) for w in ww]
    else:  # reparto proporcional a la longitud de cada palabra
        weights = [len(w) + 1 for w in script_words]
        acc, times = 0.0, []
        for wgt in weights:
            t0 = acc / sum(weights) * vo_len
            acc += wgt
            times.append((t0, acc / sum(weights) * vo_len))
    idx = 0
    for b in caption_blocks(s["locucion"]):
        n = len(b["words"])
        t0, t1 = times[idx][0], times[idx + n - 1][1]
        idx += n
        captions.append({
            "scene": sid,
            "text": " ".join(b["words"]),
            "lines": b["lines"],
            "startFrame": vo_start + int(round(t0 * FPS)),
            "endFrame": vo_start + int(round(t1 * FPS)) + 6,
        })
    out_scenes.append({
        "id": sid,
        "startFrame": start,
        "durationFrames": dur[i],
        "voStartFrames": lead,
        "voFrames": vo_frames[sid],
        "wordsAligned": aligned,
        # tiempos de palabra relativos al inicio de la ESCENA (para sincronizar animaciones)
        "words": [{"w": w["w"], "t": round(lead / FPS + w["t0"], 3)} for w in ww],
    })
    start += dur[i]

# cerrar huecos: cada subtítulo dura hasta el siguiente (máx. 0,5 s de hueco) y nunca pasa del final
for a, b in zip(captions, captions[1:]):
    a["endFrame"] = min(max(a["endFrame"], b["startFrame"] - 15), b["startFrame"])
captions[-1]["endFrame"] = min(captions[-1]["endFrame"], TOTAL - FINAL_HOLD // 2)

timing = {
    "_nota": "Generado por scripts/build-timing.py a partir de la locución real. No editar a mano.",
    "fps": FPS,
    "totalFrames": TOTAL,
    "clipTailFrames": brand["video"]["clipTailFrames"],
    "transitionFrames": brand["video"]["transitionFrames"],
    "scenes": out_scenes,
    "captions": captions,
}
(ROOT / "timing.json").write_text(json.dumps(timing, ensure_ascii=False, indent=2) + "\n")

# 5. Pista completa de voz -------------------------------------------------------------------------------
track = np.zeros(int(TOTAL / FPS * SR))
for sc in out_scenes:
    x, _ = sf.read(vo_dir / f"{sc['id']}.wav")
    at = int((sc["startFrame"] + sc["voStartFrames"]) / FPS * SR)
    track[at : at + len(x)] += x[: len(track) - at]
sf.write(ROOT / "assets/vo.wav", track, SR, subtype="PCM_16")
ff("-i", str(ROOT / "assets/vo.wav"), "-b:a", "192k", str(ROOT / "assets/vo.mp3"))

for sc, n in zip(out_scenes, need):
    print(f"{sc['id']}: {sc['durationFrames']:4d} f ({sc['durationFrames']/FPS:5.2f} s) · voz {sc['voFrames']/FPS:5.2f} s · mínimo {n/FPS:5.2f} s · palabras alineadas: {sc['wordsAligned']}")
print(f"total {sum(s['durationFrames'] for s in out_scenes)} frames · {len(captions)} subtítulos")
