# 🏗️ Arquitetura da API AgendaAi

## 📐 Visão Geral

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React/Next.js)                  │
│          Cliente Mobile/Web    |    Estabelecimento Web      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ HTTPS / REST
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                      API REST (Express.js)                   │
│                    http://localhost:3001/api                 │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              MIDDLEWARE LAYER                         │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │  • CORS                                               │  │
│  │  • JSON Parser                                        │  │
│  │  • authenticateToken (JWT)                           │  │
│  │  • isCliente / isEstabelecimento                     │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              ROUTES (14 grupos)                       │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │  /auth              - Autenticação                    │  │
│  │  /usuarios          - Perfil e preferências          │  │
│  │  /estabelecimentos  - Estabelecimentos e recursos    │  │
│  │  /servicos          - CRUD Serviços                  │  │
│  │  /profissionais     - CRUD Profissionais             │  │
│  │  /clientes          - Gestão de clientes            │  │
│  │  /agendamentos      - Sistema de agendamentos        │  │
│  │  /configuracoes     - Configurações avançadas        │  │
│  │  /avaliacoes        - Sistema de avaliações          │  │
│  │  /dashboard         - Métricas e analytics           │  │
│  │  /relatorios        - Relatórios financeiros         │  │
│  │  /financas          - Dados financeiros              │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              UTILS & HELPERS                          │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │  • availabilityHelper.js - Cálculo de disponibilidade│  │
│  │  • Validações de negócio                             │  │
│  │  • Cálculos de métricas                              │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ SQL
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    DATABASE (SQLite)                         │
│                   agendaai.sqlite                            │
├─────────────────────────────────────────────────────────────┤
│  📊 TABELAS PRINCIPAIS:                                      │
│                                                               │
│  • usuarios (clientes)                                        │
│  • estabelecimentos                                           │
│  • servicos                                                   │
│  • profissionais                                              │
│  • agendamentos                                               │
│  • avaliacoes                                                 │
│  • configuracoes_estabelecimento                              │
│  • formas_pagamento                                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Fluxo de Autenticação

```
┌─────────┐         ┌──────────┐         ┌──────────┐
│ Cliente │────────▶│   POST   │────────▶│ Valida   │
│         │         │ /login   │         │credenciais│
└─────────┘         └──────────┘         └─────┬────┘
                                                │
                                                │
                                          ┌─────▼────┐
                                          │  Gera    │
                                          │   JWT    │
                                          └─────┬────┘
                                                │
                                                │
┌─────────┐         ┌──────────┐         ┌─────▼────┐
│ Cliente │◀────────│ Response │◀────────│ Retorna  │
│         │         │  + Token │         │  Token   │
└─────────┘         └──────────┘         └──────────┘
      │
      │ Armazena token
      │
      ▼
┌─────────────────────────────────────────────────┐
│  Próximas requisições:                          │
│  Authorization: Bearer <token>                  │
└─────────────────────────────────────────────────┘
```

---

## 📅 Fluxo de Agendamento

```
1. Cliente busca estabelecimentos
   GET /api/estabelecimentos
   ↓

2. Cliente vê serviços do estabelecimento
   GET /api/estabelecimentos/:id/servicos
   ↓

3. Cliente seleciona profissional
   GET /api/estabelecimentos/:id/profissionais
   ↓

4. Cliente verifica disponibilidade
   GET /api/estabelecimentos/:id/disponibilidade
   ↓
   ┌────────────────────────────────────────┐
   │  Cálculo de Disponibilidade:           │
   │  1. Busca configurações                │
   │  2. Verifica horários de funcionamento │
   │  3. Consulta agendamentos existentes   │
   │  4. Aplica buffer entre serviços       │
   │  5. Remove horários bloqueados         │
   │  6. Retorna slots disponíveis          │
   └────────────────────────────────────────┘
   ↓

5. Cliente cria agendamento
   POST /api/agendamentos
   ↓
   ┌────────────────────────────────────────┐
   │  Validações:                           │
   │  • Horário disponível?                 │
   │  • Respeita antecedência mínima?       │
   │  • Não ultrapassa limite simultâneo?   │
   │  • Data não está bloqueada?            │
   └────────────────────────────────────────┘
   ↓

6. Status inicial: "pendente"
   (Se confirmação automática: "confirmado")
   ↓

7. Estabelecimento confirma
   PATCH /api/agendamentos/:id/confirmar
   ↓

8. Cliente pode reagendar
   PUT /api/agendamentos/:id/reagendar
   ↓

9. Após conclusão, cliente avalia
   POST /api/avaliacoes
```

---

## 🗂️ Modelo de Dados Simplificado

```
┌─────────────┐
│  USUARIOS   │
├─────────────┤
│ id          │──┐
│ nome        │  │
│ email       │  │
│ senha       │  │
│ tipo        │  │
│ ...         │  │
└─────────────┘  │
                 │
                 │    ┌──────────────────┐
                 └───▶│  AGENDAMENTOS    │
                      ├──────────────────┤
┌──────────────────┐ │ id               │
│ ESTABELECIMENTOS │ │ usuario_id       │◀────────┐
├──────────────────┤ │ estabelecimento_id│        │
│ id               │◀┤ servico_id       │        │
│ nome             │ │ profissional_id  │        │
│ endereco         │ │ data             │        │
│ ...              │ │ horario          │        │
└──────────────────┘ │ status           │        │
        │            │ preco            │        │
        │            │ ...              │        │
        │            └──────────────────┘        │
        │                    │                   │
        ├────────────────────┤                   │
        │                    │                   │
        ▼                    ▼                   │
┌──────────────┐    ┌────────────────┐          │
│  SERVICOS    │    │ PROFISSIONAIS  │          │
├──────────────┤    ├────────────────┤          │
│ id           │    │ id             │          │
│ estab_id     │    │ estab_id       │          │
│ nome         │    │ nome           │          │
│ duracao      │    │ horario_entrada│          │
│ preco        │    │ horario_saida  │          │
│ ...          │    │ ...            │          │
└──────────────┘    └────────────────┘          │
                                                 │
                    ┌─────────────────┐          │
                    │  AVALIACOES     │          │
                    ├─────────────────┤          │
                    │ id              │          │
                    │ agendamento_id  │──────────┘
                    │ usuario_id      │
                    │ nota            │
                    │ comentario      │
                    │ ...             │
                    └─────────────────┘

┌────────────────────────────┐
│ CONFIGURACOES_ESTABELEC.   │
├────────────────────────────┤
│ id                         │
│ estabelecimentoId          │
│ padraoFuncionamento        │
│ diasTrabalho (JSON)        │
│ horarioAbertura            │
│ horarioFechamento          │
│ feriadosPersonalizados     │
│ datasBloqueadas (JSON)     │
│ antecedenciaMinima         │
│ bufferEntreServicos        │
│ ...                        │
└────────────────────────────┘
```

---

## 🔒 Camadas de Segurança

```
┌─────────────────────────────────────────────────────┐
│  1. CORS                                            │
│     Controla origem das requisições                │
└─────────────────────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────┐
│  2. JWT Authentication                              │
│     Valida token em rotas protegidas               │
└─────────────────────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────┐
│  3. Authorization Middleware                        │
│     • isCliente: Valida se é cliente               │
│     • isEstabelecimento: Valida se é estabelecimento│
└─────────────────────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────┐
│  4. Ownership Validation                            │
│     Verifica se recurso pertence ao usuário        │
└─────────────────────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────┐
│  5. Business Rules Validation                       │
│     Valida regras de negócio específicas           │
└─────────────────────────────────────────────────────┘
```

---

## 📊 Sistema de Disponibilidade

```
GET /api/estabelecimentos/:id/disponibilidade
↓
┌───────────────────────────────────────────────┐
│  STEP 1: Buscar Configurações                │
│  • Horário de funcionamento                  │
│  • Dias de trabalho                          │
│  • Intervalo de almoço                       │
│  • Buffer entre serviços                     │
│  • Datas bloqueadas                          │
└───────────────────────────────────────────────┘
↓
┌───────────────────────────────────────────────┐
│  STEP 2: Gerar Slots de Horários             │
│  • De abertura até fechamento                │
│  • Considerando duração do serviço           │
│  • Aplicando intervalo de almoço             │
└───────────────────────────────────────────────┘
↓
┌───────────────────────────────────────────────┐
│  STEP 3: Filtrar Horários Ocupados           │
│  • Busca agendamentos existentes             │
│  • Remove horários conflitantes              │
│  • Aplica buffer entre serviços              │
└───────────────────────────────────────────────┘
↓
┌───────────────────────────────────────────────┐
│  STEP 4: Retornar Horários Disponíveis       │
│  [ "09:00", "09:45", "10:30", ... ]          │
└───────────────────────────────────────────────┘
```

---

## 🔄 Ciclo de Vida do Agendamento

```
┌─────────────┐
│  PENDENTE   │  ← Cliente cria agendamento
└──────┬──────┘
       │
       ├─────────────────────┐
       │                     │
       ▼                     ▼
┌─────────────┐      ┌─────────────┐
│ CONFIRMADO  │      │ CANCELADO   │
└──────┬──────┘      └─────────────┘
       │
       │  Após serviço
       ▼
┌─────────────┐
│ CONCLUÍDO   │  → Cliente pode avaliar
└──────┬──────┘
       │
       │  Se não compareceu
       ▼
┌──────────────────┐
│ NÃO_COMPARECEU  │
└──────────────────┘
```

---

## 📈 Métricas e Analytics

```
Dashboard Metrics Pipeline:
┌──────────────────────────────────────┐
│  Real-time Calculations              │
├──────────────────────────────────────┤
│                                      │
│  1. COUNT agendamentos hoje          │
│     WHERE data = hoje                │
│     AND status IN (confirmado,       │
│                    pendente)         │
│                                      │
│  2. SUM(preco) faturamento hoje      │
│     WHERE data = hoje                │
│     AND status = concluido           │
│                                      │
│  3. SUM(preco) faturamento mês       │
│     WHERE data >= inicio_mes         │
│     AND status = concluido           │
│                                      │
│  4. COUNT DISTINCT usuarios          │
│     WHERE data >= hoje - 90 dias     │
│                                      │
│  5. AVG(nota) avaliação média        │
│     FROM avaliacoes                  │
│                                      │
└──────────────────────────────────────┘
```

---

## 🚀 Deploy e Escalabilidade

### Arquitetura Atual (Desenvolvimento)

```
┌────────────────────┐
│   Single Server    │
│                    │
│  • Node.js         │
│  • Express         │
│  • SQLite          │
│                    │
│  Port: 3001        │
└────────────────────┘
```

### Arquitetura Recomendada (Produção)

```
┌──────────────┐
│   Load       │
│   Balancer   │
└──────┬───────┘
       │
       ├─────────────┬─────────────┐
       │             │             │
       ▼             ▼             ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│  Node.js │  │  Node.js │  │  Node.js │
│ Instance │  │ Instance │  │ Instance │
└─────┬────┘  └─────┬────┘  └─────┬────┘
      │             │             │
      └─────────────┴─────────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │   PostgreSQL          │
        │   (Primary/Replica)   │
        └───────────────────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │   Redis Cache         │
        └───────────────────────┘
```

---

## 🔧 Tecnologias Utilizadas

| Camada        | Tecnologia | Versão |
| ------------- | ---------- | ------ |
| **Runtime**   | Node.js    | 18+    |
| **Framework** | Express.js | 4.18+  |
| **Database**  | SQLite     | 3      |
| **Auth**      | JWT        | 9.0+   |
| **Password**  | bcrypt.js  | 2.4+   |
| **CORS**      | cors       | 2.8+   |
| **Env**       | dotenv     | 16.3+  |
| **UUID**      | uuid       | 9.0+   |

---

## 📝 Padrões de Código

### Estrutura de Rota Padrão

```javascript
import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.js';
import { openDb } from '../database.js';

const router = Router();

// Middleware de autenticação (se necessário)
router.use(authenticateToken);

// GET - Listar
router.get('/', async (req, res) => {
	// Lógica aqui
});

// POST - Criar
router.post('/', async (req, res) => {
	// Validações
	// Lógica de criação
});

// PUT - Atualizar
router.put('/:id', async (req, res) => {
	// Validações
	// Lógica de atualização
});

// DELETE - Remover
router.delete('/:id', async (req, res) => {
	// Validações
	// Lógica de remoção
});

export default router;
```

---

**Última atualização:** 24/10/2025  
**Versão da API:** 1.0.0
