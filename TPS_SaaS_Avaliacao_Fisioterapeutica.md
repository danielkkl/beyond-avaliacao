# Technical Product Specification (TPS)
## Sistema SaaS de Avaliação Fisioterapêutica Inteligente

- **Versão:** Enterprise 2026
- **Status:** Aprovado para implementação
- **Objetivo deste documento:** Especificação definitiva de produto e arquitetura para execução por time técnico (humano/IA), sem ambiguidades.

---

## 1. Visão Geral

Construir uma plataforma **SaaS web** para avaliação fisioterapêutica com foco em:

- Padronização clínica orientada por protocolo
- Apoio à decisão clínica por motor de regras
- Geração automática de documentação institucional (PDF)
- Histórico longitudinal do paciente
- Segurança e aderência à LGPD
- Base arquitetural para evolução SaaS (multi-tenant no futuro)

> **Fora de escopo nesta versão:** sistema de pagamento, billing, split, antifraude financeiro.

---

## 2. Objetivos do Sistema

### 2.1 Objetivos de negócio
- Reduzir variabilidade entre avaliações.
- Aumentar produtividade do fisioterapeuta com automação de cálculos e interpretação.
- Profissionalizar entrega documental (PDF institucional com rastreabilidade).
- Criar estrutura de dados clínica reutilizável para IA futura.

### 2.2 Objetivos técnicos
- Arquitetura modular e escalável.
- Separação rigorosa de camadas (UI, domínio, aplicação, infraestrutura).
- Persistência híbrida (colunas estruturadas + JSONB para módulos dinâmicos).
- APIs seguras e observáveis.

---

## 3. Requisitos Funcionais (RF)

### RF-01 — Autenticação e Sessão
- Login por e-mail e senha.
- JWT com expiração e refresh token (ou rotação curta com reautenticação).
- Hash de senha com bcrypt.

### RF-02 — Cadastro de pacientes
- CRUD completo de pacientes por usuário autenticado.
- Relação 1 usuário → N pacientes.

### RF-03 — Ficha de avaliação
- Criar, editar, listar e visualizar avaliações.
- Persistência de módulos clínicos em JSONB.
- Vínculo obrigatório com paciente e profissional.

### RF-04 — Cálculos automáticos
- Idade automática.
- IMC e classificação automática.
- FC máx = `208 - (0,7 x idade)`.
- Zona de treino 60–80% da FC máx.
- FR máx automática (por protocolo/regra definida).
- Déficit percentual de ADM.
- Classificação CIF automática:
  - `XXX.0`: 0–4%
  - `XXX.1`: 5–24%
  - `XXX.2`: 25–49%
  - `XXX.3`: 50–95%
  - `XXX.4`: 96–100%

### RF-05 — Protocolos clínicos 2026
- Módulo dedicado “Protocolos Clínicos”.
- Cada protocolo deve conter:
  - nome
  - área (Ortopedia / Neuro / Cardiorrespiratória)
  - critérios de inclusão
  - critérios de exclusão
  - escalas obrigatórias
  - testes recomendados
  - red flags
  - metas por fase

### RF-06 — Protocolo LCA pós-operatório
- Inclusão: pós reconstrução ligamentar.
- Exigências automáticas: ADM joelho, perimetria, testes ligamentares.
- Red flags mínimas:
  - déficit > 50%
  - EVA ≥ 8
- Ao detectar red flag, gerar alerta clínico explícito.

### RF-07 — Motor de regras clínicas
- Estrutura de regras em `/domain/rules`.
- Suporte a múltiplas regras por protocolo.
- Resultado das regras deve produzir:
  - alerta
  - sugestão
  - interpretação automática
- Regras versionáveis e desacopladas da interface.

### RF-08 — Testes ortopédicos inteligentes
Fluxo obrigatório:
1. Usuário seleciona região/articulação.
2. Sistema carrega testes correspondentes.
3. Usuário marca resultado (positivo/negativo/observação).
4. Sistema gera interpretação automática.
5. Persistência no banco.
6. Inclusão no PDF.

Requisito adicional:
- Banco de testes por articulação com busca por nome.
- Exibição contextual dinâmica (só mostra itens da articulação selecionada).

### RF-09 — Mapa da dor
- Canvas interativo frente/costas.
- Armazenamento de coordenadas e intensidade em JSON.
- Visualização e reedição posterior.

### RF-10 — PDF institucional
- Geração no backend.
- Formato A4 real.
- Cabeçalho e rodapé fixos.
- Paginação automática.
- Identificação completa profissional/paciente.
- Interpretação automática + fundamentação por protocolo.
- Campo para assinaturas.

### RF-11 — Integração Google Drive
- OAuth2.
- Estrutura de pasta: `Beyond Avaliação / {Paciente} / {Ano}`.
- Upload automático de PDF.
- Persistir `google_drive_file_id`.
- Estado de sincronização auditável.

### RF-12 — Evolução clínica longitudinal
- Tabela dedicada de evolução.
- Histórico completo por assessment.
- Ordenação por data e trilha temporal.

---

## 4. Requisitos Não Funcionais (RNF)

### RNF-01 — Arquitetura frontend
- Next.js 14+ (App Router)
- TypeScript obrigatório
- TailwindCSS
- React Hook Form
- Zod
- Separação de domínio clínico

Estrutura alvo:

```text
/app
/modules
/components
/domain
/hooks
/services
/utils
```

### RNF-02 — Arquitetura backend
- Node.js
- Fastify (preferencial) ou Express
- TypeScript
- Clean Architecture + DDD
- Middleware JWT
- Serviços desacoplados de controllers

Estrutura alvo:

```text
/src
  /controllers
  /services
  /repositories
  /domain
  /rules
  /middlewares
  /utils
```

### RNF-03 — Banco de dados
- PostgreSQL
- Prisma ORM
- Migrations versionadas
- JSONB para dados dinâmicos

### RNF-04 — Segurança
- JWT + bcrypt
- Rate limiting
- Sanitização de input
- Logs de auditoria
- Conformidade LGPD (base legal, minimização, rastreabilidade)

### RNF-05 — Observabilidade
- Logs estruturados por request
- Correlation ID
- Registro de eventos críticos (login, geração de PDF, upload Drive, alerta clínico)

### RNF-06 — Performance alvo (MVP Enterprise)
- p95 API < 500ms para endpoints de leitura
- geração de PDF < 5s para ficha padrão
- upload Google Drive < 10s (rede normal)

---

## 5. Modelo de Dados (Contrato Inicial)

### 5.1 Tabela `users`
- `id`
- `nome`
- `email` (único)
- `senha_hash`
- `crefito`
- `telefone`
- `created_at`

### 5.2 Tabela `patients`
- `id`
- `user_id` (FK users)
- `nome`
- `cpf`
- `data_nascimento`
- `sexo`
- `telefone`
- `endereco`
- `profissao`
- `diagnostico_clinico`
- `medico_solicitante`
- `plano_saude`
- `created_at`

### 5.3 Tabela `assessments`
- `id`
- `user_id` (FK users)
- `patient_id` (FK patients)
- `protocolo_selecionado`
- `data_avaliacao`
- `dados_identificacao` (JSONB)
- `habitos_vida` (JSONB)
- `sinais_vitais` (JSONB)
- `anamnese` (JSONB)
- `exame_fisico` (JSONB)
- `mapa_dor` (JSONB)
- `adm_forca` (JSONB)
- `testes_ortopedicos` (JSONB)
- `prescricao` (JSONB)
- `estrategias` (JSONB)
- `evolucao` (JSONB)
- `consentimento` (JSONB)
- `interpretacao_automatica` (JSONB)
- `pdf_url`
- `google_drive_file_id`
- `created_at`

### 5.4 Tabela `evolucoes`
- `id`
- `assessment_id` (FK assessments)
- `data`
- `resposta_ao_tratamento`
- `ajuste_conduta`
- `created_at`

### 5.5 Índices mínimos recomendados
- `users(email)` único
- `patients(user_id, nome)`
- `assessments(user_id, patient_id, data_avaliacao)`
- `evolucoes(assessment_id, data)`

---

## 6. Motor de Regras Clínicas (Especificação)

### 6.1 Contrato de regra
```ts
export interface ClinicalRule<T = any> {
  id: string
  protocol: string
  description: string
  condition: (data: T) => boolean
  outcome: {
    severity: 'info' | 'warning' | 'critical'
    message: string
    recommendation?: string
  }
}
```

### 6.2 Exemplo LCA
```ts
const regraLCA: ClinicalRule = {
  id: 'lca-instabilidade-anterior',
  protocol: 'LCA_POS_OPERATORIO',
  description: 'Lachman positivo sugere instabilidade anterior',
  condition: (dados) => dados?.testes_ortopedicos?.lachman === 'positivo',
  outcome: {
    severity: 'warning',
    message: 'Suspeita de instabilidade anterior (LCA).',
    recommendation: 'Reavaliar estabilidade, dor e progressão de carga.'
  }
}
```

### 6.3 Pipeline de execução
1. Carregar protocolo selecionado.
2. Carregar regras ativas do protocolo.
3. Executar regras contra payload consolidado da avaliação.
4. Persistir achados em `interpretacao_automatica`.
5. Exibir alertas na UI e no PDF.

---

## 7. Banco de Testes Ortopédicos por Articulação

### 7.1 Estrutura de catálogo
- `joint` (ombro, cotovelo, punho/mão, quadril, joelho, tornozelo/pé, coluna cervical, torácica, lombar)
- `test_name`
- `purpose`
- `how_to`
- `positive_criteria`
- `clinical_interpretation`

### 7.2 Comportamento de UX
- Campo de busca/autocomplete por articulação.
- Resultado filtra apenas testes da articulação.
- Seleção múltipla com status e observações.

### 7.3 Escalas funcionais (inclui DASH)
- DASH deve estar disponível no catálogo de membro superior.
- Escalas devem ter metadados:
  - domínio corporal
  - forma de cálculo
  - interpretação de escore

---

## 8. Contrato de API (mínimo)

### Auth
- `POST /auth/login`
- `POST /auth/refresh`

### Pacientes
- `POST /patients`
- `GET /patients`
- `GET /patients/:id`
- `PUT /patients/:id`
- `DELETE /patients/:id`

### Avaliações
- `POST /assessments`
- `GET /assessments`
- `GET /assessments/:id`
- `PUT /assessments/:id`
- `POST /assessments/:id/calculate`
- `POST /assessments/:id/generate-pdf`
- `POST /assessments/:id/sync-drive`

### Evoluções
- `POST /assessments/:id/evolutions`
- `GET /assessments/:id/evolutions`

### Protocolos e regras
- `GET /protocols`
- `GET /protocols/:id`
- `POST /rules/evaluate`

---

## 9. Fluxos Críticos (E2E)

### Fluxo A — Nova avaliação
1. Profissional autentica.
2. Seleciona paciente.
3. Seleciona protocolo.
4. Preenche ficha por módulos.
5. Sistema executa cálculos e regras.
6. Exibe alertas/sugestões.
7. Salva avaliação.

### Fluxo B — Fechamento documental
1. Profissional clica “Gerar PDF”.
2. Backend monta documento institucional.
3. Sistema salva URL/arquivo.
4. (Opcional) sincroniza no Drive e persiste file ID.

### Fluxo C — Reavaliação/evolução
1. Abrir assessment existente.
2. Inserir evolução da sessão.
3. Atualizar resposta terapêutica.
4. Persistir histórico temporal.

---

## 10. Segurança e LGPD

- Minimização de dados: armazenar apenas campos necessários para finalidade clínica.
- Controle de acesso: usuário só acessa seus próprios pacientes/avaliações.
- Criptografia em trânsito (TLS) e práticas de segredo em `.env`.
- Auditoria de eventos sensíveis.
- Política de retenção/exclusão e mecanismo de anonimização quando aplicável.

---

## 11. Critérios de Aceite (Definition of Done)

### DoD funcional
- CRUD de pacientes completo.
- CRUD de assessments completo.
- Cálculos automáticos implementados e testados.
- Protocolo LCA funcional com red flags.
- Motor de regras operacional.
- PDF institucional gerado no backend.
- Integração com Google Drive funcionando.
- Evolução clínica com histórico completo.

### DoD técnico
- Projeto com Docker.
- `.env.example` documentado.
- Migrations Prisma aplicáveis em ambiente limpo.
- README técnico com instruções de execução.
- Documentação de API publicada (OpenAPI/Swagger).
- Logs básicos de auditoria ativos.

---

## 12. Entregáveis

- Código organizado (frontend + backend).
- Infra local com Docker Compose.
- Banco PostgreSQL com migrations.
- Script de seed para protocolos e testes ortopédicos.
- Documentação de arquitetura e API.
- Sistema executando localmente e pronto para deploy.

---

## 13. Roadmap Técnico Sugerido

### Fase 1 (Fundação)
- Setup monorepo/projetos
- auth + users + patients
- estrutura de protocolos e regras

### Fase 2 (Core clínico)
- assessments + cálculos + testes ortopédicos
- mapa da dor
- evoluções

### Fase 3 (Documentação e integrações)
- geração PDF backend
- Google Drive
- auditoria e observabilidade

### Fase 4 (Hardening)
- testes E2E
- validações LGPD
- performance tuning

---

## 14. Restrições e Decisões Arquiteturais

- **Sem pagamentos** nesta release.
- **Backend gera PDF** (não gerar no browser).
- **Regras clínicas desacopladas** de controller/UI.
- **JSONB** para flexibilidade sem perder dados estruturais essenciais.

---

## 15. Resultado Esperado

Entrega de uma plataforma que não seja apenas “ficha digital”, mas sim:
- Sistema de apoio à decisão clínica
- Padronização por protocolo
- Baseada em evidência e auditável
- Preparada para escalar como SaaS
- Pronta para incorporar IA em próximas versões

