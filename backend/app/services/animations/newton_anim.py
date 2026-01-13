# backend/app/services/animations/newton_anim.py
from __future__ import annotations
from pathlib import Path
import shutil
from typing import Dict, List, Tuple, Callable, Optional

from manim import *
import numpy as np

from sympy import latex as sp_latex
from sympy import Eq, S, solveset, FiniteSet

from .utils import parse_function, payload_hash

DEFAULTS = {
    "x_range": (-5, 5, 1),
    "y_range": (-5, 5, 1),
    "fps": 30,
}

def _safe(f: Callable[[float], float]):
    def g(t):
        try:
            return float(f(t))
        except Exception:
            return np.nan
    return g

def _refine_true_root(
    f: Callable[[float], float],
    df: Callable[[float], float],
    x0: float,
    max_iter: int = 50,
    tol_change: float = 1e-12,
    tol_fx: float = 1e-12,
) -> float:
    """Refina uma raiz real com Newton a partir de x0 (mesma bacia), com tolerância alta."""
    xk = float(x0)
    for _ in range(max_iter):
        dfx = df(xk)
        fx = f(xk)
        if not np.isfinite(fx) or not np.isfinite(dfx) or abs(dfx) < 1e-15:
            break
        xk1 = xk - fx / dfx
        if abs(xk1 - xk) < tol_change or abs(fx) < tol_fx:
            xk = xk1
            break
        xk = xk1
    return float(xk)

def _sequence_until_true_root(
    f: Callable[[float], float],
    df: Callable[[float], float],
    x0: float,
    x_true: float,
    tol_to_true: float,
    max_iter: int,
) -> List[float]:
    """Gera xs do Newton até ficar a tol_to_true da raiz refinada (ou atingir max_iter)."""
    xs = [float(x0)]
    xk = float(x0)
    for _ in range(max_iter):
        dfx = df(xk)
        fx = f(xk)
        if not np.isfinite(fx) or not np.isfinite(dfx) or abs(dfx) < 1e-15:
            break
        xk1 = xk - fx / dfx
        xs.append(float(xk1))
        if abs(xk1 - x_true) < tol_to_true:
            break
        xk = xk1
    return xs

def _sequence_fixed_steps(
    f: Callable[[float], float],
    df: Callable[[float], float],
    x0: float,
    steps: int,
) -> List[float]:
    """Gera xs por um número fixo de iterações (para o caso 'sem raiz real')."""
    xs = [float(x0)]
    xk = float(x0)
    for _ in range(steps):
        dfx = df(xk)
        fx = f(xk)
        if not np.isfinite(fx) or not np.isfinite(dfx) or abs(dfx) < 1e-15:
            break
        xk = xk - fx / dfx
        xs.append(float(xk))
    return xs

def _expand_range_to_include(
    base_range: Tuple[float, float, float],
    values: List[float],
    pad: float = 0.5,
    min_span: float = 2.0,
) -> Tuple[float, float, float]:
    """Expande x_range para incluir todos os 'values', com uma folga."""
    x_min, x_max, step = base_range
    if not values:
        return base_range
    vmin = min(values)
    vmax = max(values)
    x_min = min(x_min, vmin - pad)
    x_max = max(x_max, vmax + pad)
    if (x_max - x_min) < min_span:
        mid = 0.5 * (x_min + x_max)
        x_min = mid - min_span / 2
        x_max = mid + min_span / 2
    return (float(x_min), float(x_max), step)

def _symmetric_range_from_x0(x0: float, step: float, extra: float = 5.0) -> Tuple[float, float, float]:
    """
    Cria um range simétrico em torno de 0 com raio R = |x0| + extra.
    Ex.: x0 = -6 -> R = 11, intervalo = (-11, 11, step)
    """
    R = float(abs(x0) + extra)
    # Evita R muito pequeno
    if R < 5.0:
        R = 5.0
    return (-R, R, step)

class NewtonScene(Scene):
    data: dict  # ajuda de tipagem

    def construct(self):
        f = self.data["f"]
        df = self.data["df"]
        xs: List[float] = self.data["xs"]
        x_range = self.data["x_range"]
        y_range = self.data["y_range"]
        function_tex: str = self.data["function_tex"]
        has_real_root: bool = self.data["has_real_root"]
        x_true: Optional[float] = self.data.get("x_true", None)

        # ---------- Título ----------
        title = MathTex(rf"f(x) = {function_tex}", font_size=52)
        title.to_edge(UP, buff=0.6)

        # ---------- Eixos ----------
        axes = Axes(
            x_range=list(x_range),
            y_range=list(y_range),
            x_length=10,
            y_length=6,
            axis_config={"color": WHITE, "include_numbers": True, "font_size": 28},
            tips=False,
        )
        axes.to_edge(DOWN, buff=0.6)

        # ---------- Curva ----------
        graph = axes.plot(_safe(f), color=YELLOW, x_range=[x_range[0], x_range[1]])

        # Label do gráfico (com fundo p/ legibilidade)
        func_label = MathTex(r"f(x)", font_size=36)
        func_label.move_to(axes.get_corner(UR) + LEFT * 0.7 + DOWN * 0.6)
        label_bg = BackgroundRectangle(
            func_label, color=BLACK, fill_opacity=0.9, buff=0.08, stroke_width=0
        )
        label_group = Group(label_bg, func_label)

        # Anti-sobreposição com o título
        margin = 0.15
        if label_group.get_top()[1] > (title.get_bottom()[1] - margin):
            delta = label_group.get_top()[1] - (title.get_bottom()[1] - margin)
            label_group.shift(DOWN * (delta + 0.2))

        # ---------- Animações de entrada ----------
        self.play(FadeIn(title))
        self.wait(0.2)
        self.play(Create(axes))
        self.play(Create(graph), FadeIn(label_group))

        # ---------- Helpers ----------
        def tangent_line_at(x0: float, span: float = 3.5, color=BLUE):
            m = df(x0)
            y0 = f(x0)
            if not np.isfinite(m) or not np.isfinite(y0):
                m = 0.0
                y0 = 0.0
            xA, xB = x0 - span, x0 + span
            yA = y0 + m * (xA - x0)
            yB = y0 + m * (xB - x0)
            return Line(
                axes.coords_to_point(xA, yA),
                axes.coords_to_point(xB, yB),
                color=color
            )

        # ---------- Iterações (ponto móvel, tangente, queda vertical) ----------
        xk = xs[0]
        moving_dot = Dot(axes.i2gp(xk, graph), color=RED).scale(0.95)  # bolinha um pouco maior
        self.play(FadeIn(moving_dot))

        for i in range(len(xs) - 1):
            tan = tangent_line_at(xk, color=BLUE)
            self.play(Create(tan), run_time=0.35)
            self.wait(0.12)

            xk1 = xs[i + 1]
            Xk1 = axes.coords_to_point(xk1, 0)
            self.play(moving_dot.animate.move_to(Xk1), run_time=0.35)
            self.wait(0.12)

            Pk1 = axes.i2gp(xk1, graph)
            vertical = DashedLine(Xk1, Pk1, color=GRAY_B, dash_length=0.1)
            self.play(Create(vertical), moving_dot.animate.move_to(Pk1), run_time=0.35)
            self.wait(0.12)

            self.play(FadeOut(tan), FadeOut(vertical), run_time=0.25)
            xk = xk1

        # ---------- Final ----------
        if has_real_root and (x_true is not None) and np.isfinite(x_true):
            root_point = axes.coords_to_point(float(x_true), 0.0)
            dot_root = Dot(root_point, color=RED).scale(1.5)
            text_root = Text(
                f"Root ≈ {float(x_true):.6f}",
                font_size=36
            ).next_to(dot_root, DOWN + RIGHT, buff=0.6)
            self.play(FadeIn(dot_root), Write(text_root))
            self.play(FadeOut(moving_dot))
        else:
            # Sem raiz real em R: mensagem explicativa
            info = Text(
                "No Real Root (f(x) does not intersect x-axis)",
                font_size=34,
                color=RED,
            )
            # limpa a tela e mostra a mensagem no topo
            self.play(FadeOut(Group(*self.mobjects)))
            self.play(FadeIn(info.to_edge(UP)))

        self.wait(0.8)

def render_newton_video(
    function: str,
    x0: float,
    *,
    x_range: Tuple[float, float, float] = DEFAULTS["x_range"],
    y_range: Tuple[float, float, float] = DEFAULTS["y_range"],
    max_iter: int = 25,
    tol: float = 1e-8,
    quality: str = "low_quality",
    fps: int = DEFAULTS["fps"],
    media_dir: str = "app/media",
) -> Dict[str, str]:
    """
    - Se existir raiz real: estima raiz com refinamento e anima até |x_k - x_true| < max(tol, 9e-6).
    - Se NÃO existir raiz real: anima um número fixo de iterações e encerra com mensagem.
    - Intervalos x/y começam simétricos com R = |x0| + 5 e depois são expandidos para conter xs/raiz.
    """
    # parse
    x_sym, expr, f, df = parse_function(function)
    function_tex = sp_latex(expr)

    # Detecta se há raiz real com SymPy
    has_real_root = True
    x_true: Optional[float] = None
    try:
        solset = solveset(Eq(expr, 0), x_sym, domain=S.Reals)
        if solset is S.EmptySet:
            has_real_root = False
        elif isinstance(solset, FiniteSet):
            sols = [float(s) for s in list(solset) if s.is_real]
            if len(sols) == 0:
                has_real_root = False
            else:
                x_true = min(sols, key=lambda v: abs(v - x0))
        else:
            # Conjunto infinito (ex.: sin) ou outro caso simbólico: usa refinamento
            x_true = _refine_true_root(f, df, x0, max_iter=50, tol_change=1e-12, tol_fx=1e-12)
            if not np.isfinite(x_true) or abs(f(x_true)) > 1e-6:
                has_real_root = False
                x_true = None
    except Exception:
        try:
            xr = _refine_true_root(f, df, x0, max_iter=50, tol_change=1e-12, tol_fx=1e-12)
            if np.isfinite(xr) and abs(f(xr)) <= 1e-6:
                x_true = xr
                has_real_root = True
            else:
                has_real_root = False
                x_true = None
        except Exception:
            has_real_root = False
            x_true = None

    # tolerância para stop visual (>= 6 casas)
    tol_display = max(tol, 9e-6)

    # sequência de iterações
    if has_real_root and (x_true is not None):
        xs = _sequence_until_true_root(f, df, x0, float(x_true), tol_display, max_iter=max_iter)
        values_for_window = xs + [float(x_true)]
    else:
        xs = _sequence_fixed_steps(f, df, x0, steps=min(max_iter, 8))
        values_for_window = xs

    # ----- Intervalos base simétricos a partir de x0 -----
    base_x_range = _symmetric_range_from_x0(x0, step=x_range[2], extra=5.0)
    base_y_range = _symmetric_range_from_x0(x0, step=y_range[2], extra=5.0)

    # ajustes de janela para conter xs (e x_true, se houver)
    adj_x_range = _expand_range_to_include(base_x_range, values_for_window, pad=0.5, min_span=2.5)

    # Para y_range, mantemos simétrico com o mesmo raio usado no x (após expansão)
    # Raio final do x:
    x_radius = max(abs(adj_x_range[0]), abs(adj_x_range[1]))
    adj_y_range = (-x_radius, x_radius, base_y_range[2])

    # hashing/nomes
    payload = {
        "method": "newton",
        "function": function,
        "x0": x0,
        "x_range": adj_x_range,
        "y_range": adj_y_range,
        "max_iter": max_iter,
        "tol": tol,
        "fps": fps,
        "quality": quality,
        "tol_display": tol_display,
        "has_real_root": has_real_root,
    }
    h = payload_hash(payload)
    filename = f"newton_{h}.mp4"

    # caminhos absolutos
    APP_DIR = Path(__file__).resolve().parents[2]  # .../backend/app
    MEDIA_ROOT = APP_DIR / "media"
    OUT_DIR = MEDIA_ROOT / "animations"
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out_path = OUT_DIR / filename

    # cache
    if out_path.exists():
        return {"filename": filename, "rel_dir": "animations"}

    # config do manim
    cfg = {
        "media_dir": str(MEDIA_ROOT),
        "video_dir": str(OUT_DIR),
        "pixel_width": 1280,
        "pixel_height": 720,
        "frame_rate": fps,
        "renderer": "cairo",
        "background_color": "#ffffff",
    }

    # prepara cena
    scene = NewtonScene()
    scene.data = {
        "f": f,
        "df": df,
        "xs": xs,
        "x_range": adj_x_range,
        "y_range": adj_y_range,
        "function_tex": function_tex,
        "has_real_root": has_real_root,
        "x_true": float(x_true) if (has_real_root and x_true is not None) else None,
    }

    from manim import tempconfig, config  # import local pra evitar conflitos
    with tempconfig(cfg):
        config.output_file = filename
        scene.render()

    # fallback de cópia, se necessário
    generated_path = None
    try:
        generated_path = Path(scene.renderer.file_writer.movie_file_path)
    except Exception:
        generated_path = None

    if not out_path.exists():
        if generated_path and generated_path.exists():
            shutil.copy2(generated_path, out_path)
        else:
            scene_name = f"{scene.__class__.__name__}.mp4"
            matches = list(MEDIA_ROOT.rglob(scene_name))
            if matches:
                shutil.copy2(matches[0], out_path)

    if not out_path.exists():
        raise RuntimeError("Failed to locate final Manim output file for copying.")

    return {"filename": filename, "rel_dir": "animations"}
