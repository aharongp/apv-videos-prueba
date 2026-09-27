import { interpolate, spring, Easing } from "remotion";
import type { CSSProperties } from "react";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const pop = (frame: number, fps: number, delay = 0, damping = 14) =>
  spring({ frame: frame - delay, fps, config: { damping, mass: 0.6, stiffness: 140 } });

export const ease = (frame: number, start: number, end: number, from = 0, to = 1) =>
  interpolate(frame, [start, end], [from, to], { ...clamp, easing: Easing.bezier(0.22, 1, 0.36, 1) });

export const fadeUp = (p: number, dist = 40): CSSProperties => ({
  opacity: Math.min(1, Math.max(0, p)),
  transform: `translateY(${(1 - p) * dist}px)`,
});

export const popIn = (p: number): CSSProperties => ({
  opacity: Math.min(1, Math.max(0, p * 1.5)),
  transform: `scale(${0.6 + 0.4 * p})`,
});
