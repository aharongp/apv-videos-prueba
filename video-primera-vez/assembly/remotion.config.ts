import { Config } from "@remotion/cli/config";

// public/ lo rellena scripts/build.mjs (clips de HyperFrames, voz, música, fuentes).
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(95);
Config.setConcurrency(null);
