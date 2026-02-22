# Beyond Avaliação — Documentação da API

## 📚 Visão Geral

A API do Beyond Avaliação utiliza **tRPC** para comunicação entre frontend e backend. Todos os endpoints estão sob `/api/trpc`.

---

## 🔐 Autenticação

### auth.register

Registrar novo usuário.

**Request:**
```typescript
POST /api/trpc/auth.register
{
  "email": "usuario@example.com",
  "password": "Senha123456",
  "name": "João Silva"
}
```

**Response:**
```typescript
{
  "id": 1,
  "email": "usuario@example.com",
  "name": "João Silva",
  "plan": "free",
  "createdAt": "2026-02-21T10:00:00Z"
}
```

**Erros:**
- `400` — Email já registrado
- `400` — Senha fraca (mínimo 8 caracteres)

---

### auth.login

Fazer login com email e senha.

**Request:**
```typescript
POST /api/trpc/auth.login
{
  "email": "usuario@example.com",
  "password": "Senha123456"
}
```

**Response:**
```typescript
{
  "id": 1,
  "email": "usuario@example.com",
  "name": "João Silva",
  "plan": "free"
}
```

**Erros:**
- `401` — Email ou senha incorretos
- `404` — Usuário não encontrado

---

### auth.me

Obter dados do usuário autenticado.

**Request:**
```typescript
GET /api/trpc/auth.me
```

**Response:**
```typescript
{
  "id": 1,
  "email": "usuario@example.com",
  "name": "João Silva",
  "plan": "free"
}
```

**Erros:**
- `401` — Não autenticado

---

### auth.logout

Fazer logout.

**Request:**
```typescript
POST /api/trpc/auth.logout
```

**Response:**
```typescript
{
  "success": true
}
```

---

## 📋 Fichas de Avaliação

### fichas.criar

Criar nova ficha de avaliação.

**Request:**
```typescript
POST /api/trpc/fichas.criar
{
  "paciente_nome": "Maria Silva",
  "data_avaliacao": "2026-02-21",
  "eva": 7,
  "diagnostico": "Tendinite de ombro",
  "hda": "Dor ao levantar o braço há 2 semanas...",
  "peso": 70,
  "altura": 170,
  "pa": "120/80",
  "fc": 72
}
```

**Response:**
```typescript
{
  "id": 42,
  "userId": 1,
  "pacienteNome": "Maria Silva",
  "dataAvaliacao": "2026-02-21",
  "eva": 7,
  "createdAt": "2026-02-21T10:00:00Z"
}
```

**Erros:**
- `401` — Não autenticado
- `403` — Limite de fichas atingido (plano Free)
- `400` — Dados inválidos

---

### fichas.listar

Listar todas as fichas do usuário.

**Request:**
```typescript
GET /api/trpc/fichas.listar
```

**Response:**
```typescript
[
  {
    "id": 42,
    "pacienteNome": "Maria Silva",
    "dataAvaliacao": "2026-02-21",
    "eva": 7,
    "diagnostico": "Tendinite de ombro",
    "createdAt": "2026-02-21T10:00:00Z"
  },
  // ... mais fichas
]
```

---

### fichas.obter

Obter detalhes de uma ficha específica.

**Request:**
```typescript
GET /api/trpc/fichas.obter?id=42
```

**Response:**
```typescript
{
  "id": 42,
  "userId": 1,
  "pacienteNome": "Maria Silva",
  "dataAvaliacao": "2026-02-21",
  "eva": 7,
  "diagnostico": "Tendinite de ombro",
  "hda": "Dor ao levantar o braço há 2 semanas...",
  "peso": 70,
  "altura": 170,
  "imc": 24.2,
  "pa": "120/80",
  "fc": 72,
  "createdAt": "2026-02-21T10:00:00Z"
}
```

---

### fichas.atualizar

Atualizar uma ficha existente.

**Request:**
```typescript
PUT /api/trpc/fichas.atualizar
{
  "id": 42,
  "eva": 5,
  "diagnostico": "Tendinite de ombro - Melhorando"
}
```

**Response:**
```typescript
{
  "id": 42,
  "eva": 5,
  "diagnostico": "Tendinite de ombro - Melhorando",
  "updatedAt": "2026-02-21T11:00:00Z"
}
```

---

### fichas.deletar

Deletar uma ficha.

**Request:**
```typescript
DELETE /api/trpc/fichas.deletar?id=42
```

**Response:**
```typescript
{
  "success": true,
  "message": "Ficha deletada com sucesso"
}
```

---

### fichas.gerarPDF

Gerar PDF de uma ficha.

**Request:**
```typescript
POST /api/trpc/fichas.gerarPDF
{
  "id": 42
}
```

**Response:**
```typescript
{
  "url": "https://storage.example.com/fichas/42.pdf",
  "filename": "Ficha_Maria_Silva_2026-02-21.pdf"
}
```

---

## 📊 Relatórios

### relatorios.evolucao

Obter dados de evolução do paciente.

**Request:**
```typescript
GET /api/trpc/relatorios.evolucao?fichaId=42&periodo=30
```

**Response:**
```typescript
{
  "paciente": "Maria Silva",
  "periodo": "30 dias",
  "evolucao": [
    {
      "data": "2026-01-21",
      "eva": 9,
      "forca": 2,
      "adm": 45
    },
    {
      "data": "2026-02-21",
      "eva": 5,
      "forca": 4,
      "adm": 75
    }
  ],
  "progresso": {
    "eva": "Redução de 44%",
    "forca": "Aumento de 100%",
    "adm": "Aumento de 67%"
  }
}
```

---

### relatorios.comparacao

Comparar duas fichas.

**Request:**
```typescript
GET /api/trpc/relatorios.comparacao?fichaId1=42&fichaId2=43
```

**Response:**
```typescript
{
  "ficha1": {
    "data": "2026-01-21",
    "eva": 9,
    "forca": 2,
    "adm": 45
  },
  "ficha2": {
    "data": "2026-02-21",
    "eva": 5,
    "forca": 4,
    "adm": 75
  },
  "diferenca": {
    "eva": -4,
    "forca": 2,
    "adm": 30
  }
}
```

---

## 💳 Pagamento (Stripe)

### stripe.criarCheckout

Criar sessão de checkout para upgrade.

**Request:**
```typescript
POST /api/trpc/stripe.criarCheckout
{
  "plan": "premium",
  "interval": "month" // ou "year"
}
```

**Response:**
```typescript
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/pay/cs_test_..."
}
```

---

### stripe.obterStatus

Obter status da assinatura.

**Request:**
```typescript
GET /api/trpc/stripe.obterStatus
```

**Response:**
```typescript
{
  "plan": "premium",
  "status": "active",
  "subscriptionId": "sub_...",
  "currentPeriodEnd": "2026-03-21T10:00:00Z",
  "cancelAtPeriodEnd": false
}
```

---

### stripe.cancelarAssinatura

Cancelar assinatura Premium.

**Request:**
```typescript
POST /api/trpc/stripe.cancelarAssinatura
```

**Response:**
```typescript
{
  "success": true,
  "message": "Assinatura cancelada. Acesso permanece até 2026-03-21"
}
```

---

## 🔗 Google Drive

### googleDrive.autorizar

Autorizar acesso ao Google Drive.

**Request:**
```typescript
POST /api/trpc/googleDrive.autorizar
{
  "code": "4/0AY0e-g..."
}
```

**Response:**
```typescript
{
  "success": true,
  "message": "Google Drive autorizado com sucesso"
}
```

---

### googleDrive.salvarFicha

Salvar ficha no Google Drive (Premium).

**Request:**
```typescript
POST /api/trpc/googleDrive.salvarFicha
{
  "fichaId": 42
}
```

**Response:**
```typescript
{
  "fileId": "1a2b3c4d...",
  "fileName": "Ficha_Maria_Silva_2026-02-21.pdf",
  "url": "https://drive.google.com/file/d/1a2b3c4d/view"
}
```

---

### googleDrive.listarFichas

Listar fichas salvas no Google Drive.

**Request:**
```typescript
GET /api/trpc/googleDrive.listarFichas
```

**Response:**
```typescript
[
  {
    "fileId": "1a2b3c4d...",
    "fileName": "Ficha_Maria_Silva_2026-02-21.pdf",
    "createdTime": "2026-02-21T10:00:00Z",
    "url": "https://drive.google.com/file/d/1a2b3c4d/view"
  }
]
```

---

## 📈 Planos

### planos.obter

Obter informações do plano atual.

**Request:**
```typescript
GET /api/trpc/planos.obter
```

**Response:**
```typescript
{
  "plan": "free",
  "fichasUsadas": 2,
  "fichasLimite": 3,
  "fichasRestantes": 1,
  "renovacaoEm": "2026-03-21"
}
```

---

### planos.atualizar

Fazer upgrade para Premium.

**Request:**
```typescript
POST /api/trpc/planos.atualizar
{
  "plan": "premium"
}
```

**Response:**
```typescript
{
  "plan": "premium",
  "message": "Upgrade realizado com sucesso",
  "checkoutUrl": "https://checkout.stripe.com/pay/cs_test_..."
}
```

---

## 🔄 Webhooks

### POST /api/stripe/webhook

Webhook para eventos do Stripe.

**Eventos Suportados:**
- `checkout.session.completed` — Pagamento realizado
- `invoice.paid` — Fatura paga
- `customer.subscription.deleted` — Assinatura cancelada

**Exemplo:**
```typescript
{
  "id": "evt_...",
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_test_...",
      "customer_email": "usuario@example.com",
      "metadata": {
        "user_id": "1",
        "plan": "premium"
      }
    }
  }
}
```

---

## 📝 Códigos de Erro

| Código | Mensagem | Solução |
|--------|----------|---------|
| 400 | Bad Request | Verifique os dados enviados |
| 401 | Unauthorized | Faça login novamente |
| 403 | Forbidden | Você não tem permissão |
| 404 | Not Found | Recurso não encontrado |
| 429 | Too Many Requests | Aguarde antes de tentar novamente |
| 500 | Server Error | Erro no servidor, tente mais tarde |

---

## 🔑 Autenticação via Header

Todas as requisições autenticadas devem incluir:

```
Authorization: Bearer <jwt-token>
```

O token é obtido após login e armazenado em cookie seguro.

---

## 📚 Exemplos de Uso

### JavaScript/TypeScript

```typescript
import { trpc } from '@/lib/trpc';

// Registrar
const user = await trpc.auth.register.mutate({
  email: 'usuario@example.com',
  password: 'Senha123456',
  name: 'João Silva'
});

// Criar ficha
const ficha = await trpc.fichas.criar.mutate({
  pacienteNome: 'Maria Silva',
  dataAvaliacao: '2026-02-21',
  eva: 7
});

// Listar fichas
const fichas = await trpc.fichas.listar.useQuery();
```

### cURL

```bash
# Registrar
curl -X POST http://localhost:3000/api/trpc/auth.register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "Senha123456",
    "name": "João Silva"
  }'

# Criar ficha
curl -X POST http://localhost:3000/api/trpc/fichas.criar \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "pacienteNome": "Maria Silva",
    "dataAvaliacao": "2026-02-21",
    "eva": 7
  }'
```

---

## 📞 Suporte

Para dúvidas sobre a API:
- Consulte a documentação tRPC: https://trpc.io
- Abra uma issue no repositório
- Entre em contato: api@beyondavaliacao.com.br
