import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Paleta y marca. Cambia estos valores para ajustar el look del VSL.
export const theme = {
  bg: "#060A13",
  bg2: "#0D1526",
  panel: "#111B30",
  panel2: "#16223B",
  line: "rgba(255,255,255,0.09)",
  text: "#F5F7FB",
  muted: "#8C97AD",
  accent: "#FF3B30", // rojo APV / urgencia
  accent2: "#FFB800", // ámbar / resaltado
  success: "#22C55E",
  link: "#3B82F6",
  display: "Montserrat, sans-serif",
  ui: "Inter, sans-serif",
};

export const brand = {
  name: "APV MOTORS",
  url: "cars.apvmotorusa.com",
  location: "Houston, TX",
  // Etiquetas del sitio que se muestran en la demo. Ajustar si el sitio usa otros textos.
  ctaButton: "Me interesa",
  heroTitle: "Encuentra tu próximo vehículo en subasta",
};

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

const fonts: [string, number][] = [
  ["montserrat", 500],
  ["montserrat", 700],
  ["montserrat", 800],
  ["montserrat", 900],
  ["inter", 400],
  ["inter", 500],
  ["inter", 600],
  ["inter", 700],
];

export const fontsReady = Promise.all(
  fonts.map(([family, weight]) =>
    loadFont({
      family: family === "montserrat" ? "Montserrat" : "Inter",
      url: staticFile(`fonts/${family}-latin-${weight}-normal.woff2`),
      weight: String(weight),
    }),
  ),
);
