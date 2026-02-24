$ErrorActionPreference = "Stop"

$RootDir = (Resolve-Path "$PSScriptRoot\..").Path
$SrcDir = $RootDir
$ZipSource = Join-Path $RootDir "beyond-avaliacao-source (1).zip"

Set-Location $RootDir

if (-not (Test-Path (Join-Path $SrcDir "package.json"))) {
  if (Test-Path $ZipSource) {
    Write-Host "📦 package.json não encontrado na raiz. Extraindo source zip..."
    $Runtime = Join-Path $RootDir ".runtime-src"
    if (Test-Path $Runtime) { Remove-Item $Runtime -Recurse -Force }
    New-Item -ItemType Directory -Path $Runtime -Force | Out-Null
    Expand-Archive -Path $ZipSource -DestinationPath $Runtime -Force

    $Candidate = Join-Path $Runtime "beyond-avaliacao"
    if (Test-Path (Join-Path $Candidate "package.json")) {
      $SrcDir = $Candidate
    } else {
      throw "Não foi possível localizar package.json após extrair o zip."
    }
  } else {
    throw "package.json não encontrado e zip de source ausente."
  }
}

Set-Location $SrcDir
Write-Host "📁 Diretório de execução: $SrcDir"

if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
  Write-Host "🔧 pnpm não encontrado. Tentando habilitar via corepack..."
  if (Get-Command corepack -ErrorAction SilentlyContinue) {
    corepack enable
    corepack prepare pnpm@latest --activate
  } else {
    throw "corepack não disponível. Instale Node.js 18+ (com corepack) ou pnpm manualmente."
  }
}

Write-Host "📦 Instalando dependências..."
try {
  pnpm install --frozen-lockfile
} catch {
  pnpm install
}

Write-Host "🚀 Subindo aplicação em http://localhost:5173"
pnpm dev --host 0.0.0.0 --port 5173
