# Exemplos de Uso - AgendaAi

## 🎨 Componentes UI

### Switch (Toggle)

```tsx
import { Switch } from '@/components/ui';
import { useTheme } from '@/hooks';

function Example() {
	const { theme, toggleTheme } = useTheme();

	return (
		<Switch
			checked={theme === 'dark'}
			onCheckedChange={toggleTheme}
			label="Modo Escuro"
		/>
	);
}
```

### SettingsCard

```tsx
import { SettingsCard, SettingsItem, Switch } from '@/components/ui';

function Example() {
	return (
		<SettingsCard title="Preferências">
			<SettingsItem
				label="Notificações"
				description="Receba alertas sobre novos agendamentos"
				control={<Switch checked={true} onCheckedChange={() => {}} />}
			/>
		</SettingsCard>
	);
}
```

### SettingsButton

```tsx
import { SettingsButton } from '@/components/ui';

function Example() {
	return (
		<>
			{/* Botão padrão com seta */}
			<SettingsButton showArrow onClick={() => alert('Clicked')}>
				Alterar Senha
			</SettingsButton>

			{/* Botão de perigo */}
			<SettingsButton
				variant="danger"
				onClick={() => confirm('Excluir?')}
			>
				Excluir Conta
			</SettingsButton>
		</>
	);
}
```

## 🎣 Hooks Customizados

### useTheme

```tsx
import { useTheme } from '@/hooks';

function ThemeToggleButton() {
	const { theme, toggleTheme } = useTheme();

	return (
		<button onClick={toggleTheme}>
			Tema Atual: {theme === 'dark' ? '🌙' : '☀️'}
		</button>
	);
}
```

### useSidebar

```tsx
import { useSidebar } from '@/hooks';

function SidebarController() {
	const { collapsed, toggle, setCollapsed } = useSidebar();

	return (
		<div>
			<p>Sidebar está {collapsed ? 'fechada' : 'aberta'}</p>
			<button onClick={toggle}>Toggle</button>
			<button onClick={() => setCollapsed(true)}>Fechar</button>
			<button onClick={() => setCollapsed(false)}>Abrir</button>
		</div>
	);
}
```

## 🛠️ Utilitários

### Gerenciamento de Tema

```tsx
import { getInitialTheme, saveTheme, applyTheme } from '@/lib/utils';

// Obter tema inicial (localStorage ou sistema)
const theme = getInitialTheme();

// Salvar tema
saveTheme('dark');

// Aplicar tema ao documento
applyTheme('dark');
```

### Gerenciamento de Sidebar

```tsx
import {
	getSidebarCollapsed,
	saveSidebarCollapsed,
	applySidebarCollapsed,
} from '@/lib/utils';

// Obter estado
const isCollapsed = getSidebarCollapsed();

// Salvar estado
saveSidebarCollapsed(true);

// Aplicar ao documento
applySidebarCollapsed(true);
```

### Eventos Customizados

```tsx
import { dispatchCustomEvent, addCustomEventListener } from '@/lib/utils';
import { CUSTOM_EVENTS } from '@/constants';

// Disparar evento
dispatchCustomEvent(CUSTOM_EVENTS.SIDEBAR_TOGGLE, {
	collapsed: true,
});

// Escutar evento
const cleanup = addCustomEventListener(
	CUSTOM_EVENTS.SIDEBAR_TOGGLE,
	(event) => {
		console.log('Sidebar toggled:', event.detail);
	}
);

// Limpar listener quando não precisar mais
cleanup();
```

## 📝 Tipos TypeScript

### Usando Tipos de Tema

```tsx
import { Theme, ThemeContextType } from '@/types';

const theme: Theme = 'dark';

const themeContext: ThemeContextType = {
	theme: 'dark',
	toggleTheme: () => {},
};
```

### Usando Tipos de Navegação

```tsx
import { NavItemData, NavSectionData } from '@/types';
import { Home, Settings } from 'lucide-react';

const navItem: NavItemData = {
	href: '/home',
	icon: Home,
	label: 'Início',
};

const navSection: NavSectionData = {
	title: 'Principal',
	items: [
		{ href: '/home', icon: Home, label: 'Início' },
		{ href: '/settings', icon: Settings, label: 'Configurações' },
	],
};
```

### Usando Tipos de Componentes

```tsx
import { PropsWithChildren, BaseComponentProps } from '@/types';

// Para componentes que recebem children
function Container({ children }: PropsWithChildren) {
	return <div>{children}</div>;
}

// Para componentes com props base
function Card({ children, className }: BaseComponentProps) {
	return <div className={className}>{children}</div>;
}
```

## 🎯 Constantes

### Storage Keys

```tsx
import { STORAGE_KEYS } from '@/constants';

// Usar constantes ao invés de strings hardcoded
localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, 'true');
```

### Eventos Customizados

```tsx
import { CUSTOM_EVENTS } from '@/constants';

// Disparar evento
window.dispatchEvent(
	new CustomEvent(CUSTOM_EVENTS.SIDEBAR_TOGGLE, {
		detail: { collapsed: true },
	})
);

// Escutar evento
window.addEventListener(CUSTOM_EVENTS.SIDEBAR_TOGGLE, handler);
```

### Classes CSS

```tsx
import { SIDEBAR_COLLAPSED_CLASS, DARK_CLASS } from '@/constants';

// Adicionar classes
document.documentElement.classList.add(SIDEBAR_COLLAPSED_CLASS);
document.documentElement.classList.add(DARK_CLASS);

// Remover classes
document.documentElement.classList.remove(SIDEBAR_COLLAPSED_CLASS);
```

## 🏗️ Criando Novo Componente

### Estrutura Padrão

````tsx
// src/components/ui/MyComponent.tsx
import { ReactNode } from 'react';

/**
 * Props do componente MyComponent
 */
interface MyComponentProps {
	/** Texto a ser exibido */
	label: string;
	/** Conteúdo filho */
	children?: ReactNode;
	/** Callback ao clicar */
	onClick?: () => void;
	/** Variante visual */
	variant?: 'primary' | 'secondary';
}

/**
 * Componente MyComponent
 *
 * @example
 * ```tsx
 * <MyComponent label="Clique aqui" variant="primary">
 *   Conteúdo
 * </MyComponent>
 * ```
 */
export function MyComponent({
	label,
	children,
	onClick,
	variant = 'primary',
}: MyComponentProps) {
	const variantClasses = {
		primary: 'bg-blue-500 text-white',
		secondary: 'bg-gray-500 text-white',
	};

	return (
		<button onClick={onClick} className={variantClasses[variant]}>
			{label}
			{children}
		</button>
	);
}
````

### Adicionar ao index.ts

```tsx
// src/components/ui/index.ts
export { MyComponent } from './MyComponent';
```

## 🎨 Criando Novo Hook

### Estrutura Padrão

````tsx
// src/hooks/useMyHook.ts
'use client';

import { useState, useEffect } from 'react';

/**
 * Hook customizado para gerenciar algo
 *
 * @returns Estado e funções de controle
 *
 * @example
 * ```tsx
 * function Component() {
 *   const { value, setValue } = useMyHook();
 *   return <div>{value}</div>;
 * }
 * ```
 */
export function useMyHook() {
	const [value, setValue] = useState<string>('');

	useEffect(() => {
		// Lógica de inicialização
	}, []);

	return {
		value,
		setValue,
	};
}
````

### Adicionar ao index.ts

```tsx
// src/hooks/index.ts
export { useMyHook } from './useMyHook';
```

## 🔧 Criando Nova Função Utilitária

### Estrutura Padrão

````tsx
// src/lib/utils/myUtil.ts

/**
 * Função utilitária para fazer algo
 *
 * @param input - Entrada da função
 * @returns Resultado processado
 *
 * @example
 * ```ts
 * const result = myUtil('input');
 * ```
 */
export function myUtil(input: string): string {
	// Lógica da função
	return input.toUpperCase();
}

/**
 * Outra função relacionada
 */
export function anotherUtil(): void {
	// Lógica
}
````

### Adicionar ao index.ts

```tsx
// src/lib/utils/index.ts
export * from './myUtil';
```

## 📦 Padrão de Imports Completo

```tsx
// 1. Imports de bibliotecas externas
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 2. Imports de tipos
import { Theme, NavItemData } from '@/types';

// 3. Imports de hooks
import { useTheme, useSidebar } from '@/hooks';

// 4. Imports de utilitários
import { applyTheme, dispatchCustomEvent } from '@/lib/utils';

// 5. Imports de constantes
import { STORAGE_KEYS, CUSTOM_EVENTS } from '@/constants';

// 6. Imports de componentes
import { Button, Switch } from '@/components/ui';
import { Sidebar, TopBar } from '@/components/layout';

// 7. Imports de estilos (se necessário)
import styles from './styles.module.css';
```

---

**💡 Dica**: Sempre use os imports centralizados via `index.ts` para manter o
código limpo e facilitar refatorações futuras!
