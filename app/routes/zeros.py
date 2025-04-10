from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates

router = APIRouter(
    prefix="/api",
    tags=["numerical_methods"]
)

templates = Jinja2Templates(directory="app/templates")

@router.get("/metodos/bissecao")  # Removi o name="bissecao" e deixei apenas o path
async def metodo_bissecao(request: Request):
    return templates.TemplateResponse("metodos/bissecao.html", {"request": request})

@router.get("/metodos/newton")
async def metodo_newton(request:Request):
    return templates.TemplateResponse("metodos/newton.html",{"request":request})


@router.get("/metodos/secante")
async def metodo_newton(request:Request):
    return templates.TemplateResponse("metodos/secante.html",{"request":request})


@router.get("/metodos/muller")
async def metodo_newton(request:Request):
    return templates.TemplateResponse("metodos/muller.html",{"request":request})