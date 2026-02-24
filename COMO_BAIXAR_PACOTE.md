# Como baixar o pacote pronto

Se você quer **baixar agora** o pacote do projeto, use este fluxo.

## 1) Gerar pacote

### Windows
```bat
scripts\baixar_pacote.bat
```

### Linux/macOS
```bash
./scripts/create_release_bundle.sh
```

Isso gera:
- `dist-release/beyond-avaliacao-<versao>.zip`

---

## 2) Baixar do servidor para seu PC

Se o projeto está em servidor (ex.: IONOS), rode no seu computador:

```bash
scp usuario@IP_DO_SERVIDOR:/caminho/do/projeto/dist-release/beyond-avaliacao-<versao>.zip .
```

Exemplo:
```bash
scp root@111.222.33.44:/opt/apps/beyond-avaliacao/dist-release/beyond-avaliacao-20260224-1200.zip .
```

---

## 3) Abrir no WinRAR

- Clique com botão direito no arquivo `.zip`
- Abra com WinRAR
- (Opcional) converta para `.rar` em **Add to archive...**

