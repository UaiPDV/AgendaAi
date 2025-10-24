# 📂 Estrutura do Projeto AgendaAi

> **Nota**: Para detalhes sobre a API, consulte
> [`API_SPECIFICATION.md`](./API_SPECIFICATION.md)

## 📁 Organização de Pastas

```
src/
├── app/                          # App Router (Next.js 15)
│   ├── (app)/                   # Cliente (autenticado)
│   ├── (auth)/                  # Login/Registro
│   └── (busines)/               # Estabelecimento (autenticado)
│
├── components/                   # Componentes React
│   ├── ui/                      # Componentes base reutilizáveis
│   ├── features/                # Componentes de features
│   ├── layout/                  # Sidebar, TopBar, MobileNav
│   └── modals/                  # Modais
│
├── hooks/                        # Hooks customizados
├── lib/                          # Utilitários e API client
├── types/                        # Tipos TypeScript
├── constants/                    # Constantes
├── contexts/                     # Contextos React
├── config/                       # Configurações
└── styles/                       # CSS global
```

## 🎯 Princípios de Organização

1. **Clean Architecture**: Separação clara de responsabilidades
2. **Componentes Atômicos**: UI reutilizável
3. **Hooks Customizados**: Lógica de negócio isolada
4. **Tipagem Forte**: TypeScript em 100% do código
5. **Exports Centralizados**: `index.ts` em cada pasta

## 📦 Padrão de Imports

```tsx
import { useTheme, useSidebar } from '@/hooks';
import { Logo, Switch } from '@/components/ui';
import { applyTheme } from '@/lib/utils';
import { STORAGE_KEYS } from '@/constants';
import { Theme } from '@/types';
```
