# Clean Architecture - Área do Cliente (app)

## 📋 Visão Geral

Esta pasta foi refatorada seguindo os princípios de **Clean Code** e **Clean
Architecture**, com foco em:

-   Componentização extrema
-   Separação de responsabilidades
-   Reutilização de código
-   Facilidade de manutenção e teste

## 🏗️ Estrutura

```
src/
├── app/(app)/              # Páginas (apenas composição)
├── components/
│   ├── ui/
│   │   └── app/           # Componentes UI base reutilizáveis
│   └── features/          # Componentes específicos por feature
│       ├── agendamentos/
│       ├── agendar/
│       ├── avaliacoes/
│       ├── dados/
│       ├── financas/
│       ├── notificacoes/
│       └── pagamentos/
├── hooks/                 # Hooks customizados
├── constants/             # Constantes da aplicação
└── lib/utils/            # Funções utilitárias
    ├── formatters.ts     # Formatação de dados
    └── validators.ts     # Validações
```

## 🎨 Componentes UI Base

Localizados em `components/ui/app/`:

### Layout

-   **PageContainer**: Container principal de página
-   **PageHeader**: Cabeçalho padrão com ícone, título e descrição
-   **GridContainer**: Grid responsivo para cards

### Interação

-   **SearchBar**: Barra de pesquisa reutilizável
-   **FilterButtons**: Botões de filtro genéricos
-   **ActionButton**: Botão de ação com variantes
-   **FormField**: Campo de formulário com ícone e label

### Feedback

-   **EmptyState**: Estado vazio genérico
-   **SuccessToast**: Toast de sucesso
-   **StatCard**: Card de estatística

## 🔧 Componentes de Features

Localizados em `components/features/`:

Cada feature possui seus componentes específicos:

### Agendamentos

-   `AgendamentosFilters`: Filtros de status
-   `AgendamentosList`: Lista de agendamentos

### Agendar

-   `EstabelecimentosList`: Lista de estabelecimentos

### Avaliações

-   `RatingStars`: Seletor de estrelas
-   `AvaliacaoForm`: Formulário de avaliação
-   `AvaliacaoItem`: Item individual de avaliação
-   `AvaliacaoInfo`: Informações da avaliação

### Dados

-   `DadosForm`: Formulário de dados pessoais

### Finanças

-   `FinancasStats`: Estatísticas financeiras
-   `TransactionList`: Lista de transações
-   `TransactionItem`: Item de transação

### Notificações

-   `NotificationSettings`: Configurações de notificação
-   `PreferenceToggle`: Toggle de preferência

### Pagamentos

-   `AddPaymentButton`: Botão de adicionar pagamento
-   `PaymentMethodCard`: Card de método de pagamento
-   `PaymentMethodsList`: Lista de métodos

## 🪝 Hooks Customizados

### Hooks de Domínio

-   `useAgendamentos`: Gerencia agendamentos
-   `useEstabelecimentos`: Gerencia estabelecimentos
-   `useAvaliacoes`: Gerencia avaliações
-   `useFinancas`: Gerencia finanças
-   `usePagamentos`: Gerencia métodos de pagamento
-   `useUsuario`: Gerencia dados do usuário

### Hooks Utilitários

-   `useSuccessToast`: Toast de sucesso com URL param
-   `useFilter`: Gerencia filtros de lista
-   `useFilteredData`: Filtra dados por status
-   `useSearch`: Busca em lista
-   `useForm`: Gerencia estado de formulários

## 📦 Utils e Formatters

### Formatters (`lib/utils/formatters.ts`)

```typescript
formatarData(dataStr: string): string
formatarMoeda(valor: number): string
formatarTelefone(telefone: string): string
formatarCPF(cpf: string): string
```

### Validators (`lib/utils/validators.ts`)

```typescript
validarCPF(cpf: string): boolean
validarEmail(email: string): boolean
validarTelefone(telefone: string): boolean
```

## 🎯 Constants

### App Constants (`constants/app.ts`)

-   `AGENDAMENTO_STATUS`: Status de agendamentos
-   `AGENDAMENTO_STATUS_LABELS`: Labels dos status
-   `PAGAMENTO_STATUS`: Status de pagamentos
-   `TIPO_PAGAMENTO`: Tipos de pagamento
-   `TIPO_PAGAMENTO_ICONS`: Ícones dos tipos
-   `RATING_OPTIONS`: Opções de avaliação (1-5)

## 📄 Padrão de Páginas

As páginas agora são **extremamente simples** e apenas compõem componentes:

```typescript
'use client';

import { useData } from '@/hooks';
import { LoadingSpinner, ErrorMessage } from '@/components/ui';
import { PageContainer, PageHeader } from '@/components/ui/app';
import { FeatureComponent } from '@/components/features/feature';
import { Icon } from 'lucide-react';

export default function Page() {
	const { data, loading, error } = useData();

	return (
		<PageContainer>
			<PageHeader
				icon={Icon}
				title="Título"
				description="Descrição"
				iconColor="text-color"
			/>

			{loading && <LoadingSpinner />}
			{error && <ErrorMessage message={error} />}

			{!loading && !error && <FeatureComponent data={data} />}
		</PageContainer>
	);
}
```

## ✅ Benefícios da Refatoração

### 1. **Separação de Responsabilidades**

-   Páginas apenas compõem componentes
-   Lógica de negócio nos hooks
-   Lógica de apresentação nos componentes
-   Utilitários em arquivos separados

### 2. **Reutilização**

-   Componentes UI base usados em múltiplas páginas
-   Hooks compartilhados entre features
-   Utils e formatters centralizados

### 3. **Manutenibilidade**

-   Código organizado e fácil de encontrar
-   Componentes pequenos e focados
-   Baixo acoplamento

### 4. **Testabilidade**

-   Componentes isolados e testáveis
-   Hooks podem ser testados independentemente
-   Utils têm funções puras

### 5. **Escalabilidade**

-   Fácil adicionar novas features
-   Padrões estabelecidos e consistentes
-   Estrutura clara e intuitiva

## 🚀 Próximos Passos

1. **Testes Unitários**: Adicionar testes para componentes e hooks
2. **Storybook**: Documentar componentes visualmente
3. **Performance**: Implementar lazy loading e code splitting
4. **Acessibilidade**: Melhorar ARIA labels e navegação por teclado
5. **Documentação**: Adicionar JSDoc para todos os componentes

## 📚 Referências

-   [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
-   [React Best Practices](https://react.dev/learn/thinking-in-react)
-   [Component Composition](https://react.dev/learn/passing-props-to-a-component)
