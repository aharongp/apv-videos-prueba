import React from "react";
import { Composition } from "remotion";
import { PrimeraVez } from "./PrimeraVez";
import { brand, timing } from "./data";

const common = { component: PrimeraVez, fps: timing.fps, durationInFrames: timing.totalFrames } as const;
const v = brand.layouts["9x16"];
const h = brand.layouts["16x9"];

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="PrimeraVez916Web" {...common} width={v.width} height={v.height} defaultProps={{ format: "9x16" as const, cta: "web" as const }} />
    <Composition id="PrimeraVez916Social" {...common} width={v.width} height={v.height} defaultProps={{ format: "9x16" as const, cta: "social" as const }} />
    <Composition id="PrimeraVez169Web" {...common} width={h.width} height={h.height} defaultProps={{ format: "16x9" as const, cta: "web" as const }} />
  </>
);
