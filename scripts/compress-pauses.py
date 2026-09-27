"""Acorta las pausas largas de las locuciones (algunos TTS dejan 1-5 s entre frases).
Uso: python scripts/compress-pauses.py public/audio/vo/*.wav   (requiere numpy y soundfile)"""
import sys
import numpy as np
import soundfile as sf

MAX_PAUSE = 0.32  # s de silencio que se conservan entre frases
WIN = 0.02        # ventana de análisis (s)

for f in sys.argv[1:]:
    x, sr = sf.read(f)
    if x.ndim > 1:
        x = x.mean(axis=1)
    w = int(WIN * sr)
    n = len(x) // w
    rms = np.sqrt(np.mean(x[: n * w].reshape(n, w) ** 2, axis=1) + 1e-12)
    db = 20 * np.log10(rms)
    thr = np.percentile(db, 90) - 30  # 30 dB por debajo de la voz = pausa
    quiet = db < thr
    keep = np.ones(n, bool)
    i = 0
    while i < n:
        if quiet[i]:
            j = i
            while j < n and quiet[j]:
                j += 1
            run = j - i
            limit = int(MAX_PAUSE / WIN)
            if run > limit:
                s = i + limit // 2
                keep[s : s + run - limit] = False
            i = j
        else:
            i += 1
    y = np.concatenate([x[k * w : (k + 1) * w] for k in range(n) if keep[k]] + [x[n * w :]])
    sf.write(f, y, sr, subtype="PCM_16")
    print(f"{f}: {len(x)/sr:.1f}s -> {len(y)/sr:.1f}s")
