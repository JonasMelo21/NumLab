import React, { createContext, useContext, useState, useEffect, useMemo } from "react";

export type Lang = "en" | "pt";

type LangContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
};

const LangContext = createContext<LangContextType | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      // 1) prioriza ?lang=pt|en na URL
      const params = new URLSearchParams(window.location.search);
      const urlLang = params.get("lang");
      if (urlLang === "pt" || urlLang === "en") return urlLang;

      // 2) depois, localStorage
      const saved = localStorage.getItem("lang");
      if (saved === "pt" || saved === "en") return saved;

      // 3) fallback: idioma do navegador
      const nav = (navigator.language || "en").toLowerCase();
      return nav.startsWith("pt") ? "pt" : "en";
    } catch {
      return "en";
    }
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("lang", l);
    } catch {}
  };

  const toggle = () => setLang(lang === "en" ? "pt" : "en");

  // Mantém <html lang="..."> atualizado para acessibilidade e SEO
  useEffect(() => {
    try {
      document.documentElement.lang = lang;
    } catch {}
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, toggle }), [lang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LangProvider");
  return ctx;
}
