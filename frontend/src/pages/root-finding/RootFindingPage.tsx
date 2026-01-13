import { useState } from "react";
import RootFindingHero from "./components/RootFindingHero";
import MethodSelector, { type Method } from "./components/MethodSelector";
import MethodContent from "./components/MethodContent";
import ComparisonSection from "./components/ComparisonSection";
import { useLang } from "../../app/i18n/LangProvider";

// Titles (English only)
const TITLES: Record<Method, string> = {
  newton: "Newton's Method",
  secant: "Secant Method",
  bisection: "Bisection Method",
  muller: "Muller's Method",
};

// Mantemos o pseudocódigo em inglês por enquanto.
// Se quiser depois, criamos uma versão PT e alternamos por idioma.
const PSEUDOCODE: Record<Method, string> = {
  newton: `procedure NEWTON(f, df, x0, tol, max_iter)
    x ← x0
    for k ← 1 to max_iter do
        fx  ← f(x)
        dfx ← df(x)
        if dfx = 0 then
            return failure("zero derivative at x")
        end if

        x_new ← x - fx / dfx

        if abs(x_new - x) < tol or abs(f(x_new)) < tol then
            return (x_new, k)
        end if

        x ← x_new
    end for

    return failure("no convergence within max_iter")
end procedure`,

  secant: `procedure SECANT(f, x0, x1, tol, max_iter)
    // requires x0 ≠ x1
    for k ← 1 to max_iter do
        f0 ← f(x0)
        f1 ← f(x1)

        denom ← (f1 - f0)
        if denom = 0 then
            return failure("zero denominator")
        end if

        x2 ← x1 - f1 * (x1 - x0) / denom

        if abs(x2 - x1) < tol or abs(f(x2)) < tol then
            return (x2, k)
        end if

        x0 ← x1
        x1 ← x2
    end for

    return failure("no convergence within max_iter")
end procedure`,

  bisection: `procedure BISECTION(f, a, b, tol, max_iter)
    // requires f(a) * f(b) < 0
    fa ← f(a)
    fb ← f(b)
    if fa * fb ≥ 0 then
        return failure("interval does not bracket a root")
    end if

    for k ← 1 to max_iter do
        m  ← (a + b) / 2
        fm ← f(m)

        if ( (b - a)/2 < tol ) or ( abs(fm) < tol ) then
            return (m, k)
        end if

        if fa * fm < 0 then
            b  ← m
            fb ← fm
        else
            a  ← m
            fa ← fm
        end if
    end for

    return failure("no convergence within max_iter")
end procedure`,

  muller: `procedure MULLER(f, x0, x1, x2, tol, max_iter)
    f0 ← f(x0)
    f1 ← f(x1)
    f2 ← f(x2)

    for k ← 1 to max_iter do
        h1 ← x1 - x0
        h2 ← x2 - x1

        δ1 ← (f1 - f0) / h1
        δ2 ← (f2 - f1) / h2

        d  ← (δ2 - δ1) / (h2 + h1)   // second divided difference
        b  ← δ2 + h2 * d
        D  ← sqrt(b*b - 4 * f2 * d)

        // choose denominator with larger magnitude
        denom ← (abs(b + D) > abs(b - D)) ? (b + D) : (b - D)
        if denom = 0 then
            return failure("zero denominator")
        end if

        x3 ← x2 - (2 * f2) / denom

        if abs(x3 - x2) < tol or abs(f(x3)) < tol then
            return (x3, k)
        end if

        // shift points
        x0 ← x1 ; f0 ← f1
        x1 ← x2 ; f1 ← f2
        x2 ← x3 ; f2 ← f(x2)
    end for

    return failure("no convergence within max_iter")
end procedure`,
};

export default function RootFindingPage() {
  const { lang } = useLang();
  const [selectedMethods, setSelectedMethods] = useState<Method[]>(["newton"]);

  const handleMethodToggle = (method: Method) => {
    setSelectedMethods((prev) =>
      prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]
    );
  };

  const getGridCols = (count: number) => {
    switch (count) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-1 lg:grid-cols-2";
      case 3:
        return "grid-cols-1 lg:grid-cols-3";
      case 4:
        return "grid-cols-1 lg:grid-cols-2 xl:grid-cols-4";
      default:
        return "grid-cols-1";
    }
  };

  const emptyTexts = {
    title: "No Methods Selected",
    body: "Please select at least one method from the selector above to begin exploring root-finding algorithms.",
  };

  return (
    <>
      <RootFindingHero />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <MethodSelector selectedMethods={selectedMethods} onMethodToggle={handleMethodToggle} />

        {selectedMethods.length > 0 ? (
          <div className={`grid ${getGridCols(selectedMethods.length)} gap-8`}>
            {selectedMethods.map((m) => (
              <MethodContent
                key={m}
                method={m}
                title={TITLES[m]}
                pseudo={PSEUDOCODE[m]}
                isCompact={selectedMethods.length > 1}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 max-w-md mx-auto">
              <h3 className="text-slate-900 text-xl font-semibold mb-4">{emptyTexts.title}</h3>
              <p className="text-slate-600">{emptyTexts.body}</p>
            </div>
          </div>
        )}

        <ComparisonSection selectedMethods={selectedMethods} />
      </main>
    </>
  );
}
