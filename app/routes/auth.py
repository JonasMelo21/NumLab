from fastapi import APIRouter, Depends, HTTPException, Request, Response
from fastapi.security import HTTPBearer
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from pydantic import BaseModel
import secrets
from datetime import datetime, timedelta
from ..databases import SessionLocal
from ..models import User
from fastapi.responses import RedirectResponse
from passlib.context import CryptContext

# Configuração dos templates
templates = Jinja2Templates(directory="app/templates")

# Configuração de hash de senhas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Definição das classes Pydantic
class UserCreate(BaseModel):
    name: str
    email: str
    username: str
    password: str

class UserLogin(BaseModel):
    usuarioLogin: str  # Changed from 'login' to match your form
    senhaLogin: str    # Changed from 'password' to match your form

router = APIRouter(prefix="/api", tags=["auth"])

# Configuração de sessão
SESSION_COOKIE_NAME = "session_token"
SESSION_EXPIRE_HOURS = 12

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str):
    return pwd_context.hash(password)

async def get_current_user(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get(SESSION_COOKIE_NAME)
    if not token:
        return None
    
    user = db.query(User).filter(User.session_token == token).first()
    if user and user.session_expiry > datetime.utcnow():
        return user
    return None

def create_session_token():
    return secrets.token_urlsafe(32)

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
        password=get_password_hash(user.password),
        session_token=None,
        session_expiry=None
    )
    db.add(db_user)
    db.commit()
    return {"message": "Usuário criado"}

@router.get("/login")
async def carrega_login(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@router.post("/login")
async def login(user_data: UserLogin, request: Request, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        (User.email == user_data.usuarioLogin) |  # Changed from user_data.login
        (User.username == user_data.usuarioLogin) # Changed from user_data.login
    ).first()

    if not user or not verify_password(user_data.senhaLogin, user.password):  # Changed from user_data.password
        return templates.TemplateResponse("login.html", {
            "request": request,
            "error": "Credenciais inválidas"
        })
    
    # Cria nova sessão
    user.session_token = create_session_token()
    user.session_expiry = datetime.utcnow() + timedelta(hours=SESSION_EXPIRE_HOURS)
    db.commit()

    response = RedirectResponse(url="/api/home", status_code=303)
    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=user.session_token,
        httponly=True,
        max_age=SESSION_EXPIRE_HOURS * 3600,
        secure=False,  # True em produção com HTTPS
        samesite="lax"
    )
    return response

@router.get("/home")
async def home_page(request: Request, db: Session = Depends(get_db)):
    user = await get_current_user(request, db)
    if not user:
        return RedirectResponse(url="/api/login", status_code=303)
    
    return templates.TemplateResponse("home.html", {
        "request": request,
        "user": user
    })

@router.get("/logout")
async def logout(request: Request, db: Session = Depends(get_db)):
    user = await get_current_user(request, db)
    if user:
        user.session_token = None
        user.session_expiry = None
        db.commit()
    
    response = RedirectResponse(url="/api/login", status_code=303)
    response.delete_cookie(SESSION_COOKIE_NAME)
    return response