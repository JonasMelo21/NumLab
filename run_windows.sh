#!/usr/bin/env bash
# Uso:
#   bash run_windows.sh           # modo dev (FastAPI + Vite dev)
#   bash run_windows.sh build     # build do frontend + FastAPI + vite preview

set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

MODE="${1:-dev}"              # dev (padrão) | build
FRONTEND_PORT="${FRONTEND_PORT:-5173}"   # pode mudar exportando FRONTEND_PORT=xxxx antes de rodar

echo ">>> Using project root: $ROOT_DIR"
echo ">>> MODE: $MODE"

# ----------------------------
# 0) Detectar Python (Windows-friendly)
# ----------------------------
find_python() {
  if command -v py >/dev/null 2>&1; then
    for v in -3.13 -3.12 -3.11 -3; do
      if py "$v" -V >/dev/null 2>&1; then
        echo "py $v"; return 0
      fi
    done
    echo "py"; return 0
  fi
  for c in python3 python; do
    if command -v "$c" >/dev/null 2>&1; then
      echo "$c"; return 0
    fi
  done
  return 1
}
IFS=' ' read -r -a PY_CMD <<<"$(find_python)" || { echo "Python não encontrado."; exit 1; }
echo ">>> Python: ${PY_CMD[*]}"
"${PY_CMD[@]}" -V || true

# ----------------------------
# 1) Python venv na raiz + deps
# ----------------------------
if [[ ! -d ".venv" ]]; then
  echo ">>> Creating Python venv at $ROOT_DIR/.venv"
  "${PY_CMD[@]}" -m venv .venv
fi

# Ativar venv (Windows / Unix)
if [[ -f ".venv/Scripts/activate" ]]; then
  # shellcheck disable=SC1091
  source ".venv/Scripts/activate"
elif [[ -f ".venv/bin/activate" ]]; then
  # shellcheck disable=SC1091
  source ".venv/bin/activate"
else
  echo "Não encontrei o activate da venv."; exit 1
fi

python -m pip install --upgrade pip
python -m pip install -r backend/requirements.txt

# ----------------------------
# 2) Frontend deps (+ .env)
# ----------------------------
pushd frontend >/dev/null

if [[ ! -f ".env.development" ]]; then
  echo "VITE_API_BASE=http://localhost:8000" > .env.development
  echo ">>> Created frontend/.env.development with VITE_API_BASE=http://localhost:8000"
fi

if command -v npm >/dev/null 2>&1; then
  echo ">>> Installing frontend deps..."
  (npm ci && echo ">>> npm ci ok") || (npm install && echo ">>> npm install ok")
else
  echo "ERROR: npm not found. Instale Node.js (>= 20.19 ou 22.12+) e npm." >&2
  exit 1
fi

popd >/dev/null

# ----------------------------
# 3) Modo build: build + preview
# ----------------------------
if [[ "$MODE" == "build" ]]; then
  echo ">>> Building frontend..."
  pushd frontend >/dev/null
  npm run build
  popd >/dev/null

  echo ">>> Starting FastAPI (port 8000) & vite preview (port $FRONTEND_PORT)"
  pushd backend >/dev/null
  python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 &
  BACK_PID=$!
  popd >/dev/null

  cleanup() { echo; echo ">>> Shutting down..."; kill "$BACK_PID" 2>/dev/null || true; }
  trap cleanup EXIT INT TERM

  pushd frontend >/dev/null
  npx vite preview --host 0.0.0.0 --port "$FRONTEND_PORT"
  popd >/dev/null
  exit 0
fi

# ----------------------------
# 4) Modo dev: backend + frontend juntos
# ----------------------------
echo ">>> Starting FastAPI (port 8000) with reload..."
pushd backend >/dev/null
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACK_PID=$!
popd >/dev/null

cleanup() {
  echo
  echo ">>> Shutting down FastAPI..."
  kill "$BACK_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

echo ">>> Starting Vite dev server (port $FRONTEND_PORT)..."
pushd frontend >/dev/null
# --port fixa a porta; se estiver ocupada, Vite pode sugerir outra.
npm run dev -- --host --port "$FRONTEND_PORT"
popd >/dev/null

# Fim
