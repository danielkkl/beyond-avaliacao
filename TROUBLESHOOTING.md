# 🔧 Troubleshooting - Beyond Avaliação

## 🆘 Problemas Comuns e Soluções

---

## 1. Build Falha no Netlify

### ❌ Erro: "Build failed"

**Causa comum:** Dependências faltando ou incompatíveis

**Solução:**

```bash
# 1. Verifique o log de build no Netlify
# Netlify → Deploys → [seu deploy] → Deploy log

# 2. Verifique se todas as dependências estão em package.json
pnpm install

# 3. Verifique se não há erros de TypeScript
pnpm build

# 4. Verifique se NODE_ENV está correto
# Deve ser "production" no Netlify

# 5. Limpe cache e tente novamente
# Netlify → Deploys → Trigger deploy → Clear cache and redeploy
```

### ❌ Erro: "Command timed out"

**Causa comum:** Build muito lento

**Solução:**

```bash
# 1. Otimize o build
# Remova dependências desnecessárias

# 2. Aumente timeout no netlify.toml
[build]
  command_timeout = 600  # 10 minutos

# 3. Verifique se há muitos arquivos
# Remova node_modules do Git
echo "node_modules/" >> .gitignore

# 4. Use cache do Netlify
# Netlify → Site settings → Build & deploy → Cache
```

---

## 2. Erro de Banco de Dados

### ❌ Erro: "Connection refused"

**Causa comum:** DATABASE_URL incorreta ou banco offline

**Solução:**

```bash
# 1. Verifique DATABASE_URL
# Deve estar em: Netlify → Site settings → Build & deploy → Environment

# 2. Teste a conexão localmente
mysql -h HOST -u USER -p PASSWORD -D DATABASE -e "SELECT 1;"

# 3. Verifique firewall/security groups
# Se usar Railway, verifique IP whitelist

# 4. Verifique se banco está online
# Railway → Database → Status

# 5. Recrie a conexão
# Railway → Database → Connect → Copy URL
```

### ❌ Erro: "Table doesn't exist"

**Causa comum:** Schema não importado

**Solução:**

```bash
# 1. Importe o schema
mysql -h HOST -u USER -p PASSWORD -D DATABASE < database_schema.sql

# 2. Verifique se tabelas foram criadas
mysql -h HOST -u USER -p PASSWORD -D DATABASE -e "SHOW TABLES;"

# 3. Se não aparecer, importe manualmente
# Copie conteúdo de database_schema.sql
# Cole no MySQL client

# 4. Verifique permissões do usuário
# Usuário deve ter CREATE, INSERT, SELECT, UPDATE, DELETE
```

### ❌ Erro: "Too many connections"

**Causa comum:** Connection pool esgotado

**Solução:**

```bash
# 1. Aumente max_connections no banco
# Railway → Database → Settings → max_connections = 100

# 2. Use connection pooling
# Já está configurado no Drizzle ORM

# 3. Verifique se há conexões abertas
mysql -h HOST -u USER -p PASSWORD -e "SHOW PROCESSLIST;"

# 4. Mate conexões antigas
# KILL CONNECTION_ID;
```

---

## 3. Erro de Stripe

### ❌ Erro: "Invalid API Key"

**Causa comum:** STRIPE_SECRET_KEY incorreta

**Solução:**

```bash
# 1. Verifique a chave
# Deve começar com sk_test_ (teste) ou sk_live_ (produção)

# 2. Copie novamente do Stripe
# https://dashboard.stripe.com/apikeys

# 3. Atualize em Netlify
# Site settings → Build & deploy → Environment → Edit variables

# 4. Redeploy
# Netlify → Deploys → Trigger deploy
```

### ❌ Erro: "Webhook signature verification failed"

**Causa comum:** STRIPE_WEBHOOK_SECRET incorreto

**Solução:**

```bash
# 1. Verifique o webhook
# https://dashboard.stripe.com/webhooks

# 2. Copie o Signing secret correto
# Deve começar com whsec_

# 3. Atualize em Netlify
# STRIPE_WEBHOOK_SECRET

# 4. Teste o webhook
# Stripe Dashboard → Webhooks → [seu webhook] → Send test webhook
```

### ❌ Erro: "Payment intent failed"

**Causa comum:** Cartão de teste inválido

**Solução:**

```bash
# 1. Use cartão de teste correto
# 4242 4242 4242 4242
# Expiração: qualquer data futura
# CVC: qualquer 3 dígitos

# 2. Verifique se está em modo teste
# Stripe Dashboard deve mostrar "Test mode"

# 3. Verifique logs do Stripe
# https://dashboard.stripe.com/logs
```

---

## 4. Erro de Google Drive

### ❌ Erro: "Invalid Client ID"

**Causa comum:** GOOGLE_CLIENT_ID incorreto

**Solução:**

```bash
# 1. Verifique o Client ID
# https://console.cloud.google.com → Credentials

# 2. Copie o correto (OAuth 2.0 Client ID)

# 3. Atualize em Netlify
# GOOGLE_CLIENT_ID

# 4. Verifique redirect URI
# Deve ser: https://seu-site.netlify.app/api/google/callback
```

### ❌ Erro: "Redirect URI mismatch"

**Causa comum:** Redirect URI não configurado

**Solução:**

```bash
# 1. Vá para Google Cloud Console
# https://console.cloud.google.com

# 2. Vá para Credentials → OAuth 2.0 Client ID

# 3. Adicione Authorized redirect URIs:
# https://seu-site.netlify.app/api/google/callback
# http://localhost:3000/api/google/callback (para desenvolvimento)

# 4. Salve e teste novamente
```

### ❌ Erro: "Permission denied"

**Causa comum:** Google Drive API não ativada

**Solução:**

```bash
# 1. Vá para Google Cloud Console
# https://console.cloud.google.com

# 2. Procure por "Google Drive API"

# 3. Clique em "Enable"

# 4. Aguarde alguns minutos para ativar

# 5. Teste novamente
```

---

## 5. Erro de Autenticação

### ❌ Erro: "Invalid JWT"

**Causa comum:** JWT_SECRET incorreto ou expirado

**Solução:**

```bash
# 1. Verifique JWT_SECRET em Netlify
# Deve ser igual ao local

# 2. Se mudou, regenere em todos os lugares
openssl rand -base64 32

# 3. Atualize em Netlify
# NETLIFY_ENV → JWT_SECRET

# 4. Limpe cookies do navegador
# DevTools → Application → Cookies → Delete all

# 5. Faça login novamente
```

### ❌ Erro: "Unauthorized"

**Causa comum:** Token expirado ou inválido

**Solução:**

```bash
# 1. Faça logout
# Clique em "Sair"

# 2. Limpe cookies
# DevTools → Application → Cookies → Delete all

# 3. Faça login novamente

# 4. Se persistir, verifique JWT_SECRET
```

### ❌ Erro: "User not found"

**Causa comum:** Usuário deletado ou banco resetado

**Solução:**

```bash
# 1. Crie novo usuário
# Clique em "Registrar"

# 2. Use email diferente

# 3. Se quiser recuperar dados antigos:
# Restaure backup do banco de dados
```

---

## 6. Erro de Performance

### ❌ Erro: "Site muito lento"

**Causa comum:** Muitas requisições ou cálculos pesados

**Solução:**

```bash
# 1. Verifique Network tab
# DevTools → Network → Veja requisições lentas

# 2. Otimize imagens
# Use WebP em vez de PNG/JPG

# 3. Ative compressão
# Já ativada no Netlify

# 4. Use CDN para assets
# Já configurado no Netlify

# 5. Verifique banco de dados
# Adicione índices nas tabelas
# Verifique queries lentas
```

### ❌ Erro: "Memory limit exceeded"

**Causa comum:** Função usando muita memória

**Solução:**

```bash
# 1. Verifique Netlify Functions
# Aumentar memória em netlify.toml

[functions]
  memory = 1024  # MB

# 2. Otimize código
# Evite carregar tudo em memória

# 3. Use streaming para arquivos grandes

# 4. Divida em múltiplas funções
```

---

## 7. Erro de CORS

### ❌ Erro: "CORS policy: No 'Access-Control-Allow-Origin'"

**Causa comum:** CORS não configurado

**Solução:**

```bash
# 1. Verifique netlify.toml
# Deve ter headers de CORS

[[headers]]
  for = "/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"

# 2. Verifique se está no arquivo correto

# 3. Redeploy
# Netlify → Deploys → Trigger deploy

# 4. Limpe cache do navegador
# Ctrl+Shift+Delete
```

---

## 8. Erro de SSL/HTTPS

### ❌ Erro: "SSL certificate not found"

**Causa comum:** Certificado não gerado

**Solução:**

```bash
# 1. Espere alguns minutos
# Netlify gera certificado automaticamente

# 2. Se persistir, force renovação
# Netlify → Site settings → Domain management → HTTPS

# 3. Verifique DNS
# Deve estar apontando para Netlify

# 4. Se usar domínio customizado:
# Verifique CNAME records
```

---

## 9. Erro de Variáveis de Ambiente

### ❌ Erro: "Undefined variable"

**Causa comum:** Variável não definida em Netlify

**Solução:**

```bash
# 1. Verifique em Netlify
# Site settings → Build & deploy → Environment

# 2. Adicione variável faltante

# 3. Redeploy
# Netlify → Deploys → Trigger deploy

# 4. Verifique se está em .env.example
# Documentação para outros desenvolvedores
```

### ❌ Erro: "Variable is null"

**Causa comum:** Variável vazia ou não carregada

**Solução:**

```bash
# 1. Verifique se variável tem valor
# Não pode estar vazia

# 2. Verifique se está sendo lida corretamente
# process.env.VARIABLE_NAME

# 3. Verifique se não há espaços extras
# "sk_test_123 " (com espaço) ≠ "sk_test_123"

# 4. Redeploy
```

---

## 10. Erro de Logs

### ❌ Erro: "Logs não aparecem"

**Causa comum:** Logs não configurados

**Solução:**

```bash
# 1. Verifique Netlify Functions
# Site settings → Functions → Logs

# 2. Verifique console.log
# Deve aparecer em Logs

# 3. Se não aparecer:
# Netlify → Deploys → [seu deploy] → Deploy log

# 4. Verifique se está em produção
# NODE_ENV = production
```

---

## 🆘 Ainda com Problemas?

### Recursos de Ajuda

1. **Documentação Oficial**
   - Netlify: https://docs.netlify.com
   - Stripe: https://stripe.com/docs
   - Google Drive: https://developers.google.com/drive

2. **Comunidades**
   - Netlify Community: https://community.netlify.com
   - Stripe Community: https://stripe.com/community
   - Stack Overflow: https://stackoverflow.com

3. **Suporte**
   - Netlify Support: https://support.netlify.com
   - Stripe Support: https://support.stripe.com
   - Google Cloud Support: https://cloud.google.com/support

4. **Logs e Debugging**
   - Netlify Logs: https://app.netlify.com → Deploys → Deploy log
   - Stripe Logs: https://dashboard.stripe.com/logs
   - Browser Console: DevTools → Console

---

## 📝 Dicas Gerais

1. **Sempre cheque logs primeiro**
   - Netlify Logs
   - Browser Console
   - Network tab

2. **Teste localmente antes de fazer deploy**
   - `pnpm dev`
   - Crie usuário de teste
   - Teste pagamento com cartão 4242...

3. **Mantenha documentação atualizada**
   - .env.example
   - README.md
   - DEPLOY_NETLIFY.md

4. **Faça backups regularmente**
   - Banco de dados
   - Código
   - Configurações

5. **Monitore em produção**
   - Erros
   - Performance
   - Uso de recursos

---

**Última atualização: Fevereiro 2026**
