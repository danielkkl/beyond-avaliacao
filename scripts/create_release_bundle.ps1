param(
  [string]$Version = (Get-Date -Format "yyyyMMdd-HHmm")
)

$ErrorActionPreference = "Stop"
$AppName = "beyond-avaliacao"
$OutDir = "dist-release"
$StagingDir = Join-Path $OutDir "$AppName-$Version"
$ZipFile = Join-Path $OutDir "$AppName-$Version.zip"

if (Test-Path $StagingDir) { Remove-Item $StagingDir -Recurse -Force }
New-Item -ItemType Directory -Path $StagingDir -Force | Out-Null

function Copy-IfExists {
  param(
    [string]$Source,
    [string]$Destination
  )

  if (Test-Path $Source) {
    $destDir = Split-Path -Parent $Destination
    if (-not (Test-Path $destDir)) {
      New-Item -ItemType Directory -Path $destDir -Force | Out-Null
    }
    Copy-Item $Source -Destination $Destination -Recurse -Force
  }
}

Copy-IfExists "client" "$StagingDir/client"
Copy-IfExists "README.md" "$StagingDir/README.md"
Copy-IfExists "DEPLOY_IONOS.md" "$StagingDir/DEPLOY_IONOS.md"
Copy-IfExists "TPS_SaaS_Avaliacao_Fisioterapeutica.md" "$StagingDir/TPS_SaaS_Avaliacao_Fisioterapeutica.md"
Copy-IfExists "API.md" "$StagingDir/API.md"
Copy-IfExists "LICENSE" "$StagingDir/LICENSE"
Copy-IfExists "todo.md" "$StagingDir/todo.md"
Copy-IfExists "TROUBLESHOOTING.md" "$StagingDir/TROUBLESHOOTING.md"
Copy-IfExists "SETUP_DATABASE_VERCEL.md" "$StagingDir/SETUP_DATABASE_VERCEL.md"
Copy-IfExists "SETUP_NETLIFY.sh" "$StagingDir/SETUP_NETLIFY.sh"
Copy-IfExists "vite.config.ts" "$StagingDir/vite.config.ts"
Copy-IfExists "tsconfig.json" "$StagingDir/tsconfig.json"
Copy-IfExists "tsconfig.node.json" "$StagingDir/tsconfig.node.json"
Copy-IfExists "vitest.config.ts" "$StagingDir/vitest.config.ts"
Copy-IfExists "scripts/create_release_bundle.sh" "$StagingDir/scripts/create_release_bundle.sh"
Copy-IfExists "scripts/create_release_bundle.bat" "$StagingDir/scripts/create_release_bundle.bat"
Copy-IfExists "PACOTE_WINRAR_PRONTO.md" "$StagingDir/PACOTE_WINRAR_PRONTO.md"

if (-not (Test-Path $OutDir)) { New-Item -ItemType Directory -Path $OutDir -Force | Out-Null }
if (Test-Path $ZipFile) { Remove-Item $ZipFile -Force }
Compress-Archive -Path "$StagingDir\*" -DestinationPath $ZipFile -Force

Write-Host "✅ Pacote gerado: $ZipFile"
Write-Host "📁 Pasta staging: $StagingDir"
