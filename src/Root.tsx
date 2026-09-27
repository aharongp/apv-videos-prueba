import React from "react";
import { Composition } from "remotion";
import { CarsVSL } from "./Video";
import { FPS, HEIGHT, WIDTH } from "./theme";
import { totalFrames } from "./timeline";

export const RemotionRoot: React.FC = () => (
  <Composition id="CarsVSL" component={CarsVSL} durationInFrames={totalFrames} fps={FPS} width={WIDTH} height={HEIGHT} />
);
