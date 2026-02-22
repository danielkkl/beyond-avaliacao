# 🗄️ Guia: Configurar Banco de Dados na Vercel

## Resumo Executivo

Este guia mostra como criar e configurar um banco de dados MySQL para o Beyond Avaliação usando a Vercel com Railway ou Planetscale.

---

## 🎯 Opção 1: Railway (RECOMENDADO)

Railway é a forma mais fácil de ter MySQL na Vercel.

### Passo 1: Criar Conta Railway

1. Acesse https://railway.app
2. Clique em "Sign up"
3. Faça login com GitHub
4. Autorize Railway

### Passo 2: Criar Novo Projeto

1. Clique em "New Project"
2. Selecione "Provision New"
3. Escolha "MySQL"
4. Aguarde a criação (2-3 minutos)

### Passo 3: Copiar Connection String

1. Vá para a aba "MySQL"
2. Clique em "Connect"
3. Copie a URL em "Database URL"
4. Formato: `mysql://user:password@host:port/database`

### Passo 4: Importar Schema

#### Opção A: Via Interface Railway

1. Clique em "MySQL"
2. Vá para "Data"
3. Clique em "Query"
4. Cole o conteúdo do arquivo `database_schema.sql`
5. Clique em "Execute"

#### Opção B: Via Terminal Local

```bash
# 1. Instale mysql-client
# Mac:
brew install mysql-client

# Ubuntu/Debian:
sudo apt-get install mysql-client

# Windows: Baixe em https://dev.mysql.com/downloads/mysql/

# 2. Conecte ao banco
mysql -h HOST -u USER -p PASSWORD -D DATABASE < database_schema.sql

# Substitua:
# HOST = seu host do Railway
# USER = seu usuário
# PASSWORD = sua senha
# DATABASE = nome do banco
```

### Passo 5: Configurar Variável de Ambiente na Vercel

1. Acesse https://vercel.com
2. Vá para seu projeto Beyond Avaliação
3. Clique em "Settings"
4. Vá para "Environment Variables"
5. Adicione:
   - **Key:** `DATABASE_URL`
   - **Value:** Cole a URL do Railway
6. Clique em "Save"

### Passo 6: Fazer Deploy

```bash
# No seu computador
git push origin main

# Vercel fará deploy automático
```

---

## 🎯 Opção 2: PlanetScale (Alternativa)

PlanetScale é um MySQL serverless muito rápido.

### Passo 1: Criar Conta PlanetScale

1. Acesse https://planetscale.com
2. Clique em "Sign up"
3. Faça login com GitHub
4. Autorize PlanetScale

### Passo 2: Criar Novo Database

1. Clique em "Create a database"
2. Nome: `beyond-avaliacao`
3. Região: São Paulo (sa-east-1)
4. Clique em "Create database"

### Passo 3: Copiar Connection String

1. Clique em "Connect"
2. Selecione "Node.js"
3. Copie a URL de conexão

### Passo 4: Importar Schema

```bash
# Via terminal
mysql -h HOST -u USER -p PASSWORD -D DATABASE < database_schema.sql
```

### Passo 5: Configurar Variável de Ambiente

1. Acesse https://vercel.com
2. Vá para seu projeto
3. Settings → Environment Variables
4. Adicione `DATABASE_URL` com a URL do PlanetScale

---

## 🎯 Opção 3: AWS RDS (Mais Profissional)

AWS RDS é ideal para produção em larga escala.

### Passo 1: Criar Instância RDS

1. Acesse https://console.aws.amazon.com/rds
2. Clique em "Create database"
3. Escolha "MySQL"
4. Versão: MySQL 8.0
5. Template: "Free tier"
6. DB instance identifier: `beyond-avaliacao`
7. Master username: `admin`
8. Master password: (gere uma senha forte)
9. Clique em "Create database"

### Passo 2: Configurar Security Group

1. Vá para "Security Groups"
2. Selecione o grupo do RDS
3. Adicione inbound rule:
   - Type: MySQL/Aurora
   - Port: 3306
   - Source: 0.0.0.0/0 (ou seu IP)

### Passo 3: Copiar Endpoint

1. Vá para "Databases"
2. Clique na sua instância
3. Copie o "Endpoint"
4. Formato: `mysql://admin:password@endpoint:3306/beyond_avaliacao`

### Passo 4: Importar Schema

```bash
mysql -h ENDPOINT -u admin -p < database_schema.sql
```

### Passo 5: Configurar Variável de Ambiente

1. Vercel → Settings → Environment Variables
2. Adicione `DATABASE_URL` com a URL do RDS

---

## 📋 Estrutura do Banco de Dados

O script cria as seguintes tabelas:

### 1. **users** - Usuários do sistema
```sql
id, email, password_hash, name, cpf, crefito, phone, avatar_url, plan_id, created_at, updated_at, last_login, is_active
```

### 2. **plans** - Planos de assinatura
```sql
id, name, description, price, currency, max_fichas_per_month, has_google_drive, has_reports, has_export, stripe_price_id
```

### 3. **subscriptions** - Assinaturas ativas
```sql
id, user_id, plan_id, stripe_subscription_id, stripe_customer_id, status, current_period_start, current_period_end, cancel_at_period_end, canceled_at
```

### 4. **patients** - Pacientes
```sql
id, user_id, name, cpf, email, phone, date_of_birth, gender, marital_status, ethnicity, profession, address, city, state, zip_code, health_plan, referring_doctor, clinical_diagnosis, notes
```

### 5. **fichas** - Fichas de avaliação
```sql
id, user_id, patient_id, assessment_date, consultation_date, record_number, 
[todos os campos das 12 seções], 
status, pdf_url, google_drive_file_id, is_synced_to_drive, created_at, updated_at
```

### 6. **google_drive_tokens** - Tokens do Google Drive
```sql
id, user_id, access_token, refresh_token, token_expiry, folder_id, is_connected, created_at, updated_at
```

### 7. **ficha_history** - Histórico de alterações
```sql
id, ficha_id, user_id, action, changes_data, created_at
```

### 8. **payments** - Histórico de pagamentos
```sql
id, user_id, subscription_id, stripe_payment_intent_id, amount, currency, status, payment_method, description, created_at, updated_at
```

### 9. **logs** - Logs de auditoria
```sql
id, user_id, action, resource_type, resource_id, details, ip_address, user_agent, created_at
```

---

## 🔧 Variáveis de Ambiente Necessárias

Após configurar o banco, adicione estas variáveis na Vercel:

```env
# Banco de Dados
DATABASE_URL=mysql://user:password@host:3306/beyond_avaliacao

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Google Drive
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# JWT
JWT_SECRET=sua_chave_secreta_aqui

# Node
NODE_ENV=production
PORT=3000
```

---

## ✅ Verificar Banco de Dados

Após importar o schema, verifique se tudo foi criado:

```bash
# Conectar ao banco
mysql -h HOST -u USER -p PASSWORD -D DATABASE

# Listar tabelas
SHOW TABLES;

# Verificar estrutura
DESCRIBE users;
DESCRIBE fichas;
DESCRIBE subscriptions;

# Contar registros
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM plans;
```

---

## 🚀 Próximos Passos

1. ✅ Criar banco de dados (Railway/PlanetScale/AWS)
2. ✅ Importar schema SQL
3. ✅ Configurar variáveis de ambiente na Vercel
4. ✅ Fazer deploy da aplicação
5. ✅ Testar conexão
6. ✅ Lançar para público

---

## 🆘 Troubleshooting

### Erro: "Connection refused"
- Verifique se o banco está online
- Verifique se a URL está correta
- Verifique se o firewall permite conexão

### Erro: "Access denied"
- Verifique usuário e senha
- Verifique permissões do usuário
- Regenere a senha se necessário

### Erro: "Database not found"
- Verifique se o banco foi criado
- Verifique o nome do banco na URL

### Erro: "Table doesn't exist"
- Verifique se o schema foi importado
- Execute o script SQL novamente

---

## 📞 Suporte

Se tiver dúvidas:
- Railway: https://docs.railway.app
- PlanetScale: https://docs.planetscale.com
- AWS RDS: https://docs.aws.amazon.com/rds
- Vercel: https://vercel.com/docs

---

## 📝 Checklist Final

- [ ] Banco de dados criado
- [ ] Schema importado
- [ ] Variáveis de ambiente configuradas
- [ ] Conexão testada
- [ ] Deploy realizado
- [ ] Aplicação funcionando
- [ ] Dados de teste criados
- [ ] Backups configurados

---

**Última atualização: Fevereiro 2026**
