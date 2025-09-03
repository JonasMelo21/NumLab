import { useLang } from "../../../app/i18n/LangProvider";

export default function RootFindingHero() {
  const { lang } = useLang();

  const t = {
    en: {
      title: "Root-Finding Methods",
      subtitle:
        "Select one or more methods to visualize iterations, compare convergence, and inspect pseudo-code. Try Newton, Secant, Bisection, or Müller.",
    },
    pt: {
      title: "Métodos de Encontrar Raízes",
      subtitle:
        "Selecione um ou mais métodos para visualizar iterações, comparar convergência e inspecionar o pseudocódigo. Experimente Newton, Secante, Bissecção ou Müller.",
    },
  }[lang];

  return (
    <section className="w-full bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {t.title}
        </h1>
        <p className="text-gray-700 max-w-3xl mx-auto">
          {t.subtitle}
        </p>
      </div>
    </section>
  );
}
