from pydantic import BaseModel, Field
from typing import Literal, Tuple

class NewtonAnimRequest(BaseModel):
    function: str = Field(..., examples=["x**3 - x - 2"])
    x0: float = Field(..., examples=[1.5])
    max_iter: int = 6
    tol: float = 1e-8
    x_range: Tuple[float, float, float] = (-5, 5, 1)
    y_range: Tuple[float, float, float] = (-5, 5, 1)
    fps: int = 30
    quality: Literal["low_quality","medium_quality","high_quality"] = "low_quality"

class NewtonAnimResponse(BaseModel):
    video_url: str
