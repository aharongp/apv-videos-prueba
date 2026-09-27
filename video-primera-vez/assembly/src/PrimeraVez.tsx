import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio, Video } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { loadFont } from "@remotion/fonts";
import { brand, copy, CtaVariant, Format, layout, timing, voiceSpans } from "./data";

const fontsReady = Promise.all(
  Object.entries(brand.font.files).map(([weight, file]) =>
    loadFont({ family: brand.font.family, url: staticFile(`fonts/${file.split("/").pop()}`), weight }),
  ),
);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const T = timing.transitionFrames;
const transitionTiming = linearTiming({ durationInFrames: T, easing: Easing.inOut(Easing.cubic) });

// Tipo de transición a la SALIDA de cada escena (barrido entre bloques, fundido dentro del bloque del móvil).
const exitTransition: Record<string, "wipe" | "fade"> = {
  "escena-01": "wipe",
  "escena-02": "fade",
  "escena-03": "wipe",
  "escena-04": "fade",
  "escena-05": "fade",
  "escena-06": "fade",
  "escena-07": "fade",
  "escena-08": "wipe",
  "escena-09": "wipe",
  "escena-10": "fade",
};

export const PrimeraVez: React.FC<{ format: Format; cta: CtaVariant }> = ({ format, cta }) => {
  const [handle] = useState(() => delayRender("Cargando Inter"));
  useEffect(() => {
    fontsReady.then(() => continueRender(handle));
  }, [handle]);

  const scenes = timing.scenes;
  const last = scenes[scenes.length - 1];

  return (
    <AbsoluteFill style={{ background: brand.colors.background }}>
      {/* Clips de escena (HyperFrames). Cada clip dura su escena + 12 frames de colchón; la transición
          consume T de esos frames, así la suma total es exactamente timing.totalFrames. */}
      <TransitionSeries>
        {scenes.map((s, i) => {
          const isLast = i === scenes.length - 1;
          const items = [
            <TransitionSeries.Sequence key={s.id} durationInFrames={s.durationFrames + (isLast ? 0 : T)} name={s.id}>
              <Video src={staticFile(`clips/${format}/${s.id}.mp4`)} muted />
            </TransitionSeries.Sequence>,
          ];
          if (!isLast) {
            const kind = exitTransition[s.id] ?? "fade";
            items.push(
              kind === "wipe" ? (
                <TransitionSeries.Transition key={`${s.id}-t`} presentation={wipe({ direction: "from-right" })} timing={transitionTiming} />
              ) : (
                <TransitionSeries.Transition key={`${s.id}-t`} presentation={fade()} timing={transitionTiming} />
              ),
            );
          }
          return items;
        })}
      </TransitionSeries>

      <Captions format={format} />

      <Sequence from={last.startFrame} name="CTA">
        <Cta format={format} variant={cta} />
      </Sequence>

      <Audio src={staticFile("audio/vo.mp3")} />
      <Audio src={staticFile("audio/music.mp3")} volume={(f) => musicVolume(f)} />
    </AbsoluteFill>
  );
};

/** Ducking: la música queda en su nivel base (-18 LUFS) bajo la voz y sube ~3 dB en los huecos sin voz. */
const musicVolume = (f: number) => {
  const RAMP = 8;
  let d = Infinity;
  for (const [a, b] of voiceSpans) {
    if (f >= a && f <= b) return 1;
    d = Math.min(d, Math.abs(f - a), Math.abs(f - b));
  }
  return interpolate(d, [0, RAMP], [1, 1.4], clamp);
};

const Captions: React.FC<{ format: Format }> = ({ format }) => {
  const frame = useCurrentFrame();
  const L = layout(format);
  const cap = timing.captions.find((c) => frame >= c.startFrame && frame < c.endFrame);
  if (!cap) return null;
  const inP = interpolate(frame, [cap.startFrame, cap.startFrame + 4], [0, 1], clamp);
  const outP = interpolate(frame, [cap.endFrame - 3, cap.endFrame], [1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: L.sideMargin,
        right: L.sideMargin,
        top: L.captionBand.top,
        height: L.captionBand.bottom - L.captionBand.top,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: Math.min(inP, outP),
      }}
    >
      <div
        style={{
          background: brand.colors.ink,
          color: brand.colors.white,
          borderRadius: 18,
          padding: format === "9x16" ? "14px 26px" : "12px 28px",
          fontFamily: brand.font.family,
          fontWeight: 800,
          fontSize: L.captionFontSize,
          lineHeight: 1.18,
          letterSpacing: "-0.01em",
          textAlign: "center",
          transform: `translateY(${(1 - inP) * 10}px)`,
        }}
      >
        {cap.lines.map((line, i) => (
          <div key={i} style={{ whiteSpace: "nowrap" }}>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
};

const Cta: React.FC<{ format: Format; variant: CtaVariant }> = ({ format, variant }) => {
  const frame = useCurrentFrame();
  const L = layout(format);
  const p = interpolate(frame, [8, 22], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const text = copy.cta[variant];
  const small = variant === "social";
  return (
    <div
      style={{
        position: "absolute",
        left: L.sideMargin,
        right: L.sideMargin,
        top: L.ctaBand.top,
        height: L.ctaBand.bottom - L.ctaBand.top,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: p,
        transform: `translateY(${(1 - p) * 24}px)`,
      }}
    >
      <div
        style={{
          background: brand.colors.accent,
          color: brand.colors.white,
          borderRadius: 999,
          padding: format === "9x16" ? "22px 44px" : "20px 46px",
          fontFamily: brand.font.family,
          fontWeight: 900,
          letterSpacing: "-0.02em",
          fontSize: format === "9x16" ? (small ? 50 : 58) : small ? 42 : 48,
          lineHeight: 1.12,
          textAlign: "center",
          maxWidth: format === "9x16" ? 860 : 1100,
        }}
      >
        {ctaLines(text).map((line, i) => (
          <div key={i} style={{ whiteSpace: "nowrap" }}>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
};

/** CTA largo en dos líneas equilibradas (sin palabras huérfanas); corto, en una. */
const ctaLines = (text: string) => {
  const words = text.split(" ");
  if (text.length <= 26) return [text];
  let best = [text];
  let bestScore = Infinity;
  for (let k = 1; k < words.length; k++) {
    const a = words.slice(0, k).join(" ");
    const b = words.slice(k).join(" ");
    // no terminar línea en palabra de enlace; mejor empezar la segunda con «y», «de», «en»…
    const weak = /^(y|e|o|de|del|el|la|los|las|en|a|al|te|tu|un|una|por|para|con)$/i;
    const score = Math.abs(a.length - b.length) + (weak.test(words[k - 1]) ? 10 : 0) - (/^(y|de|en|para|con)$/i.test(words[k]) ? 6 : 0);
    if (score < bestScore) {
      bestScore = score;
      best = [a, b];
    }
  }
  return best;
};
