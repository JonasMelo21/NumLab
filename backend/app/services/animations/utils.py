from __future__ import annotations
import hashlib, json
from typing import Callable, Tuple, List
import numpy as np
import sympy as sp

ALLOWED_FUNCS = {
    "sin": sp.sin, "cos": sp.cos, "tan": sp.tan,
    "exp": sp.exp, "log": sp.log, "ln": sp.log,
    "sqrt": sp.sqrt, "abs": sp.Abs,
    "asin": sp.asin, "acos": sp.acos, "atan": sp.atan,
    "sinh": sp.sinh, "cosh": sp.cosh, "tanh": sp.tanh,
    "pi": sp.pi, "e": sp.E,
}

def parse_function(expr_str: str) -> Tuple[sp.Symbol, sp.Expr, Callable, Callable]:
    x = sp.symbols("x")
    expr_str = expr_str.replace("^", "**")
    try:
        expr = sp.sympify(expr_str, locals={**ALLOWED_FUNCS, "x": x})
    except Exception as e:
        raise ValueError(f"Could not parse function: {e}")
    if len(expr.free_symbols - {x}) > 0:
        raise ValueError("The function must depend only on 'x'.")
    d_expr = sp.diff(expr, x)
    f = sp.lambdify(x, expr, modules=["numpy", {"Abs": np.abs}])
    df = sp.lambdify(x, d_expr, modules=["numpy"])
    return x, expr, f, df

def newton_sequence(f: Callable, df: Callable, x0: float, max_iter=6, tol=1e-8) -> List[float]:
    xs = [float(x0)]
    for _ in range(max_iter):
        xi = xs[-1]
        dfx = float(df(xi))
        if dfx == 0:
            break
        xi1 = xi - float(f(xi)) / dfx
        xs.append(xi1)
        if abs(xs[-1] - xi) < tol:
            break
    return xs

def payload_hash(payload: dict) -> str:
    s = json.dumps(payload, sort_keys=True).encode()
    return hashlib.sha1(s).hexdigest()
