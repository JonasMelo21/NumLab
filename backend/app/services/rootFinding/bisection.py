from typing import Any, Dict, List, Optional
from sympy import symbols, sympify, lambdify

def bisection_iterations(expr_str: str, a: float, b: float, tol: float = 1e-6, max_iter: int = 100) -> Dict[str, Any]:
    """
    Retorna:
    {
      "method": "bisection",
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
            "method": "bisection",
            "converged": False,
            "root": None,
            "iterations": [],
            "message": f"invalid expression: {e}",
        }

    f = lambdify(x, expr, "math")

    a = float(a)
    b = float(b)
    fa = float(f(a))
    fb = float(f(b))

    iterations: List[Dict[str, Any]] = []

    if fa * fb >= 0:
        return {
            "method": "bisection",
            "converged": False,
            "root": None,
            "iterations": iterations,
            "message": "interval does not bracket a root (f(a)*f(b) >= 0)",
        }

    for k in range(1, max_iter + 1):
        m = 0.5 * (a + b)
        fm = float(f(m))
        half_width = 0.5 * (b - a)

        iterations.append({"iter": k, "x": m, "fx": fm, "dx": abs(half_width)})

        if abs(half_width) < tol or abs(fm) < tol:
            return {
                "method": "bisection",
                "converged": True,
                "root": m,
                "iterations": iterations,
                "message": None,
            }

        # escolhe subintervalo com troca de sinal
        if fa * fm < 0:
            b, fb = m, fm
        else:
            a, fa = m, fm

    return {
        "method": "bisection",
        "converged": False,
        "root": iterations[-1]["x"] if iterations else None,
        "iterations": iterations,
        "message": "no convergence within max_iter",
    }
