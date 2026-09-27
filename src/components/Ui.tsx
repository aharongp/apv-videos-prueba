import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { Icon, IconName } from "./Icons";
import { pop } from "./motion";

/** Etiqueta de sección (arriba a la izquierda). */
export const Kicker: React.FC<{ children: React.ReactNode; color?: string; style?: React.CSSProperties }> = ({
  children,
  color = theme.accent,
  style,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      padding: "10px 22px",
      borderRadius: 999,
      background: `${color}1f`,
      border: `1.5px solid ${color}66`,
      color,
      fontFamily: theme.display,
      fontWeight: 800,
      fontSize: 24,
      letterSpacing: 3,
      textTransform: "uppercase",
      ...style,
    }}
  >
    <span style={{ width: 10, height: 10, borderRadius: 5, background: color }} />
    {children}
  </div>
);

/** Titular con palabras que entran escalonadas. Usa *palabra* para resaltar. */
export const Kinetic: React.FC<{
  text: string;
  delay?: number;
  size?: number;
  color?: string;
  highlight?: string;
  stagger?: number;
  align?: "center" | "left";
  weight?: number;
  style?: React.CSSProperties;
}> = ({ text, delay = 0, size = 96, color = theme.text, highlight = theme.accent, stagger = 3, align = "center", weight = 900, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");
  return (
    <div
      style={{
        fontFamily: theme.display,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1.08,
        letterSpacing: -size * 0.02,
        color,
        textAlign: align,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align === "center" ? "center" : "flex-start",
        columnGap: size * 0.26,
        ...style,
      }}
    >
      {words.map((w, i) => {
        const hl = w.startsWith("*");
        const clean = w.replace(/\*/g, "");
        const p = pop(frame, fps, delay + i * stagger, 12);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              color: hl ? highlight : undefined,
              opacity: Math.min(1, p * 1.4),
              transform: `translateY(${(1 - p) * size * 0.5}px) rotate(${(1 - p) * 6}deg)`,
            }}
          >
            {clean}
          </span>
        );
      })}
    </div>
  );
};

export const IconBadge: React.FC<{ name: IconName; color?: string; size?: number }> = ({ name, color = theme.accent, size = 88 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.28,
      background: `${color}1c`,
      border: `1.5px solid ${color}55`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    <Icon name={name} size={size * 0.52} color={color} />
  </div>
);

export const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; glow?: string }> = ({ children, style, glow }) => (
  <div
    style={{
      background: `linear-gradient(180deg, ${theme.panel2}, ${theme.panel})`,
      border: `1px solid ${glow ? glow + "88" : theme.line}`,
      borderRadius: 26,
      boxShadow: glow ? `0 0 60px ${glow}33, 0 30px 60px rgba(0,0,0,0.4)` : "0 30px 60px rgba(0,0,0,0.4)",
      ...style,
    }}
  >
    {children}
  </div>
);
