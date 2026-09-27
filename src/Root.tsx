import React from "react";
import { Composition } from "remotion";
import { CarsVSL } from "./Video";
import { FPS, HEIGHT, WIDTH } from "./theme";
import { getTotalFrames } from "./timeline";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="CarsVSL" component={CarsVSL} defaultProps={{ lang: "es" as const }} durationInFrames={getTotalFrames("es")} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="CarsVSLEn" component={CarsVSL} defaultProps={{ lang: "en" as const }} durationInFrames={getTotalFrames("en")} fps={FPS} width={WIDTH} height={HEIGHT} />
  </>
);
