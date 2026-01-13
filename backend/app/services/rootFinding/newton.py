# backend/app/services/rootFinding/newton.py
from sympy import symbols, sympify, lambdify, diff
from typing import List, Dict, Any, Optional


def newton_iterations(
    expr_str: str, x0: float, tol: float = 1e-6, max_iter: int = 50
) -> Dict[str, Any]:
    """
    Returns the dictionary:
    {
      "method": "newton",
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
            "method": "newton",
            "converged": False,
            "root": None,
            "iterations": [],
            "message": f"invalid expression: {e}",
        }

    f = lambdify(x, expr, "math")
    df = lambdify(x, diff(expr, x), "math")

    iterations: List[Dict[str, Any]] = []
    x_curr = float(x0)
    # iter 0 (estado inicial)
    fx_curr = float(f(x_curr))
    iterations.append({"iter": 0, "x": x_curr, "fx": fx_curr, "dx": None})

    for k in range(1, max_iter + 1):
        dfx = float(df(x_curr))
        if dfx == 0.0:
            return {
                "method": "newton",
                "converged": False,
                "root": None,
                "iterations": iterations,
                "message": "zero derivative encountered",
            }

        x_next = x_curr - fx_curr / dfx
        fx_next = float(f(x_next))
        dx = abs(x_next - x_curr)

        iterations.append({"iter": k, "x": x_next, "fx": fx_next, "dx": dx})

        if dx < tol or abs(fx_next) < tol:
            return {
                "method": "newton",
                "converged": True,
                "root": x_next,
                "iterations": iterations,
                "message": None,
            }

        x_curr, fx_curr = x_next, fx_next

    return {
        "method": "newton",
        "converged": False,
        "root": iterations[-1]["x"] if iterations else None,
        "iterations": iterations,
        "message": "no convergence within max_iter",
    }
