from fastapi import APIRouter, Depends, HTTPException, Request, Response
from fastapi.security import HTTPBearer
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from pydantic import BaseModel
import secrets
from datetime import datetime
from ..databases import SessionLocal
from ..models import User

# Configuração dos templates
templates = Jinja2Templates(directory="app/templates")

# Definição das classes Pydantic (devem vir antes das rotas que as usam)
class UserCreate(BaseModel):
    name: str
    email: str
    username: str
    password: str

class UserLogin(BaseModel):
    login: str  # Pode ser email ou username
    password: str

router = APIRouter(prefix="/api", tags=["auth"])



def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/cadastro")
async def carrega_cadastro(request: Request):
    return templates.TemplateResponse("cadastro.html", {"request": request})

@router.post("/adduser")
async def add_user(user: UserCreate, db: Session = Depends(get_db)):
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
    return {"message": "Usuário criado"}

@router.get("/login")
async def carrega_login(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@router.post("/login")
async def login(user_data: UserLogin, response: Response, db: Session = Depends(get_db)):
    return Jinja2Templates.TemplateResponse("login.html")

@router.post("/logout")
async def logout(response: Response, request: Request):
    return