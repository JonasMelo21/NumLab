#!/bin/bash
set -e  # parar se der erro

echo ">>> Ativando ambiente Python e instalando dependências..."
cd backend
if [ ! -d ".venv" ]; then
  python3 -m venv .venv
fi
source .venv/bin/activate
pip install -r requirements.txt

echo ">>> Instalando e buildando frontend..."
cd ../frontend
npm install
npm run build

echo ">>> Subindo servidor FastAPI..."
cd ../backend
uvicorn app.main:app --host 0.0.0.0 --port 8000

