# backend/app/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from .services.rootFinding.newton import newton_iterations
from .services.rootFinding.secant import secant_iterations
from .services.rootFinding.bisection import bisection_iterations
from .services.rootFinding.muller import muller_iterations  


# Ajuste as origins conforme seu ambiente
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",         
    "http://127.0.0.1:5174",         
]


app = FastAPI(title="NumLab API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----- Schemas -----

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


# ----- Routes -----
@app.post("/api/root-finding/newton", response_model=NewtonResponse)
def run_newton(req: NewtonRequest):
    result = newton_iterations(req.fx, req.x0, req.tol, req.max_iter)
    if result.get("message") == "invalid expression":
        raise HTTPException(status_code=400, detail=result["message"])
    return result


@app.post("/api/root-finding/secant", response_model=SecantResponse)
def run_secant(req: SecantRequest):
    result = secant_iterations(req.fx, req.x0, req.x1, req.tol, req.max_iter)
    if isinstance(result.get("message"), str) and result["message"].startswith("invalid expression"):
        raise HTTPException(status_code=400, detail=result["message"])
    return result

@app.post("/api/root-finding/bisection", response_model=BisectionResponse)
def run_bisection(req: BisectionRequest):
    result = bisection_iterations(req.fx, req.a, req.b, req.tol, req.max_iter)
    # só "invalid expression" vira 400, igual aos outros
    if isinstance(result.get("message"), str) and result["message"].startswith("invalid expression"):
        raise HTTPException(status_code=400, detail=result["message"])
    return result


@app.post("/api/root-finding/muller", response_model=MullerResponse)
def run_muller(req: MullerRequest):
    result = muller_iterations(req.fx, req.x0, req.x1, req.x2, req.tol, req.max_iter)
    if isinstance(result.get("message"), str) and result["message"].startswith("invalid expression"):
        raise HTTPException(status_code=400, detail=result["message"])
    return result
