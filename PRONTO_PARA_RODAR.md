# Pronto para rodar (1 comando)

Este é o fluxo mais direto para subir o projeto sem montar nada manualmente.

## Windows

1. Abra a pasta do projeto.
2. Execute:

```bat
scripts\pronto_para_rodar.bat
```

## Linux/macOS

```bash
chmod +x scripts/pronto_para_rodar.sh
./scripts/pronto_para_rodar.sh
```

## O que o script faz automaticamente

- Detecta se existe `package.json` na raiz.
- Se não existir, extrai `beyond-avaliacao-source (1).zip` em `.runtime-src/` e usa esse código.
- Configura `pnpm` via `corepack` (se necessário).
- Instala dependências.
- Sobe app em `http://localhost:5173`.

## Requisitos

- Node.js 18+
- internet para baixar dependências

## Se der erro

- Veja `TROUBLESHOOTING.md`
- Ou rode novamente após atualizar Node.js

