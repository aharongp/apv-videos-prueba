import React from "react";
import { Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { brand, theme } from "../theme";
import { clamp } from "./motion";
import { useLang, useT } from "../i18n";

/** Logo oficial (PNG de cars.apvmotorusa.com, 495×219). `height` en px. */
export const Logo: React.FC<{ height?: number; style?: React.CSSProperties }> = ({ height = 44, style }) => (
  <Img src={staticFile(brand.logo)} style={{ height, width: (height * 495) / 219, display: "block", ...style }} />
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
        borderRadius: 20,
        background: "#FFFFFF",
        border: `1px solid ${theme.line}`,
        boxShadow: "0 40px 100px rgba(15,23,42,0.18), 0 8px 24px rgba(15,23,42,0.08)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      <div style={{ height: 58, display: "flex", alignItems: "center", gap: 18, padding: "0 20px", background: theme.soft, borderBottom: `1px solid ${theme.line}` }}>
        <div style={{ display: "flex", gap: 9 }}>
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
            <div key={c} style={{ width: 13, height: 13, borderRadius: 7, background: c }} />
          ))}
        </div>
        <div
          style={{
            flex: 1,
            height: 36,
            borderRadius: 18,
            background: "#FFFFFF",
            border: `1px solid ${theme.line}`,
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            gap: 10,
            fontFamily: theme.ui,
            fontWeight: 500,
            fontSize: 19,
            color: theme.text,
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={theme.success} strokeWidth="2.5">
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 018 0v4" />
          </svg>
          <span>
            <span style={{ color: theme.muted }}>{url.length > 0 ? "https://" : ""}</span>
            {url}
          </span>
          {showCaret && <span style={{ width: 2, height: 22, background: theme.text, opacity: Math.floor(frame / 12) % 2 ? 0 : 1 }} />}
        </div>
      </div>
      <div style={{ flex: 1, position: "relative", overflow: "hidden", background: "#FFFFFF" }}>{children}</div>
    </div>
  );
};

/** Barra superior real del sitio: logo, navegación, ES|EN, Iniciar sesión, Ver vehículos. */
export const SiteHeader: React.FC<{ loggedIn?: boolean }> = ({ loggedIn = false }) => {
  const t = useT();
  const lang = useLang();
  const on: React.CSSProperties = { background: theme.accent, color: "#fff", borderRadius: 999, padding: "2px 8px" };
  const off: React.CSSProperties = { color: theme.muted };
  return (
    <div
      style={{
        height: 68,
        display: "flex",
        alignItems: "center",
        gap: 24,
        padding: "0 34px",
        borderBottom: "1px solid rgba(219,228,238,.85)",
        background: "rgba(255,255,255,.95)",
        fontFamily: theme.ui,
      }}
    >
      <Logo height={36} />
      <div style={{ display: "flex", gap: 24, marginLeft: "auto", fontWeight: 700, fontSize: 16, color: theme.slate }}>
        <span>{t("Catálogo", "Catalog")}</span>
        <span>{t("Cómo comprar", "How to buy")}</span>
        <span>{t("Ayuda", "Help")}</span>
        <span>{t("Planes", "Plans")}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 8px", borderRadius: 999, border: `1px solid ${theme.line}`, background: theme.soft, fontSize: 13, fontWeight: 800 }}>
        <span style={lang === "en" ? off : on}>ES</span>
        <span style={lang === "en" ? on : off}>EN</span>
      </div>
      {loggedIn ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px 6px 6px", borderRadius: 999, border: `1px solid ${theme.line}`, fontWeight: 700, fontSize: 15, color: theme.text }}>
          <span style={{ width: 30, height: 30, borderRadius: 15, background: theme.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900 }}>MG</span>
          {t("Mi cuenta", "My account")}
        </div>
      ) : (
        <div style={{ padding: "9px 16px", borderRadius: 11, border: `1px solid ${theme.line}`, fontWeight: 800, fontSize: 15, color: theme.text }}>{t("Iniciar sesión", "Log in")}</div>
      )}
      <div style={{ padding: "10px 16px", borderRadius: 11, background: theme.text, color: "#fff", fontWeight: 800, fontSize: 15 }}>{t("Ver vehículos", "View vehicles")}</div>
    </div>
  );
};

export type CursorPoint = { f: number; x: number; y: number; click?: boolean };

/** Puntero animado que recorre puntos clave y muestra un "ripple" en cada clic. */
export const Cursor: React.FC<{ points: CursorPoint[] }> = ({ points: raw }) => {
  const frame = useCurrentFrame();
  // Garantiza tiempos estrictamente crecientes aunque dos frases de la locución queden muy juntas.
  const points = raw.reduce<CursorPoint[]>((acc, p) => [...acc, { ...p, f: acc.length ? Math.max(p.f, acc[acc.length - 1].f + 3) : p.f }], []);
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
            border: `4px solid ${theme.accent}`,
            transform: `scale(${0.3 + since / 14})`,
            opacity: 1 - since / 18,
          }}
        />
      )}
      <svg width="44" height="44" viewBox="0 0 24 24" style={{ transform: `scale(${press})`, transformOrigin: "0 0", filter: "drop-shadow(0 6px 10px rgba(15,23,42,0.35))" }}>
        <path d="M4 2l15 11-7 1.2L8.5 21z" fill={theme.text} stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

export const typed = (text: string, frame: number, start: number, cps = 18) =>
  text.slice(0, Math.max(0, Math.floor(((frame - start) / 30) * cps)));

export { brand };
