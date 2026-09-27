// Única fuente de verdad compartida con HyperFrames (raíz del proyecto).
import brandJson from "../../brand.json";
import copyJson from "../../copy.json";
import timingJson from "../../timing.json";

export type Format = "9x16" | "16x9";
export type CtaVariant = "web" | "social";

export const brand = brandJson;
export const copy = copyJson;
export const timing = timingJson as {
  fps: number;
  totalFrames: number;
  clipTailFrames: number;
  transitionFrames: number;
  scenes: { id: string; startFrame: number; durationFrames: number; voStartFrames: number; voFrames: number }[];
  captions: { scene: string; text: string; lines: string[]; startFrame: number; endFrame: number }[];
};

export const layout = (format: Format) => brand.layouts[format];

/** Tramos (en frames absolutos) en los que suena la locución, para el ducking de la música. */
export const voiceSpans = timing.scenes.map((s) => [s.startFrame + s.voStartFrames, s.startFrame + s.voStartFrames + s.voFrames] as const);
