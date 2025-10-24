# Exemplos de Uso - AgendaAi

> 💡 Para estrutura completa e padrões de arquitetura, veja
> [API_SPECIFICATION.md](./API_SPECIFICATION.md) e
> [STRUCTURE.md](./STRUCTURE.md).

## 🎨 Componentes UI

### Switch

```tsx
import { Switch } from '@/components/ui';
import { useTheme } from '@/hooks';

const { theme, toggleTheme } = useTheme();
<Switch
	checked={theme === 'dark'}
	onCheckedChange={toggleTheme}
	label="Modo Escuro"
/>;
```

### SettingsCard

```tsx
import { SettingsCard, SettingsItem, Switch } from '@/components/ui';

<SettingsCard title="Preferências">
	<SettingsItem
		label="Notificações"
		description="Receba alertas sobre novos agendamentos"
		control={<Switch checked={true} onCheckedChange={() => {}} />}
	/>
</SettingsCard>;
```

## 🎣 Hooks

### useTheme

```tsx
import { useTheme } from '@/hooks';

const { theme, toggleTheme } = useTheme();
```

### useSidebar

```tsx
import { useSidebar } from '@/hooks';

const { collapsed, toggle, setCollapsed } = useSidebar();
```

## 🛠️ Utilitários

### Tema

```tsx
import { getInitialTheme, saveTheme, applyTheme } from '@/lib/utils';

const theme = getInitialTheme();
saveTheme('dark');
applyTheme('dark');
```

### Eventos

```tsx
import { dispatchCustomEvent, addCustomEventListener } from '@/lib/utils';
import { CUSTOM_EVENTS } from '@/constants';

dispatchCustomEvent(CUSTOM_EVENTS.SIDEBAR_TOGGLE, { collapsed: true });

const cleanup = addCustomEventListener(
	CUSTOM_EVENTS.SIDEBAR_TOGGLE,
	(event) => {
		console.log(event.detail);
	}
);
```

## 📝 Tipos

```tsx
import { Theme, NavItemData, PropsWithChildren } from '@/types';

const theme: Theme = 'dark';

const navItem: NavItemData = {
	href: '/home',
	icon: Home,
	label: 'Início',
};
```

## 🎯 Constantes

```tsx
import { STORAGE_KEYS, CUSTOM_EVENTS } from '@/constants';

localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
window.dispatchEvent(new CustomEvent(CUSTOM_EVENTS.SIDEBAR_TOGGLE));
```

## 🏗️ Criando Componente

```tsx
// src/components/ui/MyComponent.tsx
interface MyComponentProps {
	label: string;
	onClick?: () => void;
}

export function MyComponent({ label, onClick }: MyComponentProps) {
	return <button onClick={onClick}>{label}</button>;
}

// src/components/ui/index.ts
export { MyComponent } from './MyComponent';
```

## 📦 Padrão de Imports

```tsx
// Bibliotecas externas
import { useState } from 'react';

// Tipos
import { Theme } from '@/types';

// Hooks
import { useTheme } from '@/hooks';

// Utils
import { applyTheme } from '@/lib/utils';

// Constantes
import { STORAGE_KEYS } from '@/constants';

// Componentes
import { Button } from '@/components/ui';
```

---

💡 **Dica**: Use imports centralizados via `index.ts` para código limpo!
