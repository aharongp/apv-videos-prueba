import React from "react";
import { interpolate, useCurrentFrame, Easing } from "remotion";
import { brand, theme } from "../theme";
import { clamp } from "./motion";

export const Logo: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: size * 0.3 }}>
    <div
      style={{
        width: size * 1.1,
        height: size * 1.1,
        borderRadius: size * 0.28,
        background: `linear-gradient(135deg, ${theme.accent}, #B3121F)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: theme.display,
        fontWeight: 900,
        fontSize: size * 0.5,
        color: "white",
        boxShadow: `0 ${size * 0.15}px ${size * 0.5}px ${theme.accent}55`,
      }}
    >
      APV
    </div>
    <div style={{ fontFamily: theme.display, fontWeight: 900, fontSize: size * 0.62, color: theme.text, letterSpacing: size * 0.02 }}>
      APV<span style={{ color: theme.accent }}> MOTORS</span>
    </div>
  </div>
);

export const BrowserFrame: React.FC<{
  url: string;
  showCaret?: boolean;
  width?: number;
  height?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ url, showCaret = false, width = 1400, height = 800, children, style }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 22,
        background: "#0A1120",
        border: `1px solid rgba(255,255,255,0.14)`,
        boxShadow: "0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03) inset",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      <div style={{ height: 64, display: "flex", alignItems: "center", gap: 18, padding: "0 22px", background: "#0E1729", borderBottom: `1px solid ${theme.line}` }}>
        <div style={{ display: "flex", gap: 9 }}>
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
            <div key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />
          ))}
        </div>
        <div
          style={{
            flex: 1,
            height: 40,
            borderRadius: 20,
            background: "#060B16",
            border: `1px solid ${theme.line}`,
            display: "flex",
            alignItems: "center",
            padding: "0 18px",
            gap: 10,
            fontFamily: theme.ui,
            fontSize: 21,
            color: theme.text,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.success} strokeWidth="2.5">
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 018 0v4" />
          </svg>
          <span>
            <span style={{ color: theme.muted }}>{url.length > 0 ? "https://" : ""}</span>
            {url}
          </span>
          {showCaret && <span style={{ width: 2, height: 24, background: theme.text, opacity: Math.floor(frame / 12) % 2 ? 0 : 1 }} />}
        </div>
      </div>
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>{children}</div>
    </div>
  );
};

export const SiteHeader: React.FC = () => (
  <div
    style={{
      height: 76,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 36px",
      borderBottom: `1px solid ${theme.line}`,
      background: "rgba(255,255,255,0.02)",
    }}
  >
    <Logo size={34} />
    <div style={{ display: "flex", gap: 34, fontFamily: theme.ui, fontWeight: 500, fontSize: 20, color: theme.muted }}>
      <span style={{ color: theme.text }}>Inventario</span>
      <span>Cómo funciona</span>
      <span>Contacto</span>
    </div>
    <div
      style={{
        padding: "10px 20px",
        borderRadius: 10,
        background: theme.accent,
        color: "white",
        fontFamily: theme.ui,
        fontWeight: 700,
        fontSize: 18,
      }}
    >
      Hablar con un asesor
    </div>
  </div>
);

export type CursorPoint = { f: number; x: number; y: number; click?: boolean };

/** Puntero animado que recorre puntos clave y muestra un "ripple" en cada clic. */
export const Cursor: React.FC<{ points: CursorPoint[] }> = ({ points }) => {
  const frame = useCurrentFrame();
  const fs = points.map((p) => p.f);
  const opts = { ...clamp, easing: Easing.bezier(0.65, 0, 0.35, 1) };
  const x = points.length > 1 ? interpolate(frame, fs, points.map((p) => p.x), opts) : points[0].x;
  const y = points.length > 1 ? interpolate(frame, fs, points.map((p) => p.y), opts) : points[0].y;
  const clicks = points.filter((p) => p.click);
  const lastClick = clicks.filter((c) => frame >= c.f).pop();
  const since = lastClick ? frame - lastClick.f : 999;
  const press = since < 6 ? 0.85 : 1;
  const visible = interpolate(frame, [fs[0] - 8, fs[0]], [0, 1], clamp);

  return (
    <div style={{ position: "absolute", left: x, top: y, pointerEvents: "none", opacity: visible, zIndex: 50 }}>
      {since < 18 && (
        <div
          style={{
            position: "absolute",
            left: -40,
            top: -40,
            width: 80,
            height: 80,
            borderRadius: 40,
            border: `4px solid ${theme.accent2}`,
            transform: `scale(${0.3 + since / 14})`,
            opacity: 1 - since / 18,
          }}
        />
      )}
      <svg width="46" height="46" viewBox="0 0 24 24" style={{ transform: `scale(${press})`, transformOrigin: "0 0", filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.5))" }}>
        <path d="M4 2l15 11-7 1.2L8.5 21z" fill="white" stroke="#111" strokeWidth="1.3" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

export const typed = (text: string, frame: number, start: number, cps = 18) =>
  text.slice(0, Math.max(0, Math.floor(((frame - start) / 30) * cps)));

export { brand };
