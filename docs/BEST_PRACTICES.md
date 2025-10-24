# 📚 Guia de Boas Práticas - Clean Architecture

## 🎯 Princípios Fundamentais

### 1. Páginas são Apenas Composição

```typescript
// ✅ BOM - Página limpa e focada
export default function Page() {
	const { data, loading, error } = useData();

	return (
		<PageContainer>
			<PageHeader {...headerProps} />
			<FeatureComponent data={data} />
		</PageContainer>
	);
}

// ❌ RUIM - Página com lógica
export default function Page() {
	const [data, setData] = useState([]);
	const [filter, setFilter] = useState('');

	useEffect(() => {
		// Lógica complexa aqui
	}, []);

	const handleClick = () => {
		// Mais lógica aqui
	};

	return <div>{/* 100 linhas de JSX */}</div>;
}
```

### 2. Componentes são Apresentação

```typescript
// ✅ BOM - Componente focado na apresentação
interface Props {
	title: string;
	onAction: () => void;
}

export function Component({ title, onAction }: Props) {
	return (
		<div>
			<h1>{title}</h1>
			<button onClick={onAction}>Ação</button>
		</div>
	);
}

// ❌ RUIM - Componente com lógica de negócio
export function Component() {
	const [data, setData] = useState([]);

	useEffect(() => {
		fetch('/api/data')
			.then((res) => res.json())
			.then(setData);
	}, []);

	return <div>{/* ... */}</div>;
}
```

### 3. Hooks Encapsulam Lógica

```typescript
// ✅ BOM - Hook com lógica isolada
export function useData() {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		// Lógica complexa aqui
	}, []);

	return { data, loading, error };
}

// ❌ RUIM - Lógica espalhada
// (sem hook, lógica na página ou componente)
```

### 4. Utils são Funções Puras

```typescript
// ✅ BOM - Função pura
export function formatarData(dataStr: string): string {
	const [ano, mes, dia] = dataStr.split('-');
	return `${dia}/${mes}/${ano}`;
}

// ❌ RUIM - Função com efeitos colaterais
export function formatarData(dataStr: string): string {
	console.log('Formatando data...'); // Side effect
	localStorage.setItem('lastDate', dataStr); // Side effect
	return `${dia}/${mes}/${ano}`;
}
```

## 📂 Organização de Arquivos

### Estrutura de Componente

```typescript
// components/features/example/ExampleComponent.tsx

import { ReactNode } from 'react';
import { Icon } from 'lucide-react';

/**
 * Componente de exemplo
 * @param title - Título do componente
 * @param children - Conteúdo
 */
interface ExampleComponentProps {
	title: string;
	children: ReactNode;
}

export function ExampleComponent({ title, children }: ExampleComponentProps) {
	return (
		<div>
			<h2>{title}</h2>
			{children}
		</div>
	);
}
```

### Estrutura de Hook

```typescript
// hooks/useExample.ts

import { useState, useEffect } from 'react';

/**
 * Hook para gerenciar exemplo
 * @returns Estado e funções do exemplo
 */
export function useExample() {
	const [data, setData] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		// Lógica aqui
	}, []);

	return {
		data,
		loading,
		addItem: (item: string) => setData((prev) => [...prev, item]),
	};
}
```

### Estrutura de Utils

```typescript
// lib/utils/example.ts

/**
 * Formata um valor para exibição
 * @param value - Valor a ser formatado
 * @returns Valor formatado
 */
export function formatValue(value: number): string {
	return new Intl.NumberFormat('pt-BR').format(value);
}
```

## 🎨 Componentização

### Quando Criar um Componente

✅ **CRIE** um componente quando:

-   O código se repete em 2+ lugares
-   Uma parte da UI tem responsabilidade única
-   Você quer testar isoladamente
-   A complexidade está crescendo

❌ **NÃO CRIE** um componente quando:

-   É usado apenas uma vez e é simples
-   Adiciona complexidade desnecessária
-   Quebra a coesão da página

### Tamanho de Componentes

```typescript
// ✅ IDEAL - 20-50 linhas
export function SmallComponent() {
	return <div>{/* Conteúdo focado e claro */}</div>;
}

// ⚠️ ATENÇÃO - 50-100 linhas
// Considere quebrar em subcomponentes

// ❌ GRANDE DEMAIS - 100+ linhas
// DEFINITIVAMENTE quebre em componentes menores
```

## 🔧 Hooks Customizados

### Quando Criar um Hook

✅ **CRIE** um hook quando:

-   Lógica é reutilizada em múltiplos componentes
-   Estado e efeitos estão relacionados
-   Você quer isolar lógica complexa
-   Facilita testes

❌ **NÃO CRIE** um hook quando:

-   É uma função simples sem estado (use util)
-   É específico de um único componente
-   Adiciona complexidade sem benefício

### Boas Práticas

```typescript
// ✅ BOM - Hook focado e reutilizável
export function useFilter<T>(defaultValue: T) {
	const [filter, setFilter] = useState<T>(defaultValue);
	return { filter, setFilter };
}

// ✅ BOM - Hook com múltiplas responsabilidades relacionadas
export function useForm<T>(initialState: T) {
	const [formData, setFormData] = useState<T>(initialState);
	const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

	const validate = () => {
		// Validação
	};

	const submit = async () => {
		if (validate()) {
			// Submit
		}
	};

	return { formData, errors, setFormData, submit };
}

// ❌ RUIM - Hook fazendo muita coisa não relacionada
export function useEverything() {
	// Gerencia dados
	// Gerencia UI
	// Gerencia navegação
	// Gerencia autenticação
	// ... muito mais
}
```

## 📦 Utils e Formatters

### Funções Puras

```typescript
// ✅ BOM - Função pura, testável
export function calcularDesconto(valor: number, percentual: number): number {
	return valor * (percentual / 100);
}

// ❌ RUIM - Função com side effects
export function calcularDesconto(valor: number, percentual: number): number {
	console.log('Calculando...'); // Side effect
	const resultado = valor * (percentual / 100);
	salvarHistorico(resultado); // Side effect
	return resultado;
}
```

### Formatadores

```typescript
// ✅ BOM - Formatador específico e claro
export function formatarMoeda(valor: number): string {
	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL',
	}).format(valor);
}

// ✅ BOM - Formatador com opções
export function formatarData(
	data: string,
	formato: 'curto' | 'longo' = 'curto'
): string {
	// Implementação
}
```

## 🎯 Nomenclatura

### Componentes

```typescript
// ✅ BOM - PascalCase, descritivo
PageHeader;
UserProfile;
TransactionList;
PaymentMethodCard;

// ❌ RUIM
header; // minúsculo
UserP; // muito curto
TheComponentThatShowsUserProfileInformation; // muito longo
```

### Hooks

```typescript
// ✅ BOM - use + verbo/substantivo
useData;
useFilter;
useForm;
useSuccessToast;

// ❌ RUIM
getData; // não começa com 'use'
useTheDataFromAPI; // muito verboso
useX; // muito genérico
```

### Utils

```typescript
// ✅ BOM - verbo + substantivo
formatarData;
validarCPF;
calcularTotal;

// ❌ RUIM
date; // muito genérico
cpf; // não é verbo
doStuff; // não é descritivo
```

## 🧪 Testabilidade

### Componentes Testáveis

```typescript
// ✅ BOM - Fácil de testar
interface Props {
	items: string[];
	onItemClick: (item: string) => void;
}

export function List({ items, onItemClick }: Props) {
	return (
		<ul>
			{items.map((item) => (
				<li key={item} onClick={() => onItemClick(item)}>
					{item}
				</li>
			))}
		</ul>
	);
}

// Teste:
// render(<List items={['a', 'b']} onItemClick={mockFn} />)
// fireEvent.click(screen.getByText('a'))
// expect(mockFn).toHaveBeenCalledWith('a')
```

### Hooks Testáveis

```typescript
// ✅ BOM - Hooks isolados são fáceis de testar
export function useCounter(initial: number = 0) {
	const [count, setCount] = useState(initial);

	const increment = () => setCount((c) => c + 1);
	const decrement = () => setCount((c) => c - 1);

	return { count, increment, decrement };
}

// Teste:
// const { result } = renderHook(() => useCounter(5))
// expect(result.current.count).toBe(5)
// act(() => result.current.increment())
// expect(result.current.count).toBe(6)
```

## 🚀 Performance

### Memoization

```typescript
// ✅ BOM - useMemo para cálculos pesados
const filteredData = useMemo(
	() => data.filter((item) => item.status === filter),
	[data, filter]
);

// ✅ BOM - useCallback para funções passadas para filhos
const handleClick = useCallback(
	(id: string) => {
		// handler
	},
	[dependencies]
);
```

### Evitar Re-renders

```typescript
// ✅ BOM - Componente memo para listas
export const ListItem = memo(({ item }: { item: Item }) => (
	<div>{item.name}</div>
));

// ✅ BOM - Separar estado que muda frequentemente
function Parent() {
	return (
		<>
			<StableComponent />
			<ChangingComponent />
		</>
	);
}
```

## 📚 Documentação

### JSDoc

```typescript
/**
 * Formata um valor monetário para exibição
 *
 * @param valor - Valor numérico a ser formatado
 * @param moeda - Código da moeda (padrão: 'BRL')
 * @returns String formatada com símbolo da moeda
 *
 * @example
 * formatarMoeda(1234.56) // "R$ 1.234,56"
 * formatarMoeda(1234.56, 'USD') // "$1,234.56"
 */
export function formatarMoeda(valor: number, moeda: string = 'BRL'): string {
	// Implementação
}
```

## ✅ Checklist de Qualidade

Antes de fazer commit, verifique:

-   [ ] Página tem menos de 100 linhas?
-   [ ] Componente tem responsabilidade única?
-   [ ] Hook está reutilizável?
-   [ ] Utils são funções puras?
-   [ ] Nomes são descritivos?
-   [ ] Props têm tipos definidos?
-   [ ] Componente é testável?
-   [ ] Sem código duplicado?
-   [ ] Sem lógica hardcoded?
-   [ ] Documentação está clara?

## 🎓 Recursos

-   [React Docs - Thinking in React](https://react.dev/learn/thinking-in-react)
-   [Clean Code - Robert C. Martin](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
-   [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
