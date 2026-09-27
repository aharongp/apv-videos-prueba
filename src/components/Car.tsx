import React from "react";
import { useId } from "react";

export type CarKind = "sedan" | "suv" | "pickup";

const bodies: Record<CarKind, { body: string; windows: string[] }> = {
  sedan: {
    body: "M18 118 L22 96 Q26 86 44 83 L108 78 Q130 50 160 44 L238 42 Q262 44 290 72 L350 80 Q378 86 384 100 L386 118 Z",
    windows: [
      "M120 76 Q138 54 162 50 L200 49 L200 76 Z",
      "M208 49 L236 48 Q256 50 276 74 L208 76 Z",
    ],
  },
  suv: {
    body: "M16 118 L18 70 Q20 50 40 48 L250 46 Q270 48 296 74 L352 82 Q380 88 386 102 L388 118 Z",
    windows: [
      "M34 74 L36 60 Q38 55 46 55 L120 55 L120 76 Z",
      "M128 55 L200 55 L200 76 L128 76 Z",
      "M208 55 L246 54 Q262 56 282 76 L208 76 Z",
    ],
  },
  pickup: {
    body: "M14 118 L16 80 L170 80 L172 50 Q174 44 184 44 L250 44 Q266 46 290 74 L352 82 Q380 88 386 102 L388 118 Z",
    windows: ["M182 52 L244 52 Q258 54 276 76 L182 76 Z"],
  },
};

/** Silueta lateral de vehículo en estilo flat / motion graphics. */
export const Car: React.FC<{
  kind?: CarKind;
  color?: string;
  width?: number;
  wheelSpin?: number;
  style?: React.CSSProperties;
}> = ({ kind = "sedan", color = "#E5E7EB", width = 400, wheelSpin = 0, style }) => {
  const id = useId().replace(/:/g, "");
  const b = bodies[kind];
  return (
    <svg width={width} height={(width * 170) / 400} viewBox="0 0 400 170" style={style}>
      <defs>
        <linearGradient id={`body${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} />
          <stop offset="1" stopColor={color} stopOpacity="0.72" />
        </linearGradient>
        <linearGradient id={`glass${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1f2a44" />
          <stop offset="1" stopColor="#0b1020" />
        </linearGradient>
      </defs>
      <ellipse cx="200" cy="150" rx="185" ry="10" fill="rgba(0,0,0,0.45)" />
      <path d={b.body} fill={`url(#body${id})`} />
      <path d="M30 100 L380 100" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
      {b.windows.map((w, i) => (
        <path key={i} d={w} fill={`url(#glass${id})`} />
      ))}
      <rect x="372" y="92" width="14" height="7" rx="3" fill="#FFF3B0" />
      <rect x="16" y="94" width="10" height="8" rx="3" fill="#FF3B30" />
      {[90, 312].map((cx) => (
        <g key={cx} transform={`rotate(${wheelSpin} ${cx} 120)`}>
          <circle cx={cx} cy="120" r="30" fill="#060A13" />
          <circle cx={cx} cy="120" r="24" fill="#1c2436" />
          <circle cx={cx} cy="120" r="14" fill="#9aa4b8" />
          {[0, 72, 144, 216, 288].map((a) => (
            <rect key={a} x={cx - 2} y="107" width="4" height="10" rx="2" fill="#4b5569" transform={`rotate(${a} ${cx} 120)`} />
          ))}
          <circle cx={cx} cy="120" r="4" fill="#4b5569" />
        </g>
      ))}
    </svg>
  );
};
