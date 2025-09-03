from typing import Any, Dict, List, Optional
from math import sqrt, isfinite
from sympy import symbols, sympify, lambdify

def muller_iterations(
    expr_str: str,
    x0: float, x1: float, x2: float,
    tol: float = 1e-6, max_iter: int = 100
) -> Dict[str, Any]:
    """
    Retorna um dicionário no mesmo formato dos outros métodos:
    {
      "method": "muller",
      "converged": bool,
      "root": Optional[float],
      "iterations": [{"iter": int, "x": float, "fx": float, "dx": Optional[float]}],
      "message": Optional[str],
    }
    """
    x = symbols("x")
    try:
        expr = sympify(expr_str)
    except Exception as e:
        return {
            "method": "muller",
            "converged": False,
            "root": None,
            "iterations": [],
            "message": f"invalid expression: {e}",
        }

    f = lambdify(x, expr, "math")

    x0 = float(x0); x1 = float(x1); x2 = float(x2)
    try:
        f0 = float(f(x0))
        f1 = float(f(x1))
        f2 = float(f(x2))
    except Exception as e:
        return {
            "method": "muller",
            "converged": False,
            "root": None,
            "iterations": [],
            "message": f"invalid evaluation: {e}",
        }

    iterations: List[Dict[str, Any]] = []

    for k in range(1, max_iter + 1):
        h1 = x1 - x0
        h2 = x2 - x1
        if h1 == 0.0 or h2 == 0.0:
            return {
                "method": "muller",
                "converged": False,
                "root": x2,
                "iterations": iterations,
                "message": "degenerate points (duplicate x)",
            }

        delta1 = (f1 - f0) / h1
        delta2 = (f2 - f1) / h2
        denom_h = (h2 + h1)
        if denom_h == 0.0:
            return {
                "method": "muller",
                "converged": False,
                "root": x2,
                "iterations": iterations,
                "message": "degenerate spacing (h1 + h2 = 0)",
            }

        d = (delta2 - delta1) / denom_h  # 2ª diferença dividida
        b = delta2 + h2 * d
        disc = b*b - 4.0 * f2 * d

        if not isfinite(disc) or disc < 0.0:
            return {
                "method": "muller",
                "converged": False,
                "root": x2,
                "iterations": iterations,
                "message": "negative or non-finite discriminant",
            }

        D = sqrt(disc)

        # Evita cancelamento numérico: usa o denominador de maior magnitude
        denom1 = b + D
        denom2 = b - D
        denom = denom1 if abs(denom1) > abs(denom2) else denom2
        if denom == 0.0:
            return {
                "method": "muller",
                "converged": False,
                "root": x2,
                "iterations": iterations,
                "message": "zero denominator",
            }

        x3 = x2 - (2.0 * f2) / denom
        try:
            f3 = float(f(x3))
        except Exception as e:
            return {
                "method": "muller",
                "converged": False,
                "root": x3,
                "iterations": iterations,
                "message": f"invalid evaluation at x3: {e}",
            }

        dx = x3 - x2
        iterations.append({"iter": k, "x": float(x3), "fx": float(f3), "dx": abs(dx)})

        if abs(dx) < tol or abs(f3) < tol:
            return {
                "method": "muller",
                "converged": True,
                "root": float(x3),
                "iterations": iterations,
                "message": None,
            }

        # shift
        x0, f0 = x1, f1
        x1, f1 = x2, f2
        x2, f2 = x3, f3

    return {
        "method": "muller",
        "converged": False,
        "root": float(x2),
        "iterations": iterations,
        "message": "no convergence within max_iter",
    }
