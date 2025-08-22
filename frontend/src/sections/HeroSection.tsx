export default function HeroSection() {
  return (
    <section className="w-full bg-gradient-to-br from-blue-50 to-indigo-100 py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          NumLab – Laboratory of Numerical Analysis
        </h1>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
          NumLab is a web platform designed to help students and enthusiasts visualize and compare
          numerical analysis algorithms through interactive simulations. It aims to support learning
          by bridging mathematical theory and computational practice, making complex methods easier
          to understand. The project was developed by Jonas Melo, a Computer Science student
          passionate about mathematics and programming.
        </p>
        <p className="text-base text-gray-600 max-w-3xl mx-auto mt-4">
          GitHub:{" "}
          <a
            href="https://github.com/jonasmelo21"
            className="text-blue-600 hover:text-blue-800 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/jonasmelo21
          </a>
        </p>
      </div>
    </section>
  );
}
