import { useState } from "react";
import { useLang } from "../../app/i18n/LangProvider";

export default function Navbar() {
  // 👇 usa o contexto global de idioma
  const { lang, setLang } = useLang();

  // mantém só o estado do menu mobile
  const [open, setOpen] = useState(false);

  // 👇 rótulos por idioma (temporário; depois podemos centralizar num dicionário global)
  const t = {
    en: {
      how: "How to use NumLab",
      about: "About the Authors",
      switchToEn: "Switch to English",
      switchToPt: "Mudar para português",
    },
    pt: {
      how: "Como usar o NumLab",
      about: "Sobre os Autores",
      switchToEn: "Switch to English",
      switchToPt: "Mudar para português",
    },
  }[lang];

  return (
    <header className="w-full bg-white border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand + Lang Switch */}
        <div className="flex items-center space-x-4">
          <a href="/" className="text-xl font-semibold text-blue-600">NumLab</a>

          {/* Language Switch Buttons (desktop) */}
          <div className="hidden sm:flex items-center bg-gray-100 rounded-md p-1">
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                lang === "en"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              aria-pressed={lang === "en"}
              aria-label={t.switchToEn}
              title={t.switchToEn}
            >
              EN
            </button>
            <button
              onClick={() => setLang("pt")}
              className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                lang === "pt"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              aria-pressed={lang === "pt"}
              aria-label={t.switchToPt}
              title={t.switchToPt}
            >
              PT
            </button>
          </div>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
            {t.how}
          </a>
          <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
            {t.about}
          </a>
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Lang switch (mobile) */}
          <div className="flex items-center bg-gray-100 rounded-md p-1">
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                lang === "en"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              aria-pressed={lang === "en"}
              aria-label={t.switchToEn}
              title={t.switchToEn}
            >
              EN
            </button>
            <button
              onClick={() => setLang("pt")}
              className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                lang === "pt"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              aria-pressed={lang === "pt"}
              aria-label={t.switchToPt}
              title={t.switchToPt}
            >
              PT
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="p-2"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-3 space-y-2">
            <a href="#" className="block text-gray-600 hover:text-blue-600 transition-colors">
              {t.how}
            </a>
            <a href="#" className="block text-gray-600 hover:text-blue-600 transition-colors">
              {t.about}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
