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
import { useLang } from "../../../app/i18n/LangProvider";
import { MethodCard } from "../../../components/common/MethodCard";

export default function MainContent() {
  const { lang } = useLang();

  const dict = {
    sec1: "Methods in Calculus",
    sec2: "Numerical Linear Algebra",
    itemsCalc: {
      root: {
        title: "Root Finding Methods",
        desc:
          "Interactive visualizations for Newton, Secant, Bisection and Müller. Compare convergence speed and iteration paths.",
      },
      integ: {
        title: "Numerical Integration & Differentiation",
        desc:
          "Trapezoidal, Simpson and higher-order Newton–Cotes rules, plus numerical differentiation with error analysis.",
      },
      ivp_bvp: {
        title: "Initial & Boundary Value Problems (ODEs)",
        desc:
          "Euler, Heun, Runge–Kutta and multistep methods; shooting and finite differences for BVPs.",
      },
      pdes: {
        title: "Partial Differential Equations (PDEs)",
        desc:
          "Parabolic, hyperbolic and elliptic problems with FTCS/BTCS/Crank–Nicolson, ADI and iterative solvers.",
      },
      bvp: {
        title: "Boundary Value Problems for ODEs",
        desc:
          "Shooting method and finite differences to handle boundary conditions efficiently.",
      },
    },
    itemsNla: {
      eigen: {
        title: "Eigenvalues and Eigenvectors",
        desc:
          "Compute eigenvalues/eigenvectors numerically with power/QR methods and more.",
      },
      iterative: {
        title: "Iterative Methods",
        desc:
          "Solve linear systems via Jacobi, Gauss–Seidel, SOR and Krylov subspace methods.",
      },
      direct: {
        title: "Direct Methods",
        desc:
          "LU/QR factorization, Gaussian elimination and variants for stable solutions.",
      },
      nonlinear: {
        title: "Nonlinear Systems",
        desc:
          "Techniques for systems of nonlinear equations with convergence insights.",
      },
    },
  };

  const calculus = [
    {
      title: dict.itemsCalc.root.title,
      description: dict.itemsCalc.root.desc,
      icon: FunctionSquare,
      id: "root-finding",
      to: "/root-finding",
    },
    {
      title: dict.itemsCalc.integ.title,
      description: dict.itemsCalc.integ.desc,
      icon: Sigma,
      id: "integration",
    },
    {
      title: dict.itemsCalc.ivp_bvp.title,
      description: dict.itemsCalc.ivp_bvp.desc,
      icon: ActivitySquare,
      id: "ivp-bvp",
    },
    {
      title: dict.itemsCalc.pdes.title,
      description: dict.itemsCalc.pdes.desc,
      icon: Calculator,
      id: "pdes",
    },
    {
      title: dict.itemsCalc.bvp.title,
      description: dict.itemsCalc.bvp.desc,
      icon: Waves,
      id: "bvp",
    },
  ];

  const nla = [
    {
      title: dict.itemsNla.eigen.title,
      description: dict.itemsNla.eigen.desc,
      icon: Shapes,
      id: "eigen",
    },
    {
      title: dict.itemsNla.iterative.title,
      description: dict.itemsNla.iterative.desc,
      icon: CircuitBoard,
      id: "iterative",
    },
    {
      title: dict.itemsNla.direct.title,
      description: dict.itemsNla.direct.desc,
      icon: Grid3x3,
      id: "direct",
    },
    {
      title: dict.itemsNla.nonlinear.title,
      description: dict.itemsNla.nonlinear.desc,
      icon: FunctionSquare,
      id: "nonlinear",
    },
  ];

  return (
    <section className="w-full bg-white py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section 1 */}
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-10 underline underline-offset-8 decoration-blue-600 decoration-2">
          {dict.sec1}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-16">
          {calculus.map(({ title, description, icon, id, to }) => (
            <div key={id} id={id}>
              <MethodCard title={title} description={description} icon={icon} to={to} />
            </div>
          ))}
        </div>

        {/* Section 2 */}
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-10 underline underline-offset-8 decoration-blue-600 decoration-2">
          {dict.sec2}
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
