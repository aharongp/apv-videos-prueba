import React, { createContext, useContext } from "react";

export type Lang = "es" | "en";

const LangContext = createContext<Lang>("es");

export const LangProvider: React.FC<{ lang: Lang; children: React.ReactNode }> = ({ lang, children }) => (
  <LangContext.Provider value={lang}>{children}</LangContext.Provider>
);

export const useLang = () => useContext(LangContext);

/** Devuelve el texto en el idioma activo: `t("Hola", "Hello")`. */
export const useT = () => {
  const lang = useLang();
  return (es: string, en: string) => (lang === "en" ? en : es);
};
