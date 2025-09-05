from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.staticfiles import StaticFiles
from pathlib import Path

from app.api.routers.root_finding import router as root_finding_router
from app.api.routers.animations import router as animations_router

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

# Caminho ABSOLUTO para .../backend/app/media
BASE_DIR = Path(__file__).resolve().parent            # .../backend/app
MEDIA_DIR = BASE_DIR / "media"
MEDIA_DIR.mkdir(parents=True, exist_ok=True)

# /media serve arquivos gerados (ex.: animações)
app.mount("/media", StaticFiles(directory=str(MEDIA_DIR)), name="media")

# Routers
app.include_router(root_finding_router, prefix="/api")
app.include_router(animations_router,   prefix="/api")
