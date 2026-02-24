# Deploy no servidor IONOS (guia prático)

Este guia é para subir a plataforma no seu servidor da **IONOS** com **Docker**, **PostgreSQL**, **Nginx** e **SSL**.

> Cenário recomendado: VPS Linux Ubuntu 22.04+ na IONOS.

---

## 1) Pré-requisitos

- VPS IONOS criada e acessível por SSH.
- Domínio apontando para o IP do servidor (ex.: `app.seudominio.com`).
- Git instalado localmente para enviar o código ao servidor.

---

## 2) Acesso ao servidor

No seu computador:

```bash
ssh root@SEU_IP_IONOS
```

Depois atualize pacotes:

```bash
apt update && apt upgrade -y
```

---

## 3) Instalar Docker + Compose

```bash
curl -fsSL https://get.docker.com | sh
usermod -aG docker $USER
newgrp docker
docker --version
docker compose version
```

---

## 4) Clonar o projeto

```bash
mkdir -p /opt/apps && cd /opt/apps
git clone <URL_DO_REPOSITORIO> beyond-avaliacao
cd beyond-avaliacao
```

---

## 5) Criar `.env` de produção

Crie o arquivo `.env` na raiz com valores reais:

```env
NODE_ENV=production
PORT=3000

DATABASE_URL=postgresql://postgres:postgres@db:5432/beyond_avaliacao

JWT_SECRET=troque-por-uma-chave-forte-com-64-caracteres
JWT_EXPIRES_IN=1d

GOOGLE_CLIENT_ID=seu_google_client_id
GOOGLE_CLIENT_SECRET=seu_google_client_secret
GOOGLE_REDIRECT_URI=https://app.seudominio.com/api/auth/google/callback
GOOGLE_DRIVE_ROOT_FOLDER=Beyond Avaliacao

APP_BASE_URL=https://app.seudominio.com
```

> Gere segredo seguro:

```bash
openssl rand -hex 32
```

---

## 6) Docker Compose (produção)

Crie `docker-compose.prod.yml`:

```yaml
services:
  db:
    image: postgres:16
    container_name: beyond_db
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: beyond_avaliacao
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  app:
    build: .
    container_name: beyond_app
    restart: always
    env_file:
      - .env
    depends_on:
      db:
        condition: service_healthy
    expose:
      - "3000"

  nginx:
    image: nginx:alpine
    container_name: beyond_nginx
    restart: always
    depends_on:
      - app
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./infra/nginx/nginx.conf:/etc/nginx/conf.d/default.conf:ro
      - ./infra/certbot/www:/var/www/certbot
      - ./infra/certbot/conf:/etc/letsencrypt

volumes:
  pgdata:
```

---

## 7) Nginx para domínio

Crie `infra/nginx/nginx.conf`:

```nginx
server {
  listen 80;
  server_name app.seudominio.com;

  location /.well-known/acme-challenge/ {
    root /var/www/certbot;
  }

  location / {
    proxy_pass http://app:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

---

## 8) Subir ambiente

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Verifique logs:

```bash
docker compose -f docker-compose.prod.yml logs -f app
```

---

## 9) Migrations Prisma

Depois que app e banco estiverem de pé:

```bash
docker compose -f docker-compose.prod.yml exec app npx prisma migrate deploy
```

Se houver seed:

```bash
docker compose -f docker-compose.prod.yml exec app npm run seed
```

---

## 10) Ativar SSL (Let's Encrypt)

Primeiro certificado:

```bash
docker run --rm \
  -v $(pwd)/infra/certbot/conf:/etc/letsencrypt \
  -v $(pwd)/infra/certbot/www:/var/www/certbot \
  certbot/certbot certonly --webroot \
  -w /var/www/certbot \
  -d app.seudominio.com \
  --email seu-email@dominio.com --agree-tos --no-eff-email
```

Depois ajuste o Nginx com bloco `listen 443 ssl` e caminhos dos certificados.

Recarregue:

```bash
docker compose -f docker-compose.prod.yml restart nginx
```

Renovação automática (crontab):

```bash
crontab -e
```

Adicione:

```cron
0 3 * * * docker run --rm -v /opt/apps/beyond-avaliacao/infra/certbot/conf:/etc/letsencrypt -v /opt/apps/beyond-avaliacao/infra/certbot/www:/var/www/certbot certbot/certbot renew && docker compose -f /opt/apps/beyond-avaliacao/docker-compose.prod.yml restart nginx
```

---

## 11) Checklist final

- [ ] Domínio resolve para IP da VPS.
- [ ] Containers `db`, `app`, `nginx` em execução.
- [ ] Migrations executadas.
- [ ] Login funcionando.
- [ ] Geração de PDF funcionando.
- [ ] OAuth Google com redirect de produção.
- [ ] HTTPS ativo com certificado válido.

---

## 12) Comandos úteis de operação

Subir:

```bash
docker compose -f docker-compose.prod.yml up -d
```

Parar:

```bash
docker compose -f docker-compose.prod.yml down
```

Atualizar versão:

```bash
git pull
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml exec app npx prisma migrate deploy
```

Logs:

```bash
docker compose -f docker-compose.prod.yml logs -f
```

---

## 13) Observações para IONOS

- Abra no firewall da VPS as portas **22**, **80** e **443**.
- Se usar Cloud DNS externo, confirme proxy/SSL para não quebrar desafio ACME.
- Em produção, troque senha padrão do Postgres e segredos JWT.
