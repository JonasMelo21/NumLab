from fastapi import FastAPI
from fastapi.templating import Jinja2Templates
from fastapi.requests import Request
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# Monta a pasta static para servir arquivos CSS, JS, etc.
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# Configura o Jinja2 para renderizar HTML
templates = Jinja2Templates(directory="app/templates")

@app.get("/")
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/login")
async def login(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@app.get("/cadastro")
async def cadastro(request:Request):
    return templates.TemplateResponse("cadastro.html",{"request":request})