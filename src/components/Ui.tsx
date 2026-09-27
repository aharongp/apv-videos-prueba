import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { Icon, IconName } from "./Icons";
import { pop } from "./motion";

/** Etiqueta tipo "eyebrow" del sitio (mayúsculas, tracking amplio). */
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
      background: "#FFFFFF",
      border: `1.5px solid ${color}40`,
      boxShadow: `0 10px 24px ${color}1f`,
      color,
      fontFamily: theme.ui,
      fontWeight: 800,
      fontSize: 22,
      letterSpacing: "0.11em",
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
        letterSpacing: "-0.04em",
        color,
        textAlign: align,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align === "center" ? "center" : "flex-start",
        columnGap: size * 0.24,
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

/** Icono en caja blanca con halo suave, como los iconos de "Cómo comprar desde esta página". */
export const IconBadge: React.FC<{ name: IconName; color?: string; size?: number; solid?: boolean }> = ({
  name,
  color = theme.accent,
  size = 88,
  solid = false,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.26,
      background: solid ? color : "#FFFFFF",
      border: `1.5px solid ${color}33`,
      boxShadow: `0 10px 30px ${color}2e`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    <Icon name={name} size={size * 0.52} color={solid ? "#FFFFFF" : color} stroke={1.9} />
  </div>
);

export const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; glow?: string }> = ({ children, style, glow }) => (
  <div
    style={{
      background: "#FFFFFF",
      border: `1.5px solid ${glow ? glow + "55" : theme.line}`,
      borderRadius: theme.radius,
      boxShadow: glow ? `0 24px 60px ${glow}26` : theme.shadow,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Botones con el estilo del sitio. */
export const Btn: React.FC<{
  children: React.ReactNode;
  kind?: "primary" | "dark" | "ghost" | "blue";
  style?: React.CSSProperties;
}> = ({ children, kind = "primary", style }) => {
  const kinds: Record<string, React.CSSProperties> = {
    primary: { background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentDark})`, color: "#fff", boxShadow: "0 10px 24px rgba(220,38,38,.25)" },
    dark: { background: theme.text, color: "#fff" },
    ghost: { background: "#fff", color: theme.text, border: `1px solid ${theme.line}` },
    blue: { background: "linear-gradient(135deg, #2563EB, #1D4ED8)", color: "#fff", boxShadow: "0 10px 24px rgba(29,78,216,.3)" },
  };
  return (
    <div
      style={{
        borderRadius: 13,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        minHeight: 48,
        padding: "0 20px",
        fontFamily: theme.ui,
        fontWeight: 800,
        whiteSpace: "nowrap",
        ...kinds[kind],
        ...style,
      }}
    >
      {children}
    </div>
  );
};
