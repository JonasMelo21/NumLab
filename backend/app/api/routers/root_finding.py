from fastapi import APIRouter, HTTPException
from app.services.rootFinding.newton import newton_iterations
from app.services.rootFinding.secant import secant_iterations
from app.services.rootFinding.bisection import bisection_iterations
from app.services.rootFinding.muller import muller_iterations
from app.api.schemas.root_finding import (
    NewtonRequest, NewtonResponse,
    SecantRequest, SecantResponse,
    BisectionRequest, BisectionResponse,
    MullerRequest, MullerResponse,
)

router = APIRouter(prefix="/root-finding", tags=["root-finding"])

@router.post("/newton", response_model=NewtonResponse)
def run_newton(req: NewtonRequest):
    result = newton_iterations(req.fx, req.x0, req.tol, req.max_iter)
    if result.get("message") == "invalid expression":
        raise HTTPException(status_code=400, detail=result["message"])
    return result

@router.post("/secant", response_model=SecantResponse)
def run_secant(req: SecantRequest):
    result = secant_iterations(req.fx, req.x0, req.x1, req.tol, req.max_iter)
    if isinstance(result.get("message"), str) and result["message"].startswith("invalid expression"):
        raise HTTPException(status_code=400, detail=result["message"])
    return result

@router.post("/bisection", response_model=BisectionResponse)
def run_bisection(req: BisectionRequest):
    result = bisection_iterations(req.fx, req.a, req.b, req.tol, req.max_iter)
    if isinstance(result.get("message"), str) and result["message"].startswith("invalid expression"):
        raise HTTPException(status_code=400, detail=result["message"])
    return result

@router.post("/muller", response_model=MullerResponse)
def run_muller(req: MullerRequest):
    result = muller_iterations(req.fx, req.x0, req.x1, req.x2, req.tol, req.max_iter)
    if isinstance(result.get("message"), str) and result["message"].startswith("invalid expression"):
        raise HTTPException(status_code=400, detail=result["message"])
    return result
