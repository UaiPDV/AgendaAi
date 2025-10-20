# Estrutura do Projeto AgendaAi

## 📁 Organização de Pastas

```
src/
├── app/                          # Rotas e páginas Next.js (App Router)
│   ├── layout.tsx               # Layout raiz da aplicação
│   ├── (app)/                   # Grupo de rotas do cliente
│   ├── (auth)/                  # Grupo de rotas de autenticação
│   └── (busines)/               # Grupo de rotas do estabelecimento
│
├── components/                   # Componentes React
│   ├── layout/                  # Componentes de layout (Sidebar, TopBar, etc)
│   │   └── index.ts            # Exportação central dos componentes de layout
│   ├── ui/                      # Componentes UI reutilizáveis
│   │   └── index.ts            # Exportação central dos componentes UI
│   ├── Providers.tsx            # Provider raiz da aplicação
│   └── ThemeToggle.tsx          # Componente de alternância de tema
│
├── config/                       # Configurações da aplicação
│   ├── fonts.ts                 # Configuração de fontes
│   ├── metadata.ts              # Metadados da aplicação
│   └── index.ts                 # Exportação central das configurações
│
├── constants/                    # Constantes da aplicação
│   ├── events.ts                # Eventos customizados
│   ├── sidebar.ts               # Constantes da sidebar
│   ├── storage.ts               # Chaves do localStorage
│   ├── theme.ts                 # Constantes de tema
│   └── index.ts                 # Exportação central das constantes
│
├── contexts/                     # Contextos React
│   └── ThemeContext.tsx         # Contexto de gerenciamento de tema
│
├── hooks/                        # Hooks customizados
│   ├── useSidebar.ts            # Hook para gerenciar sidebar
│   ├── useTheme.ts              # Hook para gerenciar tema
│   └── index.ts                 # Exportação central dos hooks
│
├── lib/                          # Bibliotecas e utilitários
│   ├── scripts/                 # Scripts inline (previnem flash)
│   │   ├── sidebar-init.ts     # Script de inicialização da sidebar
│   │   ├── theme-init.ts       # Script de inicialização do tema
│   │   └── index.ts            # Exportação central dos scripts
│   └── utils/                   # Funções utilitárias
│       ├── events.ts            # Utilitários de eventos
│       ├── sidebar.ts           # Utilitários da sidebar
│       ├── theme.ts             # Utilitários de tema
│       └── index.ts             # Exportação central dos utilitários
│
├── styles/                       # Arquivos de estilo
│   ├── animations.css           # Animações customizadas
│   └── globals.css              # Estilos globais
│
└── types/                        # Definições de tipos TypeScript
    ├── components.ts            # Tipos de componentes
    ├── css.d.ts                 # Tipos de módulos CSS
    ├── navigation.ts            # Tipos de navegação
    ├── theme.ts                 # Tipos de tema
    └── index.ts                 # Exportação central dos tipos
```

## 🎯 Princípios de Organização

### 1. **Separação de Responsabilidades**

-   Cada arquivo tem uma responsabilidade única
-   Scripts inline separados em arquivos próprios
-   Componentes separados por tipo (layout, ui)

### 2. **Tipagem Forte**

-   Todos os tipos centralizados em `src/types/`
-   Interfaces reutilizáveis exportadas centralmente
-   Uso consistente de TypeScript em toda aplicação

### 3. **Código Limpo**

-   Um componente por arquivo
-   Funções utilitárias separadas em `lib/utils/`
-   Constantes separadas em `constants/`
-   Hooks customizados em `hooks/`

### 4. **Exportações Centralizadas**

-   Cada pasta tem um arquivo `index.ts`
-   Facilita imports: `import { useTheme } from '@/hooks'`
-   Mantém a API pública organizada

### 5. **Performance**

-   Scripts de inicialização previnem flash visual
-   Estado gerenciado eficientemente com hooks
-   Hidratação otimizada com `suppressHydrationWarning`

## 📦 Imports Recomendados

### Componentes

```tsx
import { Logo, NavItem, Switch } from '@/components/ui';
import { Sidebar, TopBar } from '@/components/layout';
```

### Hooks

```tsx
import { useTheme, useSidebar } from '@/hooks';
```

### Tipos

```tsx
import { Theme, NavItemData } from '@/types';
```

### Utilitários

```tsx
import { applyTheme, dispatchCustomEvent } from '@/lib/utils';
```

### Constantes

```tsx
import { STORAGE_KEYS, CUSTOM_EVENTS } from '@/constants';
```

## 🔧 Convenções

### Nomenclatura

-   **Componentes**: PascalCase (`Button`, `NavItem`)
-   **Hooks**: camelCase com prefixo `use` (`useTheme`, `useSidebar`)
-   **Utilitários**: camelCase (`applyTheme`, `getSavedTheme`)
-   **Constantes**: UPPER_SNAKE_CASE (`STORAGE_KEYS`, `CUSTOM_EVENTS`)
-   **Tipos**: PascalCase (`Theme`, `NavItemData`)

### Estrutura de Arquivos

```tsx
// 1. Imports
import { ... } from '...';

// 2. Tipos/Interfaces
interface ComponentProps { ... }

// 3. Componente Principal
export function Component({ ... }: ComponentProps) {
  // Hooks
  const { ... } = useHook();

  // Estado local
  const [state, setState] = useState(...);

  // Efeitos
  useEffect(() => { ... }, []);

  // Handlers
  const handleClick = () => { ... };

  // Render
  return ( ... );
}

// 4. Funções Auxiliares (se necessário)
function helperFunction() { ... }
```

## 🚀 Próximos Passos

1. **Testes**: Adicionar pasta `__tests__/` ou arquivos `.test.tsx`
2. **Storybook**: Documentar componentes UI
3. **API**: Adicionar pasta `api/` para chamadas HTTP
4. **Features**: Agrupar por feature em vez de tipo (opcional)
