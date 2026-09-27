"""Música original de 45,0 s (corporativa, ligera, 104 BPM), sintetizada aquí: sin samples ni licencias de
terceros. Pad suave + arpegio pulsado + bajo + percusión ligera; progresión C–G–Am–F; cierre en C que resuelve
al final. Se normaliza a -18 LUFS (la mezcla final y el ducking se hacen en Remotion + master).

Uso: python scripts/make-music.py   → assets/music.mp3
"""
import json
import subprocess
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
brand = json.loads((ROOT / "brand.json").read_text())
SR = 44100
LENGTH = brand["video"]["durationFrames"] / brand["video"]["fps"]  # 45.0
BPM = 104
BEAT = 60 / BPM
BAR = 4 * BEAT
N = int(LENGTH * SR)
t_all = np.arange(N) / SR
rng = np.random.default_rng(7)

mix = np.zeros((N, 2))


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def place(sig, start, pan=0.0, gain=1.0):
    i = int(start * SR)
    if i >= N:
        return
    sig = sig[: N - i] * gain
    mix[i : i + len(sig), 0] += sig * np.sqrt(0.5 * (1 - pan))
    mix[i : i + len(sig), 1] += sig * np.sqrt(0.5 * (1 + pan))


def env(n, a, d, s, r, sustain_len):
    total = int((a + d + sustain_len + r) * SR)
    e = np.zeros(total)
    A, D, S = int(a * SR), int(d * SR), int(sustain_len * SR)
    e[:A] = np.linspace(0, 1, A, endpoint=False)
    e[A : A + D] = np.linspace(1, s, D, endpoint=False)
    e[A + D : A + D + S] = s
    e[A + D + S :] = np.linspace(s, 0, total - (A + D + S))
    return e


def onepole_lp(x, cutoff):
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.zeros_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc = (1 - a) * x[i] + a * acc
        y[i] = acc
    return y


# Progresión (acordes en MIDI) — 2 compases por acorde
chords = {
    "C": [48, 55, 60, 64, 67],
    "G": [43, 55, 59, 62, 67],
    "Am": [45, 57, 60, 64, 69],
    "F": [41, 53, 57, 60, 65],
}
order = ["C", "G", "Am", "F"]
bars = int(np.ceil(LENGTH / BAR))
end_bar = bars - 1

# Pad
for b in range(0, bars, 2):
    name = "C" if b >= end_bar - 1 else order[(b // 2) % 4]
    dur = min(2 * BAR, LENGTH - b * BAR)
    e = env(None, 0.6, 0.4, 0.8, 0.8, max(0.0, dur - 1.0))
    tt = np.arange(len(e)) / SR
    sig = np.zeros(len(e))
    for n in chords[name][1:]:
        f = midi(n)
        sig += (np.sin(2 * np.pi * f * tt) + 0.35 * np.sin(2 * np.pi * 2 * f * tt + 0.3) + 0.5 * np.sin(2 * np.pi * f * 1.004 * tt)) / 4
    place(sig * e, b * BAR, pan=0.0, gain=0.10)

# Bajo (negras en 1 y 3)
for b in range(bars):
    name = "C" if b >= end_bar - 1 else order[(b // 2) % 4]
    root = chords[name][0]
    for beat in (0, 2):
        start = b * BAR + beat * BEAT
        if start > LENGTH - 1.2 and b != end_bar:
            continue
        e = env(None, 0.01, 0.15, 0.6, 0.12, BEAT * 1.4)
        tt = np.arange(len(e)) / SR
        sig = np.sin(2 * np.pi * midi(root) * tt) + 0.25 * np.sin(2 * np.pi * midi(root + 12) * tt)
        place(sig * e, start, gain=0.20)

# Arpegio (corcheas) a partir del compás 2
arp_pattern = [2, 3, 4, 3, 1, 3, 4, 3]
for b in range(1, end_bar):
    name = order[(b // 2) % 4]
    for k in range(8):
        start = b * BAR + k * BEAT / 2
        n = chords[name][arp_pattern[k]] + 12
        e = np.exp(-np.arange(int(0.35 * SR)) / (0.09 * SR))
        tt = np.arange(len(e)) / SR
        sig = np.sin(2 * np.pi * midi(n) * tt) + 0.3 * np.sin(2 * np.pi * 2 * midi(n) * tt)
        place(sig * e, start, pan=0.35 if k % 2 else -0.35, gain=0.06)

# Percusión ligera: bombo suave (1 y 3) desde el compás 3, hi-hat en contratiempos desde el compás 5
for b in range(2, end_bar):
    for beat in (0, 2):
        start = b * BAR + beat * BEAT
        L = int(0.25 * SR)
        tt = np.arange(L) / SR
        f = 90 * np.exp(-tt * 18) + 45
        kick = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 14)
        place(kick, start, gain=0.22)
    if b >= 4:
        for k in range(4):
            start = b * BAR + k * BEAT + BEAT / 2
            L = int(0.06 * SR)
            noise = rng.standard_normal(L)
            hat = (noise - onepole_lp(noise, 6000)) * np.exp(-np.arange(L) / (0.012 * SR))
            place(hat, start, pan=0.2, gain=0.05)

# Fade in/out y final resuelto
fade_in = np.clip(t_all / 0.8, 0, 1)
fade_out = np.clip((LENGTH - t_all) / 1.6, 0, 1)
mix *= (fade_in * fade_out)[:, None]
mix /= np.max(np.abs(mix)) + 1e-9
mix *= 0.8

wav = ROOT / "assets/music-raw.wav"
sf.write(wav, mix.astype(np.float32), SR, subtype="PCM_16")
subprocess.run(
    ["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav), "-af", "loudnorm=I=-18:TP=-2:LRA=11", "-ar", str(SR), "-b:a", "192k", str(ROOT / "assets/music.mp3")],
    check=True,
)
wav.unlink()
print(f"assets/music.mp3 · {LENGTH:.1f}s · {BPM} BPM")
