from pydantic import BaseModel, Field
from typing import List, Optional, Literal

class IterationRow(BaseModel):
    iter: int
    x: float
    fx: float
    dx: Optional[float] = None

class NewtonRequest(BaseModel):
    fx: str = Field(..., description="Ex: x**3 - x - 2")
    x0: float = Field(..., description="Initial guess")
    tol: float = Field(1e-6, gt=0)
    max_iter: int = Field(50, gt=0)

class NewtonResponse(BaseModel):
    method: Literal["newton"]
    converged: bool
    root: Optional[float] = None
    iterations: List[IterationRow]
    message: Optional[str] = None

class SecantRequest(BaseModel):
    fx: str
    x0: float
    x1: float
    tol: float = Field(1e-6, gt=0)
    max_iter: int = Field(50, gt=0)

class SecantResponse(BaseModel):
    method: Literal["secant"]
    converged: bool
    root: Optional[float] = None
    iterations: List[IterationRow]
    message: Optional[str] = None

class BisectionRequest(BaseModel):
    fx: str
    a: float
    b: float
    tol: float = Field(1e-6, gt=0)
    max_iter: int = Field(100, gt=0)

class BisectionResponse(BaseModel):
    method: Literal["bisection"]
    converged: bool
    root: Optional[float] = None
    iterations: List[IterationRow]
    message: Optional[str] = None

class MullerRequest(BaseModel):
    fx: str
    x0: float
    x1: float
    x2: float
    tol: float = Field(1e-6, gt=0)
    max_iter: int = Field(100, gt=0)

class MullerResponse(BaseModel):
    method: Literal["muller"]
    converged: bool
    root: Optional[float] = None
    iterations: List[IterationRow]
    message: Optional[str] = None
