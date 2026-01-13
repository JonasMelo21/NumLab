import React, { createContext, useContext, useState, useEffect, useMemo } from "react";

export type Lang = "en";

type LangContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
};

const LangContext = createContext<LangContextType | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang] = useState<Lang>("en");

  const setLang = (l: Lang) => {
    // No-op: enforcing English only
    console.log("Language is locked to English.");
  };

  const toggle = () => {
    // No-op
  };

  // Keep <html lang="en">
  useEffect(() => {
    document.documentElement.lang = "en";
  }, []);

  const value = useMemo(() => ({ lang, setLang, toggle }), [lang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LangProvider");
  return ctx;
}
