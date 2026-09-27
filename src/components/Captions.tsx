import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { clamp } from "./motion";
import { interpolate } from "remotion";
import { spokenWeight } from "../timeline";

const MAX_WORDS = 7;

/** Parte el texto en bloques cortos (<= 7 palabras), cortando en puntuación cuando se puede. */
const chunk = (text: string) => {
  const words = text.split(/\s+/);
  const chunks: string[][] = [];
  let cur: string[] = [];
  for (const w of words) {
    cur.push(w);
    const hardBreak = /[.:?!]$/.test(w);
    const softBreak = /[,;]$/.test(w) && cur.length >= 4;
    if (hardBreak || softBreak || cur.length >= MAX_WORDS) {
      chunks.push(cur);
      cur = [];
    }
  }
  if (cur.length) chunks.push(cur);
  return chunks;
};

/** Subtítulos quemados (el 80% de los VSL en redes se ven sin sonido). */
export const Captions: React.FC<{ text: string; voFrames: number }> = ({ text, voFrames }) => {
  const frame = useCurrentFrame();
  const chunks = chunk(text);
  const lengths = chunks.map((c) => spokenWeight(c.join(" ")) + 1);
  const total = lengths.reduce((a, b) => a + b, 0);

  let acc = 0;
  const timed = chunks.map((c, i) => {
    const start = (acc / total) * voFrames;
    acc += lengths[i];
    return { words: c, start, end: (acc / total) * voFrames };
  });

  const current = timed.find((c) => frame >= c.start && frame < c.end) ?? (frame < voFrames + 12 ? timed[timed.length - 1] : null);
  if (!current) return null;

  const local = frame - current.start;
  const span = current.end - current.start;
  const wordLens = current.words.map((w) => spokenWeight(w) + 1);
  const wTotal = wordLens.reduce((a, b) => a + b, 0);
  const appear = interpolate(local, [0, 5], [0, 1], clamp);

  let wAcc = 0;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 56,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          maxWidth: 1500,
          padding: "14px 30px",
          borderRadius: 18,
          background: "rgba(4,7,14,0.72)",
          border: `1px solid ${theme.line}`,
          fontFamily: theme.display,
          fontWeight: 800,
          fontSize: 46,
          lineHeight: 1.2,
          color: theme.text,
          textAlign: "center",
          opacity: appear,
          transform: `translateY(${(1 - appear) * 12}px)`,
        }}
      >
        {current.words.map((w, i) => {
          const wStart = (wAcc / wTotal) * span;
          wAcc += wordLens[i];
          const active = local >= wStart;
          return (
            <span key={i} style={{ color: active ? theme.text : "rgba(245,247,251,0.45)" }}>
              {w}
              {i < current.words.length - 1 ? " " : ""}
            </span>
          );
        })}
      </div>
    </div>
  );
};
