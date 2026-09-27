import scriptEs from "./data/script.json";
import scriptEn from "./data/script.en.json";
import durationsEs from "./data/durations.json";
import durationsEn from "./data/durations.en.json";
import { FPS } from "./theme";
import type { Lang } from "./i18n";

export type SceneId = (typeof scriptEs.scenes)[number]["id"];

export type TimedScene = {
  id: SceneId;
  lang: Lang;
  stage: string;
  caption: string;
  from: number;
  duration: number;
  voFrames: number;
};

type Script = typeof scriptEs;

const sources: Record<Lang, { script: Script; durations: Record<string, number> }> = {
  es: { script: scriptEs, durations: durationsEs },
  en: { script: scriptEn as Script, durations: durationsEn },
};

// Duración de cada escena = locución + respiro. Debe coincidir con scripts/generate-music.py.
const build = (lang: Lang): TimedScene[] => {
  const { script, durations } = sources[lang];
  let from = 0;
  return script.scenes.map((s, i) => {
    const vo = durations[s.id];
    let duration = Math.ceil((vo + script.padSeconds) * FPS) + Math.round(("holdSeconds" in s ? (s.holdSeconds as number) : 0) * FPS);
    if (i === script.scenes.length - 1) duration += Math.round(script.endHoldSeconds * FPS);
    const scene: TimedScene = {
      id: s.id as SceneId,
      lang,
      stage: s.stage,
      caption: s.caption,
      from,
      duration,
      voFrames: Math.ceil(vo * FPS),
    };
    from += duration;
    return scene;
  });
};

const timelines: Record<Lang, TimedScene[]> = { es: build("es"), en: build("en") };

export const getScenes = (lang: Lang) => timelines[lang];

export const getTotalFrames = (lang: Lang) => timelines[lang].reduce((a, s) => a + s.duration, 0);

/** Longitud "hablada" aproximada de un texto: expande lo que el TTS pronuncia más largo
 * (URL, siglas, números) y suma pausas por puntuación. Sirve para estimar tiempos. */
export const spokenWeight = (text: string, lang: Lang = "es") => {
  const expanded =
    lang === "en"
      ? text
          .replace(/cars\.apvmotorusa\.com/g, "cars, dot, A P V motor U S A, dot com")
          .replace(/APV/g, "A P V")
          .replace(/\b30\b/g, "thirty")
          .replace(/\b60\b/g, "sixty")
          .replace(/100%/g, "one hundred percent")
          .replace(/\bVIN\b/g, "V I N")
          .replace(/\b[1-5]\b/g, (d) => ["one", "two", "three", "four", "five"][Number(d) - 1])
      : text
          .replace(/cars\.apvmotorusa\.com/g, "cars, punto, A P V motor U S A, punto com")
          .replace(/APV/g, "A P V")
          .replace(/WhatsApp/g, "guatsap")
          .replace(/\b30\b/g, "treinta")
          .replace(/\b60\b/g, "sesenta")
          .replace(/100%/g, "cien por ciento")
          .replace(/\bVIN\b/g, "V I N")
          .replace(/\b[1-5]\b/g, (d) => ["uno", "dos", "tres", "cuatro", "cinco"][Number(d) - 1]);
  return expanded.replace(/[,;]/g, ",,,,").replace(/[.:?!]/g, "........").length;
};

/** Frame (relativo a la escena) en el que la locución llega a `phrase`. */
export const phraseAt = (scene: TimedScene, phrase: string) => {
  const idx = scene.caption.indexOf(phrase);
  if (idx < 0) throw new Error(`Frase no encontrada en ${scene.id} (${scene.lang}): ${phrase}`);
  return Math.round((spokenWeight(scene.caption.slice(0, idx), scene.lang) / spokenWeight(scene.caption, scene.lang)) * scene.voFrames);
};
