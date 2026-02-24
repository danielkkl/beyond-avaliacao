#!/usr/bin/env bash
set -euo pipefail

APP_NAME="beyond-avaliacao"
VERSION="${1:-$(date +%Y%m%d-%H%M)}"
OUT_DIR="dist-release"
STAGING_DIR="${OUT_DIR}/${APP_NAME}-${VERSION}"
ARCHIVE_NAME="${APP_NAME}-${VERSION}.zip"

rm -rf "${STAGING_DIR}"
mkdir -p "${STAGING_DIR}"

copy_if_exists() {
  local src="$1"
  local dst="$2"
  if [[ -e "$src" ]]; then
    mkdir -p "$(dirname "$dst")"
    cp -R "$src" "$dst"
  fi
}

# Conteúdo mínimo para entrega/deploy
copy_if_exists "client" "${STAGING_DIR}/client"
copy_if_exists "README.md" "${STAGING_DIR}/README.md"
copy_if_exists "DEPLOY_IONOS.md" "${STAGING_DIR}/DEPLOY_IONOS.md"
copy_if_exists "TPS_SaaS_Avaliacao_Fisioterapeutica.md" "${STAGING_DIR}/TPS_SaaS_Avaliacao_Fisioterapeutica.md"
copy_if_exists "API.md" "${STAGING_DIR}/API.md"
copy_if_exists "LICENSE" "${STAGING_DIR}/LICENSE"
copy_if_exists "todo.md" "${STAGING_DIR}/todo.md"
copy_if_exists "TROUBLESHOOTING.md" "${STAGING_DIR}/TROUBLESHOOTING.md"
copy_if_exists "SETUP_DATABASE_VERCEL.md" "${STAGING_DIR}/SETUP_DATABASE_VERCEL.md"
copy_if_exists "SETUP_NETLIFY.sh" "${STAGING_DIR}/SETUP_NETLIFY.sh"
copy_if_exists "vite.config.ts" "${STAGING_DIR}/vite.config.ts"
copy_if_exists "tsconfig.json" "${STAGING_DIR}/tsconfig.json"
copy_if_exists "tsconfig.node.json" "${STAGING_DIR}/tsconfig.node.json"
copy_if_exists "vitest.config.ts" "${STAGING_DIR}/vitest.config.ts"
copy_if_exists "scripts/create_release_bundle.ps1" "${STAGING_DIR}/scripts/create_release_bundle.ps1"
copy_if_exists "scripts/create_release_bundle.bat" "${STAGING_DIR}/scripts/create_release_bundle.bat"
copy_if_exists "PACOTE_WINRAR_PRONTO.md" "${STAGING_DIR}/PACOTE_WINRAR_PRONTO.md"

mkdir -p "${OUT_DIR}"
(
  cd "${OUT_DIR}"
  rm -f "${ARCHIVE_NAME}"
  zip -r "${ARCHIVE_NAME}" "${APP_NAME}-${VERSION}" >/dev/null
)

echo "✅ Pacote gerado: ${OUT_DIR}/${ARCHIVE_NAME}"
echo "📁 Pasta staging: ${STAGING_DIR}"
