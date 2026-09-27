import React from "react";
import { useEffect, useState } from "react";
import { AbsoluteFill, Audio, continueRender, delayRender, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { fontsReady, theme } from "./theme";
import { getScenes, getTotalFrames, SceneId, TimedScene } from "./timeline";
import { Lang, LangProvider } from "./i18n";
import { Background } from "./components/Background";
import { Captions } from "./components/Captions";
import { SceneShell, SfxAt } from "./components/Shell";
import { Logo } from "./components/Browser";
import { clamp } from "./components/motion";
import { Hook, Problem, Solution } from "./scenes/Intro";
import { Step1, Step2, Step3, Step4, Step5 } from "./scenes/Demo";
import { Advisor, Cta, Objection, Qualify, Value } from "./scenes/Close";

const components: Record<SceneId, React.FC<{ scene: TimedScene }>> = {
  hook: Hook,
  problem: Problem,
  solution: Solution,
  step1: Step1,
  step2: Step2,
  step3: Step3,
  step4: Step4,
  step5: Step5,
  value: Value,
  qualify: Qualify,
  objection: Objection,
  cta: Cta,
  advisor: Advisor,
};

const tints: Partial<Record<SceneId, string>> = {
  problem: theme.accent,
  value: theme.success,
  qualify: theme.accent2,
  advisor: theme.success,
};

// Escenas donde no se muestra la marca de agua (ya aparece el logo grande).
const noWatermark: SceneId[] = ["solution", "step1", "step2", "step3", "step4", "step5", "advisor"];

export const CarsVSL: React.FC<{ lang: Lang }> = ({ lang }) => {
  const scenes = getScenes(lang);
  const totalFrames = getTotalFrames(lang);
  const suffix = lang === "es" ? "" : `-${lang}`;
  const [handle] = useState(() => delayRender("Cargando fuentes"));
  useEffect(() => {
    fontsReady.then(() => continueRender(handle));
  }, [handle]);

  const frame = useCurrentFrame();
  const current = scenes.find((s) => frame >= s.from && frame < s.from + s.duration) ?? scenes[scenes.length - 1];
  const last = scenes[scenes.length - 1];
  const endStart = last.from + last.voFrames;

  return (
    <LangProvider lang={lang}>
    <AbsoluteFill style={{ background: theme.bg }}>
      <Background tint={tints[current.id] ?? theme.accent} />

      {scenes.map((s) => {
        const C = components[s.id];
        return (
          <Sequence key={s.id} from={s.from} durationInFrames={s.duration} name={`${s.stage} (${s.id})`}>
            <SceneShell duration={s.duration}>
              <C scene={s} />
            </SceneShell>
            <Audio src={staticFile(`audio/vo${suffix}/${s.id}.wav`)} />
            <Captions text={s.caption} voFrames={s.voFrames} lang={lang} />
            {s.from > 0 && <SfxAt at={0} name="whoosh" volume={0.25} />}
          </Sequence>
        );
      })}

      {scenes.slice(1).map((s) => (
        <Sequence key={`sweep-${s.id}`} from={s.from - 6} durationInFrames={14} layout="none">
          <LightSweep />
        </Sequence>
      ))}

      <div
        style={{
          position: "absolute",
          left: 60,
          top: 36,
          opacity: noWatermark.includes(current.id) ? 0 : 0.85,
          transform: "scale(0.9)",
          transformOrigin: "0 0",
        }}
      >
        <Logo height={52} />
      </div>

      <Audio
        src={staticFile(`audio/music${suffix}.mp3`)}
        volume={(f) => interpolate(f, [0, 30, endStart, endStart + 20, totalFrames - 20, totalFrames], [0, 0.16, 0.16, 0.4, 0.4, 0], clamp)}
      />
    </AbsoluteFill>
    </LangProvider>
  );
};

const LightSweep: React.FC = () => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, 14], [-40, 140], clamp);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: -200,
          bottom: -200,
          left: `${x}%`,
          width: 260,
          transform: "skewX(-18deg)",
          background: `linear-gradient(90deg, transparent, ${theme.accent}33, rgba(255,255,255,0.8), ${theme.accent}33, transparent)`,
          filter: "blur(6px)",
        }}
      />
    </AbsoluteFill>
  );
};
