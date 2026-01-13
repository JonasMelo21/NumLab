from sympy import symbols, sympify, lambdify
from typing import List, Dict, Any, Optional

def secant_iterations(expr_str: str, x0: float, x1: float, tol: float = 1e-6, max_iter: int = 50) -> Dict[str, Any]:
    """
    Returns:
    {
      "method": "secant",
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
            "method": "secant",
            "converged": False,
            "root": None,
            "iterations": [],
            "message": f"invalid expression: {e}",
        }

    f = lambdify(x, expr, "math")

    iterations: List[Dict[str, Any]] = []

    x_prev = float(x0)
    x_curr = float(x1)
    f_prev = float(f(x_prev))
    f_curr = float(f(x_curr))

    # estados iniciais
    iterations.append({"iter": 0, "x": x_prev, "fx": f_prev, "dx": None})
    iterations.append({"iter": 1, "x": x_curr, "fx": f_curr, "dx": abs(x_curr - x_prev)})

    for k in range(2, max_iter + 1):
        denom = (f_curr - f_prev)
        if denom == 0.0:
            return {
                "method": "secant",
                "converged": False,
                "root": None,
                "iterations": iterations,
                "message": "zero denominator (f(x1) - f(x0) = 0)",
            }

        x_next = x_curr - f_curr * (x_curr - x_prev) / denom
        f_next = float(f(x_next))
        dx = abs(x_next - x_curr)

        iterations.append({"iter": k, "x": x_next, "fx": f_next, "dx": dx})

        if dx < tol or abs(f_next) < tol:
            return {
                "method": "secant",
                "converged": True,
                "root": x_next,
                "iterations": iterations,
                "message": None,
            }

        x_prev, f_prev = x_curr, f_curr
        x_curr, f_curr = x_next, f_next

    return {
        "method": "secant",
        "converged": False,
        "root": iterations[-1]["x"] if iterations else None,
        "iterations": iterations,
        "message": "no convergence within max_iter",
    }
