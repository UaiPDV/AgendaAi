# Refatoração Estabelecimento - Clean Architecture

> 📌 Para detalhes de arquitetura e padrões, veja
> [API_SPECIFICATION.md](./API_SPECIFICATION.md).

## ✅ Componentes Criados

### Tipos (`src/types/estabelecimento.ts`)

-   `DashboardMetrics`, `RevenueChartData`
-   `AgendamentoListItem`, `ProfissionalDetalhado`, `ServicoDetalhado`
-   `Cliente`, `TransacaoFinanceira`, `ResumoFinanceiroEstabelecimento`
-   `ConfiguracaoHorario`, `HistoricoFiltros`
-   `NovoServicoForm`, `NovoProfissionalForm`

### Hooks (`src/hooks/`)

-   `useServicos` - CRUD completo de serviços
-   `useProfissionais` - CRUD completo de profissionais
-   `useDashboardMetrics` - Métricas e cálculos

### UI (`src/components/ui/estabelecimento/`)

-   `MetricCard` - Card de métrica
-   `ServiceCard` - Card de serviço
-   `ProfessionalRow` - Linha de profissional
-   `AppointmentCard` - Card de agendamento

### Modais (`src/components/modals/`)

-   `NovoServicoModal` - Criar/editar serviço
-   `NovoProfissionalModal` - Criar/editar profissional

## 📋 Páginas

### ✅ Implementadas

-   `dashboard/page.tsx` - Dashboard com métricas

### � Pendentes

1. **Agenda** - Agendamentos de hoje e próximos
2. **Serviços** - Grid de serviços com modal
3. **Profissionais** - Tabela de profissionais
4. **Clientes** - Lista de clientes
5. **Histórico** - Histórico com filtros
6. **Financeiro** - Transações e resumo
7. **Relatórios** - Geração de relatórios
8. **Configuração** - Horários de funcionamento

## 🎯 Padrão de Implementação

```typescript
'use client';

import { useState } from 'react';
import { useHook } from '@/hooks';
import { Component } from '@/components/ui/estabelecimento';

const ESTABELECIMENTO_ID = 1;

export default function Page() {
	const { data, loading, error, actions } = useHook(ESTABELECIMENTO_ID);

	if (loading) return <LoadingSpinner />;
	if (error) return <ErrorMessage error={error} />;

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-bold">Título</h2>
				<p className="text-sm text-gray-500">Descrição</p>
			</div>
			{/* Componentes */}
		</div>
	);
}
```

## ✅ Checklist

-   [ ] Tipagem completa (sem `any`)
-   [ ] Componentes separados por arquivo
-   [ ] Hooks customizados para lógica
-   [ ] Loading e error states
-   [ ] Responsivo (mobile-first)
-   [ ] Dark mode support
-   [ ] Acessibilidade (ARIA)
-   [ ] Clean code
-   [ ] Comentários JSDoc
-   [ ] Barrel exports (index.ts)

## � Ver Também

-   [API_SPECIFICATION.md](./API_SPECIFICATION.md) - Especificação completa
-   [EXAMPLES.md](./EXAMPLES.md) - Exemplos de código
