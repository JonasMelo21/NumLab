import { useLang } from "../../../app/i18n/LangProvider";

export default function HomeHero() {
  const { lang } = useLang();

  const t = {
    en: {
      title: "NumLab – Laboratory of Numerical Analysis",
      blurb:
        "NumLab is a web platform designed to help students and enthusiasts visualize and compare numerical analysis algorithms through interactive simulations. It aims to support learning by bridging mathematical theory and computational practice, making complex methods easier to understand.",
      github: "GitHub",
    },
    pt: {
      title: "NumLab – Laboratório de Análise Numérica",
      blurb:
        "O NumLab é uma plataforma web para ajudar estudantes e entusiastas a visualizar e comparar algoritmos de análise numérica por meio de simulações interativas. A ideia é aproximar teoria matemática e prática computacional, tornando métodos complexos mais fáceis de entender.",
      github: "GitHub",
    },
  }[lang];

  return (
    <section className="w-full bg-gradient-to-br from-blue-50 to-indigo-100 py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          {t.title}
        </h1>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
          {t.blurb}
        </p>
        <p className="text-base text-gray-600 max-w-3xl mx-auto mt-4">
          {t.github}:{" "}
          <a
            href="https://github.com/jonasmelo21"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            github.com/jonasmelo21
          </a>
        </p>
      </div>
    </section>
  );
}
