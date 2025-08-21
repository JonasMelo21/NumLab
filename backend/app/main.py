# backend/app/main.py
from fastapi import FastAPI, APIRouter
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path

app = FastAPI(title="NumLab")

api = APIRouter(prefix="/api")

@api.get("/health")
def health():
    return {"status": "ok"}

app.include_router(api)

# ----- Servir SPA buildada -----
SPA_DIR = Path(__file__).resolve().parents[2] / "frontend" / "dist"
app.mount("/assets", StaticFiles(directory=SPA_DIR / "assets"), name="assets")

@app.get("/")
def index():
    return FileResponse(SPA_DIR / "index.html")

# Fallback p/ rotas do React (ex.: /calculus/ivp)
@app.get("/{_:path}")
def spa_fallback(_):
    return FileResponse(SPA_DIR / "index.html")
