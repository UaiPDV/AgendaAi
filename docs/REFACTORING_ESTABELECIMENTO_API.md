# Refatoração da Área de Estabelecimentos

## 📋 Resumo

Refatoração completa da área de estabelecimentos para consumir corretamente a
API REST, seguindo Clean Architecture e eliminando dependências de dados
mockados.

## 🔧 Mudanças Implementadas

### 1. **Serviços Criados** (Clean Architecture Layer)

#### `src/lib/services/estabelecimento.service.ts`

-   ✅ `getEstabelecimentoLogado()` - Busca dados do estabelecimento autenticado
    via `/api/estabelecimentos/me`
-   ✅ `getEstabelecimentoById(id)` - Busca estabelecimento específico (público)
-   ✅ `getEstabelecimentos(search?)` - Lista estabelecimentos com busca
    opcional
-   ✅ `updateEstabelecimentoLogado(data)` - Atualiza dados do estabelecimento
-   ✅ `getServicosEstabelecimento(id)` - Lista serviços do estabelecimento
-   ✅ `getProfissionaisEstabelecimento(id)` - Lista profissionais do
    estabelecimento

#### `src/lib/services/agendamento.service.ts`

-   ✅ `getAgendamentos()` - Lista agendamentos (filtra por tipo de usuário na
    API)
-   ✅ `getAgendamentoById(id)` - Busca agendamento específico
-   ✅ `createAgendamento(data)` - Cria novo agendamento
-   ✅ `updateAgendamento(id, data)` - Atualiza agendamento
-   ✅ `cancelAgendamento(id)` - Cancela agendamento

#### `src/lib/services/servico.service.ts`

-   ✅ `getServicos()` - Lista todos os serviços (público)
-   ✅ `getServicoById(id)` - Busca serviço específico
-   ✅ `createServico(data)` - Cria novo serviço (autenticado)
-   ✅ `updateServico(id, data)` - Atualiza serviço (autenticado)
-   ✅ `deleteServico(id)` - Deleta serviço (autenticado)
-   ✅ `getServicosDoEstabelecimento(id)` - Lista serviços de um estabelecimento

#### `src/lib/services/profissional.service.ts`

-   ✅ `getProfissionais()` - Lista todos os profissionais (público)
-   ✅ `getProfissionalById(id)` - Busca profissional específico
-   ✅ `createProfissional(data)` - Cria novo profissional (autenticado)
-   ✅ `updateProfissional(id, data)` - Atualiza profissional (autenticado)
-   ✅ `deleteProfissional(id)` - Deleta profissional (autenticado)
-   ✅ `getProfissionaisDoEstabelecimento(id)` - Lista profissionais de um
    estabelecimento

#### `src/lib/services/index.ts`

-   ✅ Barrel export para todos os serviços

### 2. **Hooks Refatorados**

#### `src/hooks/useEstabelecimentoLogado.ts` (NOVO)

```typescript
// Obtém os dados do estabelecimento autenticado
const { estabelecimento, loading, error, recarregar } =
	useEstabelecimentoLogado();
```

-   Busca automaticamente via `/api/estabelecimentos/me`
-   Usa token JWT do localStorage
-   Loading e error states

#### `src/hooks/useDashboardMetrics.ts` (REFATORADO)

```typescript
// Agora não precisa mais do ID - obtém automaticamente do usuário logado
const { metrics, proximosAgendamentos, loading, error, recarregar } =
	useDashboardMetrics();
```

**Mudanças:**

-   ❌ ANTES: Usava `apiRequest` sem token
-   ✅ AGORA: Usa `getAgendamentos()` com autenticação automática
-   ✅ Obtém ID do estabelecimento do usuário logado via `getUserData()`
-   ✅ Filtra agendamentos por estabelecimento
-   ✅ Calcula métricas corretamente

#### `src/hooks/useEstabelecimentos.ts` (REFATORADO)

```typescript
const { estabelecimentos, loading, error } = useEstabelecimentos(search?);
const { estabelecimento, loading, error } = useEstabelecimento(id);
```

**Mudanças:**

-   ❌ ANTES: Usava `apiRequest` diretamente
-   ✅ AGORA: Usa `getEstabelecimentos()` e `getEstabelecimentoById()`
-   ✅ Suporte a busca por nome

#### `src/hooks/useServicos.ts` (REFATORADO)

```typescript
const {
	servicos,
	loading,
	error,
	criarServico,
	atualizarServico,
	excluirServico,
	recarregar,
} = useServicos();
```

**Mudanças:**

-   ❌ ANTES: Usava `apiRequest` sem autenticação
-   ✅ AGORA: Usa serviços autenticados (`createServico`, `updateServico`,
    `deleteServico`)
-   ✅ Obtém ID do estabelecimento automaticamente do usuário logado
-   ✅ Token JWT injetado automaticamente

#### `src/hooks/useProfissionais.ts` (REFATORADO)

```typescript
const {
	profissionais,
	loading,
	error,
	criarProfissional,
	atualizarProfissional,
	excluirProfissional,
	recarregar,
} = useProfissionais();
```

**Mudanças:**

-   ❌ ANTES: Usava `apiRequest` sem autenticação
-   ✅ AGORA: Usa serviços autenticados (`createProfissional`,
    `updateProfissional`, `deleteProfissional`)
-   ✅ Obtém ID do estabelecimento automaticamente do usuário logado
-   ✅ Token JWT injetado automaticamente

### 3. **Páginas Atualizadas**

#### `src/app/(busines)/estabelecimento/dashboard/page.tsx`

**Mudanças:**

-   ❌ REMOVIDO: Constante `ESTABELECIMENTO_ID = 1` (mock)
-   ✅ AGORA: Hook obtém ID automaticamente do usuário logado

```typescript
// ANTES
const { metrics, proximosAgendamentos, loading, error } =
	useDashboardMetrics(ESTABELECIMENTO_ID);

// DEPOIS
const { metrics, proximosAgendamentos, loading, error } = useDashboardMetrics();
```

### 4. **Exports Atualizados**

#### `src/hooks/index.ts`

-   ✅ Adicionado `export { useEstabelecimentoLogado }`

#### `src/lib/services/index.ts` (NOVO)

-   ✅ Barrel export para todos os serviços

## 🔐 Autenticação Implementada

### Token JWT

Todos os serviços agora usam token JWT automaticamente:

```typescript
// Antes (SEM autenticação)
const data = await apiRequest('/api/endpoint');

// Depois (COM autenticação automática)
const token = getAuthToken();
const data = await apiRequest('/api/endpoint', {
	token: token || undefined,
});
```

### Obtenção do ID do Estabelecimento

```typescript
// Obtém automaticamente do localStorage
const user = getUserData();
if (user && user.tipo === 'estabelecimento') {
	const estabId = user.id as number;
}
```

## 🎯 Endpoints da API Usados

### Estabelecimentos

-   ✅ `GET /api/estabelecimentos` - Lista todos (público)
-   ✅ `GET /api/estabelecimentos/me` - Dados do estabelecimento logado
    (autenticado)
-   ✅ `GET /api/estabelecimentos/:id` - Estabelecimento específico (público)
-   ✅ `PUT /api/estabelecimentos/me` - Atualiza estabelecimento (autenticado)
-   ✅ `GET /api/estabelecimentos/:id/servicos` - Serviços do estabelecimento
    (público)
-   ✅ `GET /api/estabelecimentos/:id/profissionais` - Profissionais do
    estabelecimento (público)

### Agendamentos

-   ✅ `GET /api/agendamentos` - Lista agendamentos (autenticado, filtra por
    tipo)
-   ✅ `POST /api/agendamentos` - Cria agendamento (autenticado - cliente)
-   ✅ `PATCH /api/agendamentos/:id` - Atualiza status (autenticado)
-   ✅ `DELETE /api/agendamentos/:id` - Deleta agendamento (autenticado)

### Serviços

-   ✅ `GET /api/servicos` - Lista todos (público)
-   ✅ `GET /api/servicos/:id` - Serviço específico (público)
-   ✅ `POST /api/servicos` - Cria serviço (autenticado - estabelecimento)
-   ✅ `PUT /api/servicos/:id` - Atualiza serviço (autenticado -
    estabelecimento)
-   ✅ `DELETE /api/servicos/:id` - Deleta serviço (autenticado -
    estabelecimento)

### Profissionais

-   ✅ `GET /api/profissionais` - Lista todos (público)
-   ✅ `GET /api/profissionais/:id` - Profissional específico (público)
-   ✅ `POST /api/profissionais` - Cria profissional (autenticado -
    estabelecimento)
-   ✅ `PUT /api/profissionais/:id` - Atualiza profissional (autenticado -
    estabelecimento)
-   ✅ `DELETE /api/profissionais/:id` - Deleta profissional (autenticado -
    estabelecimento)

## ✅ Problemas Resolvidos

### 1. **"Token de autenticação ausente"**

**Causa:** Hook `useDashboardMetrics` usava `apiRequest` sem passar token

**Solução:**

-   Criado `agendamento.service.ts` com função `getAgendamentos()` que injeta
    token automaticamente
-   Hook refatorado para usar o serviço ao invés de `apiRequest` direto

### 2. **ID do Estabelecimento Mockado**

**Causa:** Dashboard usava `const ESTABELECIMENTO_ID = 1`

**Solução:**

-   Hook agora obtém ID do `getUserData()` automaticamente
-   Não precisa mais passar ID manualmente

### 3. **Chamadas API Não Autenticadas**

**Causa:** Hooks usavam `apiRequest` sem token

**Solução:**

-   Criados serviços dedicados que injetam token automaticamente
-   Todos os hooks refatorados para usar os serviços

### 4. **Dados Mockados**

**Causa:** Hooks retornavam arrays vazios ou dados falsos

**Solução:**

-   Todos os hooks agora fazem chamadas reais à API
-   Dados vêm do banco de dados SQLite

## 🚀 Como Usar

### Dashboard

```typescript
// Na página do dashboard
export default function DashboardPage() {
	const { metrics, proximosAgendamentos, loading, error } =
		useDashboardMetrics();

	// metrics conterá os dados reais do estabelecimento logado
	// proximosAgendamentos conterá os 5 próximos agendamentos
}
```

### Serviços

```typescript
// Na página de serviços
export default function ServicosPage() {
	const { servicos, loading, error, criarServico, excluirServico } =
		useServicos();

	// servicos conterá os serviços do estabelecimento logado
	// criarServico() cria um novo serviço autenticado
}
```

### Profissionais

```typescript
// Na página de profissionais
export default function ProfissionaisPage() {
	const { profissionais, loading, error, criarProfissional } =
		useProfissionais();

	// profissionais conterá os profissionais do estabelecimento logado
}
```

## 📝 Próximos Passos

### Páginas que Precisam Implementação

1. **`/estabelecimento/servicos/page.tsx`**

    - Usar `useServicos()` hook
    - Listar serviços em grid/lista
    - Botão "Novo Serviço" com modal
    - Editar/deletar serviços

2. **`/estabelecimento/profissionais/page.tsx`**

    - Usar `useProfissionais()` hook
    - Listar profissionais em grid/lista
    - Botão "Novo Profissional" com modal
    - Editar/deletar profissionais

3. **`/estabelecimento/agenda/page.tsx`**

    - Usar `useAgendamentos()` hook (criar se necessário)
    - Visualização em calendário
    - Filtros por profissional/serviço/status

4. **`/estabelecimento/clientes/page.tsx`**

    - Criar `useClientes()` hook
    - Listar clientes que agendaram
    - Visualizar histórico de agendamentos por cliente

5. **`/estabelecimento/historico/page.tsx`**

    - Usar `useAgendamentos()` hook
    - Filtrar por data/status/profissional
    - Paginação

6. **`/estabelecimento/configuracao/page.tsx`**

    - Usar `useEstabelecimentoLogado()` hook
    - Formulário de edição de dados
    - Upload de imagem
    - Horários de funcionamento

7. **`/estabelecimento/financeiro/page.tsx`**

    - Criar `useFinanceiro()` hook
    - Métricas de receita
    - Lista de transações

8. **`/estabelecimento/relatorios/page.tsx`**
    - Gráficos de métricas
    - Exportar relatórios

## 🔗 Arquivos Modificados

### Criados

-   `src/lib/services/estabelecimento.service.ts`
-   `src/lib/services/agendamento.service.ts`
-   `src/lib/services/servico.service.ts`
-   `src/lib/services/profissional.service.ts`
-   `src/lib/services/index.ts`
-   `src/hooks/useEstabelecimentoLogado.ts`

### Modificados

-   `src/hooks/useDashboardMetrics.ts`
-   `src/hooks/useEstabelecimentos.ts`
-   `src/hooks/useServicos.ts`
-   `src/hooks/useProfissionais.ts`
-   `src/hooks/index.ts`
-   `src/app/(busines)/estabelecimento/dashboard/page.tsx`

---

**Data:** 23 de Outubro de 2025  
**Status:** ✅ Completo e funcional  
**Testado:** API rodando em http://localhost:3001
