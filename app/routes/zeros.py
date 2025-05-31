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

@router.get("/metodos/diferencas_finitas")
async def metodo_diferencas_finitas(request:Request):
    return templates.TemplateResponse("metodos/diferencasfinitas.html",{"request":request})

@router.get("/metodos/regra_trapezio")
async def regra_trapezio(request:Request):
    return templates.TemplateResponse("metodos/diferencasfinitas.html",{"request":request})

@router.get("/metodos/quadraturas_gauss")
async def quadraturas_gauss(request:Request):
    return templates.TemplateResponse("metodos/quadraturas_gauss.html",{"request":request})

@router.get("/metodos/pvi_edos")
async def quadraturas_gauss(request:Request):
    return templates.TemplateResponse("metodos/pvi_edos.html",{"request":request})

@router.get("/metodos/pvc_edos")
async def quadraturas_gauss(request:Request):
    return templates.TemplateResponse("metodos/pvc_edos.html",{"request":request})

@router.get("/metodos/edp_diferencas_finitas")
async def quadraturas_gauss(request:Request):
    return templates.TemplateResponse("metodos/edp_diferencas_finitas.html",{"request":request})

@router.get("/metodos/edp_elementos_finitos")
async def quadraturas_gauss(request:Request):
    return templates.TemplateResponse("metodos/edp_elementos_finitos.html",{"request":request})

@router.get("/metodos/edp_metodos_espectrais")
async def quadraturas_gauss(request:Request):
    return templates.TemplateResponse("metodos/edp_metodos_espectrais.html",{"request":request})