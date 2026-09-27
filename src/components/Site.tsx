import React from "react";
// Maqueta ilustrativa del sitio cars.apvmotorusa.com usada en la demo.
import { useCurrentFrame, useVideoConfig } from "remotion";
import { brand, theme } from "../theme";
import { Car, CarKind } from "./Car";
import { Icon } from "./Icons";
import { SiteHeader } from "./Browser";
import { pop, popIn } from "./motion";

export type Listing = {
  year: number;
  make: string;
  model: string;
  kind: CarKind;
  color: string;
  miles: string;
  title: string;
  bid: string;
  when: string;
};

export const inventory: Listing[] = [
  { year: 2020, make: "Honda", model: "Civic EX", kind: "sedan", color: "#E5E7EB", miles: "38,420", title: "Clean", bid: "$9,800", when: "en 2 días" },
  { year: 2019, make: "Ford", model: "F-150 XLT", kind: "pickup", color: "#60A5FA", miles: "61,200", title: "Clean", bid: "$14,250", when: "hoy" },
  { year: 2021, make: "Toyota", model: "RAV4 XLE", kind: "suv", color: "#EF4444", miles: "42,180", title: "Clean", bid: "$12,400", when: "en 3 días" },
  { year: 2018, make: "Chevrolet", model: "Tahoe LT", kind: "suv", color: "#94A3B8", miles: "74,900", title: "Rebuilt", bid: "$15,900", when: "mañana" },
  { year: 2022, make: "Nissan", model: "Altima SV", kind: "sedan", color: "#F59E0B", miles: "28,300", title: "Clean", bid: "$11,300", when: "en 4 días" },
  { year: 2020, make: "Jeep", model: "Wrangler", kind: "suv", color: "#22C55E", miles: "51,700", title: "Clean", bid: "$16,700", when: "en 2 días" },
];

export const filtered: Listing[] = [
  { year: 2021, make: "Toyota", model: "RAV4 XLE", kind: "suv", color: "#EF4444", miles: "42,180", title: "Clean", bid: "$12,400", when: "en 3 días" },
  { year: 2020, make: "Toyota", model: "RAV4 LE", kind: "suv", color: "#E5E7EB", miles: "55,020", title: "Clean", bid: "$10,900", when: "mañana" },
  { year: 2022, make: "Toyota", model: "RAV4 XLE Premium", kind: "suv", color: "#60A5FA", miles: "31,560", title: "Clean", bid: "$15,200", when: "en 5 días" },
  { year: 2019, make: "Toyota", model: "RAV4 Adventure", kind: "suv", color: "#94A3B8", miles: "68,300", title: "Clean", bid: "$9,700", when: "hoy" },
  { year: 2023, make: "Toyota", model: "RAV4 LE", kind: "suv", color: "#A78BFA", miles: "19,870", title: "Clean", bid: "$17,400", when: "en 6 días" },
  { year: 2021, make: "Toyota", model: "RAV4 Limited", kind: "suv", color: "#F59E0B", miles: "44,010", title: "Rebuilt", bid: "$11,600", when: "en 2 días" },
];

export const CarThumb: React.FC<{ l: Listing; height: number; carWidth: number }> = ({ l, height, carWidth }) => (
  <div
    style={{
      height,
      background: `radial-gradient(circle at 50% 70%, ${l.color}33, #0B1324 70%)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Car kind={l.kind} color={l.color} width={carWidth} />
  </div>
);

export const ListingCard: React.FC<{ l: Listing; appear: number; highlight?: boolean }> = ({ l, appear, highlight }) => (
  <div
    style={{
      ...popIn(appear),
      borderRadius: 16,
      overflow: "hidden",
      background: theme.panel,
      border: `1.5px solid ${highlight ? theme.accent2 : theme.line}`,
      boxShadow: highlight ? `0 0 30px ${theme.accent2}55` : undefined,
    }}
  >
    <CarThumb l={l} height={112} carWidth={220} />
    <div style={{ padding: "10px 14px 12px", fontFamily: theme.ui }}>
      <div style={{ fontWeight: 700, fontSize: 19, color: theme.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {l.year} {l.make} {l.model}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 15, color: theme.muted }}>
        <span>{l.miles} mi · {l.title}</span>
        <span style={{ color: theme.accent2, fontWeight: 700 }}>Subasta {l.when}</span>
      </div>
    </div>
  </div>
);

export const SiteHome: React.FC<{ reveal: number }> = ({ reveal }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ position: "absolute", inset: 0, opacity: Math.min(1, reveal * 2) }}>
      <SiteHeader />
      <div
        style={{
          padding: "44px 60px 30px",
          background: `linear-gradient(120deg, ${theme.accent}22, transparent 60%)`,
          borderBottom: `1px solid ${theme.line}`,
        }}
      >
        <div style={{ fontFamily: theme.display, fontWeight: 900, fontSize: 50, color: theme.text, maxWidth: 800, lineHeight: 1.08 }}>{brand.heroTitle}</div>
        <div style={{ marginTop: 26, display: "flex", gap: 14 }}>
          <div
            style={{
              flex: 1,
              maxWidth: 760,
              height: 62,
              borderRadius: 14,
              background: "#060B16",
              border: `1px solid ${theme.line}`,
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "0 20px",
              fontFamily: theme.ui,
              fontSize: 22,
              color: theme.muted,
            }}
          >
            <Icon name="search" size={26} color={theme.muted} /> Marca, modelo o año…
          </div>
          <div style={{ padding: "0 34px", display: "flex", alignItems: "center", borderRadius: 14, background: theme.accent, color: "white", fontFamily: theme.ui, fontWeight: 700, fontSize: 22 }}>
            Buscar
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22, padding: "26px 60px" }}>
        {inventory.slice(0, 3).map((l, i) => (
          <ListingCard key={i} l={l} appear={reveal >= 1 ? pop(frame, fps, i * 4, 16) : 0} />
        ))}
      </div>
    </div>
  );
};

export const Field: React.FC<{ label: string; value: string; active?: boolean; width?: number | string; placeholder?: string }> = ({
  label,
  value,
  active,
  width = "100%",
  placeholder,
}) => (
  <div style={{ width, fontFamily: theme.ui }}>
    <div style={{ fontSize: 15, fontWeight: 600, color: theme.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
    <div
      style={{
        height: 52,
        borderRadius: 12,
        background: "#060B16",
        border: `1.5px solid ${active ? theme.accent2 : value ? "rgba(255,255,255,0.22)" : theme.line}`,
        boxShadow: active ? `0 0 0 4px ${theme.accent2}33` : undefined,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        fontSize: 20,
        fontWeight: 600,
        color: value ? theme.text : theme.muted,
        whiteSpace: "nowrap",
        overflow: "hidden",
      }}
    >
      <span>{value || placeholder || "Todos"}</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.muted} strokeWidth="2.5">
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  </div>
);

export const DetailPage: React.FC<{ l: Listing; rowHighlight: number; buttonPulse?: number; photoFocus?: boolean }> = ({
  l,
  rowHighlight,
  buttonPulse = 0,
  photoFocus = false,
}) => {
  const rows: [string, string][] = [
    ["Millaje", `${l.miles} mi`],
    ["Tipo de título", `${l.title} title`],
    ["Daño reportado", "Frontal leve"],
    ["Fecha de subasta", "Jueves · 10:00 AM CT"],
    ["Ubicación", brand.location],
  ];
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <SiteHeader />
      <div style={{ display: "flex", gap: 36, padding: "28px 40px" }}>
        <div style={{ width: 600 }}>
          <div
            style={{
              borderRadius: 18,
              overflow: "hidden",
              border: `2px solid ${photoFocus ? theme.accent2 : theme.line}`,
              boxShadow: photoFocus ? `0 0 40px ${theme.accent2}55` : undefined,
            }}
          >
            <CarThumb l={l} height={330} carWidth={520} />
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: 92,
                  borderRadius: 12,
                  border: `1.5px solid ${i === 0 ? theme.accent2 : theme.line}`,
                  background: `radial-gradient(circle at ${30 + i * 15}% 60%, ${l.color}44, #0B1324 70%)`,
                }}
              />
            ))}
          </div>
        </div>
        <div style={{ flex: 1, fontFamily: theme.ui }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: theme.accent2, letterSpacing: 1.5 }}>LOTE #48213 · SUBASTA {l.when.toUpperCase()}</div>
          <div style={{ fontFamily: theme.display, fontWeight: 900, fontSize: 38, color: theme.text, marginTop: 6 }}>
            {l.year} {l.make} {l.model}
          </div>
          <div style={{ marginTop: 16, borderRadius: 14, border: `1px solid ${theme.line}`, overflow: "hidden" }}>
            {rows.map(([k, v], i) => {
              const on = i === rowHighlight;
              return (
                <div
                  key={k}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "12px 18px",
                    fontSize: 21,
                    background: on ? `${theme.accent2}22` : i % 2 ? "rgba(255,255,255,0.02)" : "transparent",
                    borderLeft: `5px solid ${on ? theme.accent2 : "transparent"}`,
                    color: on ? theme.text : theme.muted,
                    fontWeight: on ? 700 : 500,
                  }}
                >
                  <span>{k}</span>
                  <span style={{ color: theme.text }}>{v}</span>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 22 }}>
            <div
              style={{
                flex: 1,
                height: 64,
                borderRadius: 14,
                background: theme.accent,
                color: "white",
                fontWeight: 800,
                fontSize: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${1 + buttonPulse * 0.05})`,
                boxShadow: `0 0 ${20 + buttonPulse * 40}px ${theme.accent}88`,
              }}
            >
              {brand.ctaButton}
            </div>
            <div
              style={{
                width: 230,
                height: 64,
                borderRadius: 14,
                border: `1.5px solid ${theme.line}`,
                color: theme.text,
                fontWeight: 600,
                fontSize: 19,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <Icon name="history" size={24} color={theme.text} /> Historial
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
