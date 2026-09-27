import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../theme";

/** Fondo claro al estilo del hero de cars.apvmotorusa.com: degradado azul muy suave,
 * orbes difusos y una cuadrícula en perspectiva que avanza como carretera. */
export const Background: React.FC<{ tint?: string }> = ({ tint = theme.accent }) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const road = (frame * 5) % 120;

  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #F0F7FF 0%, #FFFFFF 70%)", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: 1100,
          height: 1100,
          left: 1150 + Math.sin(t * 0.35) * 70,
          top: -520 + Math.cos(t * 0.3) * 50,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(37,99,235,0.16) 0%, transparent 62%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          left: -380 + Math.cos(t * 0.28) * 60,
          top: 420 + Math.sin(t * 0.32) * 40,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${tint}1f 0%, transparent 62%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -960,
          right: -960,
          bottom: -200,
          height: 640,
          transform: "perspective(600px) rotateX(64deg)",
          transformOrigin: "50% 100%",
          backgroundImage: "linear-gradient(rgba(15,23,42,0.06) 2px, transparent 2px), linear-gradient(90deg, rgba(15,23,42,0.06) 2px, transparent 2px)",
          backgroundSize: "120px 120px",
          backgroundPosition: `0 ${road}px`,
          maskImage: "linear-gradient(to top, black 5%, transparent 85%)",
          WebkitMaskImage: "linear-gradient(to top, black 5%, transparent 85%)",
        }}
      />
    </AbsoluteFill>
  );
};
