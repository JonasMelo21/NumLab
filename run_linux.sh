#!/usr/bin/env bash
set -euo pipefail

# Raiz do projeto
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

MODE="${1:-dev}"   # dev (padrão) | build

echo ">>> Using project root: $ROOT_DIR"
echo ">>> MODE: $MODE"

# ----------------------------
# 1) Python venv na raiz + deps
# ----------------------------
if [[ ! -d ".venv" ]]; then
  echo ">>> Creating Python venv at $ROOT_DIR/.venv"
  python3 -m venv .venv
fi
# shellcheck source=/dev/null
source .venv/bin/activate

python3 -V || true
pip --version || true
python3 -m pip install --upgrade pip
python3 -m pip install -r backend/requirements.txt

# ----------------------------
# 2) Frontend deps (+ .env)
# ----------------------------
pushd frontend >/dev/null

# Garante a base da API para o Vite (pode ajustar depois)
if [[ ! -f ".env.development" ]]; then
  echo "VITE_API_BASE=http://localhost:8000" > .env.development
  echo ">>> Created frontend/.env.development with VITE_API_BASE=http://localhost:8000"
fi

if command -v npm >/dev/null 2>&1; then
  echo ">>> Installing frontend deps..."
  # prefere npm ci se o lock existir e for compatível
  (npm ci && echo ">>> npm ci ok") || (npm install && echo ">>> npm install ok")
else
  echo "ERROR: npm not found. Install Node.js (>= 20.19 or 22.12+) and npm." >&2
  exit 1
fi

popd >/dev/null

# ----------------------------
# 3) Modo build (opcional)
# ----------------------------
if [[ "$MODE" == "build" ]]; then
  echo ">>> Building frontend..."
  pushd frontend >/dev/null
  npm run build
  echo ">>> Starting FastAPI (port 8000) & vite preview (port 5173)"
  # Sobe backend em background
  pushd "$ROOT_DIR/backend" >/dev/null
  uvicorn app.main:app --host 0.0.0.0 --port 8000 &
  BACK_PID=$!
  popd >/dev/null

  # Garante que o backend morra quando sair
  cleanup() { echo; echo ">>> Shutting down..."; kill "$BACK_PID" 2>/dev/null || true; }
  trap cleanup EXIT INT TERM

  # Servir o build do frontend
  npx vite preview --host 0.0.0.0 --port 5173
  exit 0
fi

# ----------------------------
# 4) Modo dev: backend + frontend juntos
# ----------------------------
echo ">>> Starting FastAPI (port 8000) with reload..."
pushd backend >/dev/null
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACK_PID=$!
popd >/dev/null

cleanup() {
  echo
  echo ">>> Shutting down FastAPI..."
  kill "$BACK_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

echo ">>> Starting Vite dev server (port 5173)..."
pushd frontend >/dev/null
# --host para permitir acesso de outras máquinas da rede, se quiser
npm run dev -- --host
popd >/dev/null
