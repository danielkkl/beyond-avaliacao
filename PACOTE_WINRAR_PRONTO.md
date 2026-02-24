# Pacote pronto para rodar no WinRAR (entrega automática)

Este documento te entrega o processo **pronto** para gerar um arquivo final de distribuição e abrir/compactar no WinRAR.

## Objetivo
Gerar um pacote único (`.zip`) com os principais arquivos do projeto para envio, backup e deploy.

## 1) No Windows (mais fácil)

Dentro da pasta do projeto, execute:

```bat
scripts\create_release_bundle.bat
```

Ou com versão customizada:

```bat
scripts\create_release_bundle.bat 2026.01
```

Saída esperada:

- Pasta staging: `dist-release\beyond-avaliacao-<versao>`
- Arquivo final: `dist-release\beyond-avaliacao-<versao>.zip`

> Esse `.zip` abre normalmente no WinRAR e também pode ser recompactado como `.rar` pelo próprio WinRAR.

## 2) No Linux/macOS

```bash
./scripts/create_release_bundle.sh
```

Ou:

```bash
./scripts/create_release_bundle.sh 2026.01
```

## 3) Converter para RAR (opcional, no WinRAR)

1. Clique direito no `.zip`
2. **Add to archive...**
3. Formato: **RAR**
4. OK

## 4) Conteúdo que entra no pacote

- Código do front em `client/`
- Documentação técnica (`README`, `TPS`, `API`, deploy IONOS)
- Scripts de setup e troubleshooting
- Scripts de empacotamento para Windows/Linux

## 5) Validação rápida pós-geração

- Confirme que o arquivo existe em `dist-release/`
- Abra o arquivo no WinRAR
- Verifique se as pastas e arquivos listados estão presentes

