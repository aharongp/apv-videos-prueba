import script from "./data/script.json";
import durations from "./data/durations.json";
import { FPS } from "./theme";

export type SceneId = (typeof script.scenes)[number]["id"];

export type TimedScene = {
  id: SceneId;
  stage: string;
  caption: string;
  from: number;
  duration: number;
  voFrames: number;
};

// Duración de cada escena = locución + respiro. Debe coincidir con scripts/generate-music.py.
export const scenes: TimedScene[] = (() => {
  let from = 0;
  const list = script.scenes.map((s, i) => {
    const vo = (durations as Record<string, number>)[s.id];
    let duration = Math.ceil((vo + script.padSeconds) * FPS) + Math.round(("holdSeconds" in s ? (s.holdSeconds as number) : 0) * FPS);
    if (i === script.scenes.length - 1) duration += Math.round(script.endHoldSeconds * FPS);
    const scene: TimedScene = {
      id: s.id as SceneId,
      stage: s.stage,
      caption: s.caption,
      from,
      duration,
      voFrames: Math.ceil(vo * FPS),
    };
    from += duration;
    return scene;
  });
  return list;
})();

export const totalFrames = scenes.reduce((a, s) => a + s.duration, 0);

export const sceneById = (id: SceneId) => scenes.find((s) => s.id === id)!;

/** Longitud "hablada" aproximada de un texto: expande lo que el TTS pronuncia más largo
 * (URL, siglas, números) y suma pausas por puntuación. Sirve para estimar tiempos. */
export const spokenWeight = (text: string) =>
  text
    .replace(/cars\.apvmotorusa\.com/g, "cars, punto, A P V motor U S A, punto com")
    .replace(/APV/g, "A P V")
    .replace(/WhatsApp/g, "guatsap")
    .replace(/\b30\b/g, "treinta")
    .replace(/\b60\b/g, "sesenta")
    .replace(/\b[1-4]\b/g, (d) => ["uno", "dos", "tres", "cuatro"][Number(d) - 1])
    .replace(/[,;]/g, ",,,,")
    .replace(/[.:?!]/g, "........").length;

/** Frame (relativo a la escena) en el que la locución llega a `phrase`. */
export const phraseAt = (scene: TimedScene, phrase: string) => {
  const idx = scene.caption.indexOf(phrase);
  if (idx < 0) throw new Error(`Frase no encontrada en ${scene.id}: ${phrase}`);
  return Math.round((spokenWeight(scene.caption.slice(0, idx)) / spokenWeight(scene.caption)) * scene.voFrames);
};
