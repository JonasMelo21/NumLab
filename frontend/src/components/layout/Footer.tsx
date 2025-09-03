import { useLang } from "../../app/i18n/LangProvider";

export default function Footer() {
  const { lang } = useLang();
  const year = new Date().getFullYear();

  const t = {
    en: {
      tagline: "Laboratory of Numerical Analysis",
      quickLinks: "Quick Links",
      howToUse: "How to Use",
      aboutAuthor: "About the Author",
      contact: "Contact",
      rights: "All rights reserved.",
    },
    pt: {
      tagline: "Laboratório de Análise Numérica",
      quickLinks: "Links Rápidos",
      howToUse: "Como Usar",
      aboutAuthor: "Sobre o Autor",
      contact: "Contato",
      rights: "Todos os direitos reservados.",
    },
  }[lang];

  return (
    <footer className="w-full bg-gray-900 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Logo */}
          <div className="flex flex-col">
            <h3 className="text-xl font-semibold text-blue-400 mb-4">NumLab</h3>
            <p className="text-gray-400">{t.tagline}</p>
          </div>

          {/* Center Column - Quick Links */}
          <div className="flex flex-col">
            <h4 className="font-semibold mb-4">{t.quickLinks}</h4>
            <div className="flex flex-col space-y-2">
              <a
                href="#how-to-use"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                {t.howToUse}
              </a>
              <a
                href="#about-author"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                {t.aboutAuthor}
              </a>
            </div>
          </div>

          {/* Right Column - Contact */}
          <div className="flex flex-col">
            <h4 className="font-semibold mb-4">{t.contact}</h4>
            <div className="flex flex-col space-y-2 text-gray-400">
              <a
                href="mailto:jonashonorato4@gmail.com"
                className="hover:text-blue-400 transition-colors break-all"
              >
                jonashonorato4@gmail.com
              </a>
              <a
                href="https://github.com/jonasmelo21"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors"
              >
                github.com/jonasmelo21
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">© {year} NumLab. {t.rights}</p>
        </div>
      </div>
    </footer>
  );
}
