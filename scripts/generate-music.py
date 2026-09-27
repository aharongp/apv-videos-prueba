"""Sintetiza la música de fondo y los efectos de sonido del VSL (sin samples externos).

La música sigue la estructura del VSL leyendo src/data/durations.json:
  - Gancho/Problema: pad tenso y ligero, sin batería.
  - Solución en adelante: entra el pulso (kick + bajo + hi-hat).
  - Llamado a la acción: capa extra de arpegio y cierre con acorde final.

Uso: python scripts/generate-music.py   (requiere numpy, scipy y soundfile)
"""
import json
import subprocess
from pathlib import Path

import numpy as np
import soundfile as sf
from scipy.signal import lfilter

ROOT = Path(__file__).resolve().parent.parent
SR = 44100
FPS = 30
BPM = 100
BEAT = 60 / BPM

script = json.loads((ROOT / "src/data/script.json").read_text())
durations = json.loads((ROOT / "src/data/durations.json").read_text())
pad = script["padSeconds"]

# Mismo redondeo a frames que src/timeline.ts para que los cambios caigan en el corte.
starts = {}
t = 0
for s in script["scenes"]:
    starts[s["id"]] = t / FPS
    t += int(np.ceil((durations[s["id"]] + pad) * FPS)) + int(round(s.get("holdSeconds", 0) * FPS))
t += int(round(script.get("endHoldSeconds", 0) * FPS))
total = t / FPS
LENGTH = total + 1.0
n = int(LENGTH * SR)
time = np.arange(n) / SR


def note(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


def lowpass(x, cutoff):
    # Filtro de un polo, suficiente para suavizar sierras.
    a = np.exp(-2 * np.pi * cutoff / SR)
    return lfilter([1 - a], [1, -a], x)


def env_adsr(length, a, r):
    e = np.ones(length)
    ai = min(int(a * SR), length)
    ri = min(int(r * SR), length)
    if ai:
        e[:ai] = np.linspace(0, 1, ai)
    if ri:
        e[-ri:] *= np.linspace(1, 0, ri)
    return e


def saw(freq, length, detune=0.0):
    ph = np.arange(length) / SR * freq * (1 + detune)
    return 2 * (ph % 1) - 1


# Progresión i–VI–III–VII en La menor (Am, F, C, G), un acorde por compás de 4 tiempos.
chords = [
    [57, 60, 64],  # Am
    [53, 57, 60],  # F
    [55, 60, 64],  # C
    [55, 59, 62],  # G
]
roots = [45, 41, 48, 43]
bar = BEAT * 4

padL = np.zeros(n)
padR = np.zeros(n)
bass = np.zeros(n)
arp = np.zeros(n)
kick = np.zeros(n)
hat = np.zeros(n)

drums_from = starts["solution"]
arp_from = starts["cta"]
end_hit = starts["advisor"]

rng = np.random.default_rng(7)

bar_i = 0
while bar_i * bar < LENGTH:
    t0 = bar_i * bar
    i0 = int(t0 * SR)
    length = min(int(bar * SR), n - i0)
    if length <= 0:
        break
    idx = bar_i % 4
    e = env_adsr(length, 0.6, 0.5)
    for m in chords[idx]:
        f = note(m)
        padL[i0 : i0 + length] += (saw(f, length, -0.004) + 0.5 * saw(f * 2, length, 0.003)) * e
        padR[i0 : i0 + length] += (saw(f, length, 0.004) + 0.5 * saw(f * 2, length, -0.003)) * e

    for b in range(8):  # corcheas
        tb = t0 + b * BEAT / 2
        if tb >= LENGTH or tb >= end_hit:
            break
        j0 = int(tb * SR)
        L = min(int(BEAT / 2 * SR), n - j0)
        env = np.exp(-np.arange(L) / SR * 9)
        if tb >= drums_from:
            f = note(roots[idx])
            bass[j0 : j0 + L] += np.sin(2 * np.pi * f * np.arange(L) / SR) * env
            if b % 2 == 1:
                hn = rng.standard_normal(L) * np.exp(-np.arange(L) / SR * 60)
                hat[j0 : j0 + L] += np.diff(np.concatenate([[0], hn]))
        if tb >= arp_from:
            m = chords[idx][b % 3] + 12
            arp[j0 : j0 + L] += np.sign(np.sin(2 * np.pi * note(m) * np.arange(L) / SR)) * env * 0.5
    for b in range(4):
        tb = t0 + b * BEAT
        if drums_from <= tb < end_hit:
            j0 = int(tb * SR)
            L = min(int(0.35 * SR), n - j0)
            tt = np.arange(L) / SR
            freq = 50 + 90 * np.exp(-tt * 30)
            kick[j0 : j0 + L] += np.sin(2 * np.pi * np.cumsum(freq) / SR) * np.exp(-tt * 9)
    bar_i += 1

# Acorde final sostenido en el cierre del asesor.
i0 = int(end_hit * SR)
L = n - i0
e = env_adsr(L, 0.05, L / SR * 0.8)
for m in [45, 57, 60, 64, 69]:
    f = note(m)
    padL[i0:] += (saw(f, L, -0.004)) * e * 0.9
    padR[i0:] += (saw(f, L, 0.004)) * e * 0.9

padL = lowpass(padL, 1400)
padR = lowpass(padR, 1400)
arp = lowpass(arp, 2500)

# "Sidechain" del pad con el kick para dar pulso.
duck = np.ones(n)
beat_t = np.arange(0, LENGTH, BEAT)
for tb in beat_t:
    if drums_from <= tb < end_hit:
        j0 = int(tb * SR)
        L = min(int(BEAT * SR), n - j0)
        duck[j0 : j0 + L] = 0.55 + 0.45 * (1 - np.exp(-np.arange(L) / SR * 8))

# Intro: pad sube desde silencio.
fade_in = np.clip(time / 2.0, 0, 1)
fade_out = np.clip((LENGTH - time) / 1.2, 0, 1)

mixL = (padL * 0.10 * duck + bass * 0.30 + kick * 0.55 + hat * 0.05 + arp * 0.05) * fade_in * fade_out
mixR = (padR * 0.10 * duck + bass * 0.30 + kick * 0.55 + hat * 0.05 + arp * 0.05) * fade_in * fade_out
mix = np.stack([mixL, mixR], axis=1)
mix = mix / np.max(np.abs(mix)) * 0.8

out = ROOT / "public/audio"
out.mkdir(parents=True, exist_ok=True)
wav = out / "music.wav"
sf.write(wav, mix.astype(np.float32), SR, subtype="PCM_16")
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav), "-b:a", "192k", str(out / "music.mp3")], check=True)
wav.unlink()

# ---------- SFX ----------


def write(name, x):
    x = x / np.max(np.abs(x)) * 0.9
    sf.write(out / f"{name}.wav", np.stack([x, x], axis=1).astype(np.float32), SR, subtype="PCM_16")


# Whoosh: ruido con barrido de filtro y envolvente en campana.
L = int(0.7 * SR)
tt = np.arange(L) / SR
noise = rng.standard_normal(L)
cut = 300 + 5000 * np.sin(np.pi * tt / tt[-1]) ** 2
y = np.empty(L)
acc = 0.0
for i in range(L):
    a = np.exp(-2 * np.pi * cut[i] / SR)
    acc = (1 - a) * noise[i] + a * acc
    y[i] = acc
write("whoosh", y * np.sin(np.pi * tt / tt[-1]) ** 2)

# Click de mouse.
L = int(0.05 * SR)
tt = np.arange(L) / SR
write("click", (np.sin(2 * np.pi * 2400 * tt) + 0.5 * rng.standard_normal(L)) * np.exp(-tt * 180))

# Ding / confirmación (dos notas).
L = int(0.9 * SR)
tt = np.arange(L) / SR
d = np.sin(2 * np.pi * note(88) * tt) * np.exp(-tt * 5)
d2 = np.zeros(L)
off = int(0.11 * SR)
d2[off:] = np.sin(2 * np.pi * note(93) * tt[: L - off]) * np.exp(-tt[: L - off] * 4)
write("ding", d + d2)

# Pop suave para listas / checks.
L = int(0.12 * SR)
tt = np.arange(L) / SR
write("pop", np.sin(2 * np.pi * (900 - 500 * tt / tt[-1]) * tt) * np.exp(-tt * 35))

# Tecleo (una pulsación; se repite en Remotion).
L = int(0.035 * SR)
tt = np.arange(L) / SR
write("key", rng.standard_normal(L) * np.exp(-tt * 250))

print(f"music.mp3 {LENGTH:.1f}s, drums from {drums_from:.1f}s, total video {total:.1f}s")
