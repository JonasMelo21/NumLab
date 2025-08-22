import {
  FunctionSquare,
  ActivitySquare,
  Waves,
  Calculator,
  Sigma,
  Shapes,
  Grid3x3,
  CircuitBoard,
} from "lucide-react";
import { MethodCard } from "./MethodCard";

export default function MainContent() {
  const calculus = [
    {
      title: "Root Finding Methods",
      description:
        "Interactive visualizations for Newton, Secant, Bisection and Müller. Compare convergence speed and iteration paths.",
      icon: FunctionSquare,
      id: "root-finding",
    },
    {
      title: "Numerical Integration & Differentiation",
      description:
        "Trapezoidal, Simpson and higher-order Newton–Cotes rules, plus numerical differentiation with error analysis.",
      icon: Sigma,
      id: "integration",
    },
    {
      title: "Initial & Boundary Value Problems (ODEs)",
      description:
        "Euler, Heun, Runge–Kutta and multistep methods; shooting and finite differences for BVPs.",
      icon: ActivitySquare,
      id: "ivp-bvp",
    },
    {
      title: "Partial Differential Equations (PDEs)",
      description:
        "Parabolic, hyperbolic and elliptic problems with FTCS/BTCS/Crank–Nicolson, ADI and iterative solvers.",
      icon: Calculator,
      id: "pdes",
    },
    {
      title: "Boundary Value Problems for ODEs",
      description:
        "Shooting method and finite differences to handle boundary conditions efficiently.",
      icon: Waves,
      id: "bvp",
    },
  ];

  const nla = [
    {
      title: "Eigenvalues and Eigenvectors",
      description:
        "Compute eigenvalues/eigenvectors numerically with power/QR methods and more.",
      icon: Shapes,
      id: "eigen",
    },
    {
      title: "Iterative Methods",
      description:
        "Solve linear systems via Jacobi, Gauss–Seidel, SOR and Krylov subspace methods.",
      icon: CircuitBoard,
      id: "iterative",
    },
    {
      title: "Direct Methods",
      description:
        "LU/QR factorization, Gaussian elimination and variants for stable solutions.",
      icon: Grid3x3,
      id: "direct",
    },
    {
      title: "Nonlinear Systems",
      description:
        "Techniques for systems of nonlinear equations with convergence insights.",
      icon: FunctionSquare,
      id: "nonlinear",
    },
  ];

  return (
    <section className="w-full bg-white py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section 1 */}
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-10 underline underline-offset-8 decoration-blue-600 decoration-2">
          Methods in Calculus
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-16">
          {calculus.map(({ title, description, icon, id }) => (
            <div key={id} id={id}>
              <MethodCard title={title} description={description} icon={icon} />
            </div>
          ))}
        </div>

        {/* Section 2 */}
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-10 underline underline-offset-8 decoration-blue-600 decoration-2">
          Numerical Linear Algebra
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {nla.map(({ title, description, icon, id }) => (
            <div key={id} id={id}>
              <MethodCard title={title} description={description} icon={icon} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
