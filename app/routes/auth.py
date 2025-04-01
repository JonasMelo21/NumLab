# app/routes/auth.py
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from ..databases import SessionLocal
from ..models import User
from pydantic import BaseModel

router = APIRouter(
    prefix="/api",
    tags=["auth"]
)

# Instancia o Jinja2Templates com o diretório dos templates
templates = Jinja2Templates(directory="app/templates")

# Modelo Pydantic para validar os dados do cadastro
class UserCreate(BaseModel):
    name: str
    email: str
    username: str
    password: str

# Função para obter a sessão do banco de dados
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Rota para renderizar página de login
@router.get("/login")
def carrega_login(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

# Rota para renderizar página de cadastro
@router.get("/cadastro")
def carrega_cadastro(request: Request):
    return templates.TemplateResponse("cadastro.html", {"request": request})

# Rota para adicionar um usuário (cadastro)
@router.post("/adduser")
def add_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(
        (User.email == user.email) | 
        (User.username == user.username)
    ).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email ou nome de usuário já cadastrado")
    db_user = User(
        name=user.name,
        email=user.email,
        username=user.username,
        password=user.password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"message": "Usuário criado", "user_id": db_user.id}

# Placeholder para a rota de login (API)
@router.post("/login")
def login():
    return {"message": "Rota de login ainda não implementada"}

# Placeholder para a rota de logout (API)
@router.post("/logout")
def logout():
    return {"message": "Rota de logout ainda não implementada"}