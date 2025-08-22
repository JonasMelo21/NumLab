#!/usr/bin/env bash
# Uso: bash run_windows.sh  (no Git Bash, salvar com LF)
set -Eeuo pipefail
trap 'echo "ERRO na linha $LINENO ao executar: $BASH_COMMAND" >&2' ERR

cd "$(dirname "$0")"  # raiz do projeto

echo "=== [1/8] Detectando Python…"
find_python() {
  if command -v py >/dev/null 2>&1; then
    for v in -3.13 -3.12 -3.11 -3; do
      if py "$v" -V >/dev/null 2>&1; then
        # retorna como array: exe + arg
        echo "py $v"
        return 0
      fi
    done
    echo "py"
    return 0
  fi
  for c in python3 python; do
    if command -v "$c" >/dev/null 2>&1; then
      echo "$c"
      return 0
    fi
  done
  return 1
}

# monta array PY_CMD
IFS=' ' read -r -a PY_CMD <<< "$(find_python)" || { echo "Python não encontrado." >&2; exit 1; }
echo "Python escolhido: ${PY_CMD[*]}"
"${PY_CMD[@]}" -V

echo "=== [2/8] Criando venv na raiz (.venv)…"
if [ ! -d ".venv" ]; then
  "${PY_CMD[@]}" -m venv .venv
fi

echo "=== [3/8] Ativando venv…"
if [ -f ".venv/Scripts/activate" ]; then
  # shellcheck disable=SC1091
  source ".venv/Scripts/activate"
elif [ -f ".venv/bin/activate" ]; then
  # shellcheck disable=SC1091
  source ".venv/bin/activate"
else
  echo "Não encontrei .venv/Scripts/activate nem .venv/bin/activate." >&2
  exit 1
fi

echo "pip em uso:"
python -m pip -V

echo "=== [4/8] Instalando deps Python (backend/requirements.txt)…"
test -f backend/requirements.txt || { echo "backend/requirements.txt não existe." >&2; exit 1; }
python -m pip install --upgrade pip
python -m pip install -r backend/requirements.txt

echo "=== [5/8] Conferindo Node/NPM…"
command -v node >/dev/null 2>&1 || { echo "Node não encontrado." >&2; exit 1; }
command -v npm  >/dev/null 2>&1 || { echo "npm não encontrado." >&2; exit 1; }
node -v
npm -v

echo "=== [6/8] Instalando deps do frontend…"
cd frontend
if [ -f "package-lock.json" ]; then
  npm ci
else
  npm install
fi

echo "=== [7/8] Build do frontend…"
npm run build

echo "=== [8/8] Subindo FastAPI…"
cd ../backend

# Abre navegador padrão no endereço
start http://localhost:8000/

# Usa o uvicorn do venv
exec python -m uvicorn app.main:app --host 0.0.0.0 --port 8000

