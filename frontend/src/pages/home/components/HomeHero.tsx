export default function HomeHero() {
  const t = {
    title: "NumLab – Laboratory of Numerical Analysis",
    blurb:
      "NumLab is a web platform designed to help students and enthusiasts visualize and compare numerical analysis algorithms through interactive simulations. It aims to support learning by bridging mathematical theory and computational practice, making complex methods easier to understand.",
    github: "Owner's GitHub",
  };

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
