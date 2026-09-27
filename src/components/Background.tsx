import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../theme";

/** Fondo animado: gradiente oscuro, orbes de luz y una "carretera" en perspectiva. */
export const Background: React.FC<{ tint?: string }> = ({ tint = theme.accent }) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const road = (frame * 6) % 120;

  return (
    <AbsoluteFill style={{ background: theme.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(1200px 700px at ${50 + Math.sin(t * 0.3) * 12}% ${30 + Math.cos(t * 0.25) * 8}%, ${theme.bg2} 0%, ${theme.bg} 70%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          left: 1300 + Math.sin(t * 0.4) * 80,
          top: -300 + Math.cos(t * 0.35) * 60,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${tint}33 0%, transparent 65%)`,
          filter: "blur(20px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          left: -250 + Math.cos(t * 0.3) * 60,
          top: 500 + Math.sin(t * 0.33) * 50,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${theme.link}26 0%, transparent 65%)`,
          filter: "blur(20px)",
        }}
      />
      {/* Grid en perspectiva */}
      <div
        style={{
          position: "absolute",
          left: -960,
          right: -960,
          bottom: -200,
          height: 700,
          transform: "perspective(600px) rotateX(62deg)",
          transformOrigin: "50% 100%",
          backgroundImage: `linear-gradient(${theme.line} 2px, transparent 2px), linear-gradient(90deg, ${theme.line} 2px, transparent 2px)`,
          backgroundSize: "120px 120px",
          backgroundPosition: `0 ${road}px`,
          maskImage: "linear-gradient(to top, black 10%, transparent 90%)",
          WebkitMaskImage: "linear-gradient(to top, black 10%, transparent 90%)",
          opacity: 0.8,
        }}
      />
      {/* Viñeta */}
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, transparent 55%, rgba(0,0,0,0.55) 100%)" }} />
    </AbsoluteFill>
  );
};
