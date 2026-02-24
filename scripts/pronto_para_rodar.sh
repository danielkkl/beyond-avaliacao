#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
WORK_DIR="$ROOT_DIR"
SRC_DIR="$ROOT_DIR"
ZIP_SOURCE="$ROOT_DIR/beyond-avaliacao-source (1).zip"

cd "$ROOT_DIR"

if [[ ! -f "$SRC_DIR/package.json" ]]; then
  if [[ -f "$ZIP_SOURCE" ]]; then
    echo "📦 package.json não encontrado na raiz. Extraindo source zip..."
    rm -rf "$ROOT_DIR/.runtime-src"
    mkdir -p "$ROOT_DIR/.runtime-src"
    python - <<'PY'
import zipfile, pathlib
root = pathlib.Path('.').resolve()
zip_path = root / 'beyond-avaliacao-source (1).zip'
out = root / '.runtime-src'
with zipfile.ZipFile(zip_path) as z:
    z.extractall(out)
PY

    if [[ -f "$ROOT_DIR/.runtime-src/beyond-avaliacao/package.json" ]]; then
      SRC_DIR="$ROOT_DIR/.runtime-src/beyond-avaliacao"
    else
      echo "❌ Não foi possível localizar package.json após extrair o zip."
      exit 1
    fi
  else
    echo "❌ package.json não encontrado e zip de source ausente."
    exit 1
  fi
fi

cd "$SRC_DIR"

echo "📁 Diretório de execução: $SRC_DIR"

if ! command -v pnpm >/dev/null 2>&1; then
  echo "🔧 pnpm não encontrado. Tentando habilitar via corepack..."
  if command -v corepack >/dev/null 2>&1; then
    corepack enable
    corepack prepare pnpm@latest --activate
  else
    echo "❌ corepack não disponível. Instale Node.js 18+ (com corepack) ou pnpm manualmente."
    exit 1
  fi
fi

echo "📦 Instalando dependências..."
pnpm install --frozen-lockfile || pnpm install

echo "🚀 Subindo aplicação em http://localhost:5173"
pnpm dev --host 0.0.0.0 --port 5173
