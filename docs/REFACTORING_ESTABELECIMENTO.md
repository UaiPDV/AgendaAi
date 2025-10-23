# Refatoração Estabelecimento - Clean Architecture

## ✅ Estrutura Criada

### Tipos (`src/types/estabelecimento.ts`)

-   ✅ `DashboardMetrics` - Métricas do dashboard
-   ✅ `RevenueChartData` - Dados para gráficos
-   ✅ `AgendamentoListItem` - Agendamento com informações extras
-   ✅ `ProfissionalDetalhado` - Profissional completo
-   ✅ `ServicoDetalhado` - Serviço completo
-   ✅ `Cliente` - Cliente do estabelecimento
-   ✅ `TransacaoFinanceira` - Transação financeira
-   ✅ `ResumoFinanceiroEstabelecimento` - Resumo financeiro
-   ✅ `ConfiguracaoHorario` - Configuração de horários
-   ✅ `HistoricoFiltros` - Filtros para histórico
-   ✅ `NovoServicoForm` - Form novo serviço
-   ✅ `NovoProfissionalForm` - Form novo profissional

### Hooks Customizados (`src/hooks/`)

-   ✅ `useServicos` - Gerenciamento completo de serviços (CRUD)
-   ✅ `useProfissionais` - Gerenciamento completo de profissionais (CRUD)
-   ✅ `useDashboardMetrics` - Métricas e cálculos do dashboard

### Componentes UI Atômicos (`src/components/ui/estabelecimento/`)

-   ✅ `MetricCard` - Card de métrica com ícone
-   ✅ `ServiceCard` - Card de serviço (grid)
-   ✅ `ProfessionalRow` - Linha de profissional (tabela)
-   ✅ `AppointmentCard` - Card de agendamento

### Modais (`src/components/modals/`)

-   ✅ `NovoServicoModal` - Modal criar/editar serviço
-   ✅ `NovoProfissionalModal` - Modal criar/editar profissional

### Páginas Refatoradas

-   ✅ `dashboard/page.tsx` - Dashboard completo com métricas

## 📋 Páginas Pendentes

### Agenda (`agenda/page.tsx`)

**Estrutura do Protótipo:**

-   Seção "Agendamentos de Hoje" (cards)
-   Seção "Próximos Agendamentos" (cards)
-   Botão de ação rápida "Novo Agendamento"

**Componentes necessários:**

-   `TodayAppointments` - Seção agendamentos de hoje
-   `UpcomingAppointments` - Seção próximos agendamentos
-   Hook: `useAgendamentosEstabelecimento` (filtrar por estabelecimento)

### Serviços (`servicos/page.tsx`)

**Estrutura do Protótipo:**

-   Grid de cards de serviços
-   Botão "+ Novo Serviço"
-   Modal de criação/edição
-   Ações: editar, excluir, ativar/desativar

**Já implementado:**

-   ✅ `ServiceCard`
-   ✅ `NovoServicoModal`
-   ✅ Hook `useServicos`

**Pending:**

-   Implementar página completa com grid e integração

### Profissionais (`profissionais/page.tsx`)

**Estrutura do Protótipo:**

-   Tabela de profissionais
-   Colunas: Nome, Telefone, Especialidades, Status, Ações
-   Botão "+ Novo Profissional"
-   Modal de criação/edição

**Já implementado:**

-   ✅ `ProfessionalRow`
-   ✅ `NovoProfissionalModal`
-   ✅ Hook `useProfissionais`

**Pending:**

-   Implementar página completa com tabela

### Clientes (`clientes/page.tsx`)

**Estrutura do Protótipo:**

-   Tabela de clientes
-   Colunas: Nome, Email, Telefone, Total Agendamentos, Último Agendamento
-   Busca/filtro

**Componentes necessários:**

-   `ClientRow` - Linha de cliente
-   Hook: `useClientes`

### Histórico (`historico/page.tsx`)

**Estrutura do Protótipo:**

-   Filtros (data, status, profissional, serviço)
-   Tabela de histórico completa
-   Paginação

**Componentes necessários:**

-   `HistoricoFiltros` - Componente de filtros
-   `HistoricoTable` - Tabela com paginação
-   Hook: `useHistoricoAgendamentos`

### Financeiro (`financeiro/page.tsx`)

**Estrutura do Protótipo:**

-   Cards de resumo (receita, pendente, cancelada)
-   Transações recentes
-   Histórico completo com filtros

**Componentes necessários:**

-   `TransacaoRow` - Linha de transação
-   Hook: `useTransacoes`

### Relatórios (`relatorios/page.tsx`)

**Estrutura do Protótipo:**

-   Cards de relatórios disponíveis
-   Download de relatórios
-   Filtros de período

**Componentes necessários:**

-   `RelatorioCard` - Card de relatório
-   Hook: `useRelatorios`

### Configuração (`configuracao/page.tsx`)

**Estrutura do Protótipo:**

-   Formulário de horário de funcionamento
-   Dias da semana (checkboxes)
-   Intervalo de almoço
-   Calendário de bloqueio de datas
-   Botão salvar

**Componentes necessários:**

-   `HorarioForm` - Formulário de horários
-   `CalendarioBloqueio` - Calendário interativo
-   Hook: `useConfiguracaoEstabelecimento`

## 🎯 Padrão de Implementação

### Estrutura de Arquivo de Página

```typescript
/**
 * [Nome da Página]
 * [Descrição]
 */

'use client';

import { useState } from 'react';
import { [hooks necessários] } from '@/hooks';
import { [componentes] } from '@/components/ui/estabelecimento';
import { [modais] } from '@/components/modals';

const ESTABELECIMENTO_ID = 1; // Em produção: contexto de auth

export default function [Nome]Page() {
  // Estados locais
  const [modalOpen, setModalOpen] = useState(false);

  // Hooks customizados
  const { data, loading, error, actions } = useHook(ESTABELECIMENTO_ID);

  // Handlers
  const handleAction = async () => {
    // lógica
  };

  // Loading state
  if (loading) return <LoadingSpinner />;

  // Error state
  if (error) return <ErrorMessage error={error} />;

  // Render
  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold">Título</h2>
        <p className="text-sm text-gray-500">Descrição</p>
      </div>

      {/* Conteúdo */}
      {/* Componentes */}

      {/* Modais */}
    </div>
  );
}
```

### Checklist de Qualidade

-   [ ] Tipagem completa (sem `any`)
-   [ ] Componentes separados por arquivo
-   [ ] Hooks customizados para lógica
-   [ ] Loading e error states
-   [ ] Responsivo (mobile-first)
-   [ ] Dark mode support
-   [ ] Acessibilidade (ARIA)
-   [ ] Clean code (nomes descritivos)
-   [ ] Comentários JSDoc
-   [ ] Barrel exports (index.ts)

## 🚀 Próximos Passos

1. **Refatorar Serviços** - Página completa com grid e modal
2. **Refatorar Profissionais** - Página completa com tabela
3. **Refatorar Agenda** - Seções hoje/próximos
4. **Refatorar Clientes** - Tabela com busca
5. **Refatorar Histórico** - Filtros + tabela paginada
6. **Refatorar Financeiro** - Cards + transações
7. **Refatorar Relatórios** - Cards de relatórios
8. **Refatorar Configuração** - Form + calendário bloqueio

## 📝 Notas Importantes

-   Todos os componentes devem seguir o padrão funcional React
-   Usar TypeScript strict mode
-   Seguir convenções de nomenclatura do projeto
-   Manter consistência visual com protótipo
-   Implementar feedback visual (loading, success, error)
-   Adicionar validações de formulário
-   Tratar erros de API adequadamente
