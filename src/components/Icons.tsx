import React from "react";
// Iconos de trazo (24x24) dibujados a mano, estilo "line icons".
const paths: Record<string, React.ReactNode> = {
  gavel: (
    <>
      <path d="M14 4l6 6" />
      <path d="M11 7l6 6" />
      <path d="M12.5 5.5l-4 4 6 6 4-4" />
      <path d="M10.5 11.5L3 19l2 2 7.5-7.5" />
      <path d="M13 21h8" />
    </>
  ),
  alert: (
    <>
      <path d="M12 3L2 21h20L12 3z" />
      <path d="M12 10v5" />
      <path d="M12 18v.01" />
    </>
  ),
  doc: (
    <>
      <path d="M6 2h9l5 5v15H6z" />
      <path d="M14 2v6h6" />
      <path d="M9 13h8M9 17h6" />
    </>
  ),
  dollar: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M15 8.5c-.6-1-1.8-1.5-3-1.5-1.7 0-3 .9-3 2.3 0 3.2 6 1.8 6 5 0 1.4-1.3 2.4-3 2.4-1.3 0-2.6-.6-3.1-1.7" />
      <path d="M12 5v2M12 17v2" />
    </>
  ),
  shuffle: (
    <>
      <path d="M3 7h4l10 10h4" />
      <path d="M3 17h4l3-3M14 10l3-3h4" />
      <path d="M18 4l3 3-3 3M18 14l3 3-3 3" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-5-5" />
    </>
  ),
  check: <path d="M4 12.5l5 5L20 6.5" />,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  calculator: (
    <>
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M8 6h8v3H8z" />
      <path d="M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01M16 17h.01" />
    </>
  ),
  truck: (
    <>
      <path d="M2 6h11v10H2zM13 9h4l4 4v3h-8" />
      <circle cx="6.5" cy="17.5" r="2" />
      <circle cx="17.5" cy="17.5" r="2" />
    </>
  ),
  shield: (
    <>
      <path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z" />
      <path d="M8.5 12l2.5 2.5 4.5-5" />
    </>
  ),
  headset: (
    <>
      <path d="M4 14v-2a8 8 0 0116 0v2" />
      <rect x="2" y="13" width="5" height="7" rx="2" />
      <rect x="17" y="13" width="5" height="7" rx="2" />
      <path d="M20 20c0 1.5-2 2-5 2h-2" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M3 10h18M8 2v4M16 2v4" />
    </>
  ),
  chat: (
    <>
      <path d="M21 12a8 8 0 01-11.6 7.1L3 21l1.9-6.4A8 8 0 1121 12z" />
      <path d="M8 12h.01M12 12h.01M16 12h.01" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2c3 3 3 17 0 20M12 2c-3 3-3 17 0 20" />
    </>
  ),
  pin: (
    <>
      <path d="M12 22s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </>
  ),
  history: (
    <>
      <path d="M3 12a9 9 0 103-6.7L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1-4.5 4.5-6 8-6s7 1.5 8 6" />
    </>
  ),
  arrow: <path d="M4 12h15M13 6l6 6-6 6" />,
  car: (
    <>
      <path d="M3 16v-3l2-5h14l2 5v3z" />
      <path d="M3 13h18" />
      <circle cx="7" cy="16.5" r="1.5" />
      <circle cx="17" cy="16.5" r="1.5" />
    </>
  ),
  tag: (
    <>
      <path d="M3 12V3h9l9 9-9 9z" />
      <circle cx="7.5" cy="7.5" r="1.5" />
    </>
  ),
};

export type IconName = keyof typeof paths;

export const Icon: React.FC<{ name: IconName; size?: number; color?: string; stroke?: number }> = ({
  name,
  size = 48,
  color = "currentColor",
  stroke = 2,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {paths[name]}
  </svg>
);
