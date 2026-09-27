import React from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame, Audio, staticFile } from "remotion";
import { clamp } from "./motion";

/** Entrada/salida de cada escena: zoom + desenfoque para cortes con energía. */
export const SceneShell: React.FC<{ duration: number; children: React.ReactNode }> = ({ duration, children }) => {
  const frame = useCurrentFrame();
  const inP = interpolate(frame, [0, 14], [0, 1], clamp);
  const outP = interpolate(frame, [duration - 8, duration], [0, 1], clamp);
  return (
    <AbsoluteFill
      style={{
        opacity: inP * (1 - outP),
        transform: `scale(${1.06 - 0.06 * inP - 0.03 * outP})`,
        filter: `blur(${(1 - inP) * 12 + outP * 8}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Muestra un bloque entre `from` y `to` (frames relativos a la escena) con fundidos. */
export const Beat: React.FC<{ from: number; to?: number; fade?: number; children: React.ReactNode }> = ({
  from,
  to,
  fade = 8,
  children,
}) => {
  const dur = to !== undefined ? Math.max(1, to - from) : undefined;
  return (
    <Sequence from={from} durationInFrames={dur} layout="none">
      <BeatInner dur={dur} fade={fade}>
        {children}
      </BeatInner>
    </Sequence>
  );
};

const BeatInner: React.FC<{ dur?: number; fade: number; children: React.ReactNode }> = ({ dur, fade, children }) => {
  const frame = useCurrentFrame();
  const inO = interpolate(frame, [0, fade], [0, 1], clamp);
  const outO = dur ? interpolate(frame, [dur - fade, dur], [1, 0], clamp) : 1;
  return <AbsoluteFill style={{ opacity: Math.min(inO, outO) }}>{children}</AbsoluteFill>;
};

export type Sfx = "click" | "pop" | "ding" | "whoosh" | "key";

/** Efecto de sonido en un frame concreto de la escena. */
export const SfxAt: React.FC<{ at: number; name: Sfx; volume?: number }> = ({ at, name, volume = 0.5 }) => (
  <Sequence from={Math.max(0, Math.round(at))} durationInFrames={30} layout="none">
    <Audio src={staticFile(`audio/${name}.wav`)} volume={volume} />
  </Sequence>
);

/** Tecleo: una pulsación cada 2 frames durante `frames`. */
export const Typing: React.FC<{ at: number; frames: number; volume?: number }> = ({ at, frames, volume = 0.25 }) => (
  <>
    {Array.from({ length: Math.floor(frames / 2) }, (_, i) => (
      <SfxAt key={i} at={at + i * 2} name="key" volume={volume * (0.7 + ((i * 37) % 10) / 30)} />
    ))}
  </>
);
