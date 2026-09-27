import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Branding de cars.apvmotorusa.com (tomado de su hoja de estilos: variables :root).
export const theme = {
  bg: "#F0F7FF", // degradado del hero (#f0f7ff → #fff)
  bg2: "#FFFFFF",
  panel: "#FFFFFF",
  panel2: "#F8FAFC", // --soft-2
  soft: "#F1F5F9", // --soft
  line: "#DBE4EE", // --line
  field: "#CBD5E1", // borde de inputs
  text: "#0F172A", // --ink
  ink2: "#1E293B", // --ink-2
  slate: "#475569",
  muted: "#64748B", // --muted
  accent: "#DC2626", // --primary
  accent2: "#1D4ED8", // azul del botón «Quiero ofertar» en la ficha
  accentDark: "#B91C1C", // --primary-2
  redSoft: "#FEF2F2",
  success: "#15803D", // --green
  successSoft: "#ECFDF3", // --green-soft
  link: "#2563EB",
  shadow: "0 18px 50px rgba(15,23,42,.09)", // --shadow
  radius: 22,
  radiusSm: 14,
  display: "Inter, sans-serif",
  ui: "Inter, sans-serif",
};

export const brand = {
  name: "APV MOTORS",
  url: "cars.apvmotorusa.com",
  location: "Houston, TX",
  logo: "brand/apv-logo-red.png",
  heroTitle: "Compra tu vehículo en subastas de EE. UU. sin complicarte.",
  heroSub: "Encuentra vehículos de Copart, define cuánto quieres ofertar y APV Motors te acompaña desde la puja hasta la documentación y el traslado.",
  ctaButton: "Quiero ofertar",
};

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const fontsReady = Promise.all(
  [400, 500, 600, 700, 800, 900].map((weight) =>
    loadFont({ family: "Inter", url: staticFile(`fonts/inter-latin-${weight}-normal.woff2`), weight: String(weight) }),
  ),
);
