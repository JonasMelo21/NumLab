from fastapi import FastAPI, Request, Depends,  HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from .routes.auth import router as auth_router
from .routes.zeros import router as zeros_router
from .models import User
from .databases import SessionLocal, engine
import os

# Cria as tabelas do banco de dados (se não existirem)
User.metadata.create_all(bind=engine)

app = FastAPI(title="NumLab", description="Sistema de Laboratório Numérico")

# Configuração para servir arquivos estáticos
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# Templates
templates = Jinja2Templates(directory="app/templates")

# Inclui os roteadores
app.include_router(auth_router)
app.include_router(zeros_router)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/",name="index")
async def root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

