# backend/app/services/animations/newton_anim.py
from __future__ import annotations
from pathlib import Path
import shutil
from typing import Dict, List, Tuple

from manim import (
    Scene, Axes, Dot, VGroup, Line, DashedLine, Text,
    FadeIn, FadeOut, Create, Transform, Wait, config, tempconfig,
    YELLOW, ORANGE, BLUE, GREEN, GREY
)
import numpy as np

from .utils import parse_function, newton_sequence, payload_hash

DEFAULTS = {
    "x_range": (-5, 5, 1),
    "y_range": (-5, 5, 1),
    "fps": 30,
}

def _build_scene_data(
    f, df, xs: List[float], x_range, y_range, function_str: str
):
    return {
        "f": f,
        "df": df,
        "xs": xs,
        "x_range": x_range,
        "y_range": y_range,
        "function_str": function_str,
    }

def _safe(f):
    def g(t):
        try:
            return float(f(t))
        except Exception:
            return np.nan
    return g

class NewtonScene(Scene):
    # ajuda o type checker do VSCode
    data: dict  # type: ignore

    def construct(self):
        data = self.data
        f, df, xs = data["f"], data["df"], data["xs"]
        x_range, y_range = data["x_range"], data["y_range"]
        function_str = data["function_str"]

        # 1) Introdução: só a função
        intro = Text(f"f(x) = {function_str}", font_size=52)
        self.play(FadeIn(intro))
        self.play(Wait(0.6))
        self.play(FadeOut(intro))

        # 2) Eixos + Curva
        axes = Axes(x_range=x_range, y_range=y_range, x_length=10, y_length=6, tips=False)
        self.play(Create(axes))

        graph = axes.plot(_safe(f), x_range=(x_range[0], x_range[1]))
        self.play(Create(graph))

        # 3) Iterações do Newton
        #    - marcar x_i no eixo x
        #    - ponto na curva em (x_i, f(x_i))
        #    - tangente em (x_i, f(x_i))
        #    - interseção no eixo x -> x_{i+1}
        #    - próximo ponto na curva
        dots_curve = VGroup()
        axis_marks = VGroup()

        axis_dot = None  # ponto atual no eixo x
        curve_dot = None # ponto atual na curva

        for i in range(len(xs) - 1):
            xi = xs[i]
            xi1 = xs[i + 1]
            yi = f(xi)
            dfi = df(xi)

            # marca x_i no eixo x
            new_axis_dot = Dot(axes.coords_to_point(xi, 0), color=YELLOW).scale(0.9)
            self.play(FadeIn(new_axis_dot), run_time=0.25)
            axis_marks.add(new_axis_dot)
            axis_dot = new_axis_dot

            # ponto na curva (x_i, f(x_i))
            new_curve_dot = Dot(axes.coords_to_point(xi, yi), color=BLUE)
            self.play(FadeIn(new_curve_dot), run_time=0.25)
            dots_curve.add(new_curve_dot)
            curve_dot = new_curve_dot

            # reta tangente em (xi, yi)
            tangent = axes.plot(lambda t: dfi * (t - xi) + yi, x_range=(x_range[0], x_range[1]))
            self.play(Create(tangent), run_time=0.35)

            # interseção com o eixo x: xi1
            # traçar uma linha da tangente até o eixo x (opcionalmente segmentada)
            # Usamos uma linha reta do ponto da curva até (xi1, 0) para evidenciar a iteração
            drop_to_axis = DashedLine(
                axes.coords_to_point(xi, yi),
                axes.coords_to_point(xi1, 0),
                dash_length=0.1
            )
            self.play(Create(drop_to_axis), run_time=0.25)

            next_axis_dot = Dot(axes.coords_to_point(xi1, 0), color=ORANGE).scale(1.0)
            self.play(FadeIn(next_axis_dot), run_time=0.2)
            axis_marks.add(next_axis_dot)

            # próxima aproximação na curva (xi1, f(xi1))
            next_curve_dot = Dot(axes.coords_to_point(xi1, f(xi1)), color=BLUE)
            self.play(Transform(curve_dot, next_curve_dot), run_time=0.4)
            # após o Transform, a referência curve_dot já representa o novo ponto
            curve_dot = next_curve_dot
            dots_curve.add(next_curve_dot)

            # limpar elementos auxiliares para próxima iteração
            self.play(FadeOut(tangent), FadeOut(drop_to_axis), run_time=0.2)

        # 4) Destaque da raiz aproximada
        x_star = xs[-1]
        root_axis_dot = Dot(axes.coords_to_point(x_star, 0), color=GREEN).scale(1.3)
        self.play(FadeIn(root_axis_dot), run_time=0.35)
        self.play(Wait(0.4))

        # 5) Encerramento: apaga cena e mostra função + raiz
        self.play(
            FadeOut(graph),
            FadeOut(axes),
            FadeOut(dots_curve),
            FadeOut(axis_marks),
            FadeOut(root_axis_dot),
            run_time=0.4
        )

        final_text = VGroup(
            Text(f"f(x) = {function_str}", font_size=48),
            Text(f"root ≈ {x_star:.6g}", font_size=40, color=GREEN)
        ).arrange(direction="DOWN", buff=0.4)

        self.play(FadeIn(final_text))
        self.play(Wait(0.8))
        self.play(FadeOut(final_text))

def render_newton_video(
    function: str,
    x0: float,
    *,
    x_range: Tuple[float, float, float] = DEFAULTS["x_range"],
    y_range: Tuple[float, float, float] = DEFAULTS["y_range"],
    max_iter: int = 6,
    tol: float = 1e-8,
    quality: str = "low_quality",  # mantido para compatibilidade da API
    fps: int = DEFAULTS["fps"],
    media_dir: str = "app/media",  # ignoramos o relativo e usamos absoluto calculado
) -> Dict[str, str]:
    # parse e sequência
    x, expr, f, df = parse_function(function)
    xs = newton_sequence(f, df, x0, max_iter=max_iter, tol=tol)

    payload = {
        "method": "newton", "function": function, "x0": x0,
        "x_range": x_range, "y_range": y_range,
        "max_iter": max_iter, "tol": tol, "fps": fps, "quality": quality
    }
    h = payload_hash(payload)
    filename = f"newton_{h}.mp4"

    # Caminhos ABSOLUTOS baseados na localização deste arquivo:
    # .../backend/app/services/animations/newton_anim.py
    # subindo 2 níveis -> .../backend/app
    APP_DIR = Path(__file__).resolve().parents[2]
    MEDIA_ROOT = APP_DIR / "media"
    OUT_DIR = MEDIA_ROOT / "animations"
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out_path = OUT_DIR / filename

    # cache: se já existe, retorna
    if out_path.exists():
        return {"filename": filename, "rel_dir": "animations"}

    # Configurar manim. Mesmo se ele insistir em salvar no default (.../media/videos/...),
    # depois do render nós copiamos para OUT_DIR/filename.
    cfg = {
        "media_dir": str(MEDIA_ROOT),     # base para vídeos/parciais
        "video_dir": str(OUT_DIR),        # destino preferido do MP4 final
        "pixel_width": 1280,
        "pixel_height": 720,
        "frame_rate": fps,
        "renderer": "cairo",
        "background_color": "#ffffff",
    }

    scene = NewtonScene()
    scene.data = _build_scene_data(f, df, xs, x_range, y_range, function)

    with tempconfig(cfg):
        # nome do arquivo final desejado
        config.output_file = filename
        scene.render()

    # Se por algum motivo o Manim não respeitar video_dir/output_file,
    # pegamos o caminho real gerado e copiamos para out_path.
    generated_path = None
    try:
        generated_path = Path(scene.renderer.file_writer.movie_file_path)
    except Exception:
        generated_path = None

    if not out_path.exists():
        # fallback 1: se o writer disse onde salvou, copia de lá
        if generated_path and generated_path.exists():
            shutil.copy2(generated_path, out_path)
        else:
            # fallback 2: procurar por NewtonScene.mp4 dentro de MEDIA_ROOT
            scene_name = f"{scene.__class__.__name__}.mp4"
            matches = list(MEDIA_ROOT.rglob(scene_name))
            if matches:
                shutil.copy2(matches[0], out_path)

    if not out_path.exists():
        # Última segurança: se ainda não criou, lança erro claro
        raise RuntimeError("Falha ao localizar o arquivo final do Manim para copiar.")

    return {"filename": filename, "rel_dir": "animations"}
