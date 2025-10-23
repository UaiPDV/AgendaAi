# Sistema de Autenticação

Este documento explica como usar o sistema de autenticação implementado no
projeto.

## Estrutura de Arquivos

```
src/
├── lib/utils/auth.ts       # Funções utilitárias de autenticação
├── hooks/useAuth.ts        # Hooks customizados de autenticação
├── types/auth.ts           # Tipos TypeScript relacionados à autenticação
└── app/
    ├── page.tsx            # Página inicial com redirecionamento automático
    └── Login/page.tsx      # Página de login
```

## Funções Utilitárias (`src/lib/utils/auth.ts`)

### `isAuthenticated(): boolean`

Verifica se o usuário está autenticado (possui token válido).

```typescript
import { isAuthenticated } from '@/lib/utils';

if (isAuthenticated()) {
	console.log('Usuário autenticado');
}
```

### `saveAuthToken(token: string): void`

Salva o token de autenticação no localStorage.

```typescript
import { saveAuthToken } from '@/lib/utils';

saveAuthToken('seu-jwt-token-aqui');
```

### `removeAuthToken(): void`

Remove o token de autenticação (logout).

```typescript
import { removeAuthToken } from '@/lib/utils';

removeAuthToken(); // Faz logout do usuário
```

### `getAuthToken(): string | null`

Obtém o token de autenticação armazenado.

```typescript
import { getAuthToken } from '@/lib/utils';

const token = getAuthToken();
```

## Hooks Customizados (`src/hooks/useAuth.ts`)

### `useAuthRedirect(options)`

Hook para redirecionar automaticamente baseado no status de autenticação.

**Opções:**

-   `authenticatedRedirect`: URL para redirecionar se autenticado (padrão:
    `/Agendar`)
-   `unauthenticatedRedirect`: URL para redirecionar se não autenticado (padrão:
    `/Login`)
-   `requireAuth`: Se `true`, requer autenticação (padrão: `false`)

**Exemplo 1: Página que redireciona baseado em autenticação**

```typescript
'use client';

import { useAuthRedirect } from '@/hooks';

export default function Home() {
	// Redireciona usuários autenticados para /Agendar
	// Redireciona usuários não autenticados para /Login
	useAuthRedirect({
		authenticatedRedirect: '/Agendar',
		unauthenticatedRedirect: '/Login',
	});

	return <div>Redirecionando...</div>;
}
```

**Exemplo 2: Página protegida que requer autenticação**

```typescript
'use client';

import { useAuthRedirect } from '@/hooks';

export default function ProtectedPage() {
	// Redireciona usuários não autenticados para /Login
	useAuthRedirect({
		requireAuth: true,
		unauthenticatedRedirect: '/Login',
	});

	return <div>Conteúdo protegido</div>;
}
```

### `useAuth(): boolean`

Hook simples que retorna se o usuário está autenticado.

```typescript
'use client';

import { useAuth } from '@/hooks';

export default function MyComponent() {
	const isAuthenticated = useAuth();

	return (
		<div>
			{isAuthenticated ? <p>Bem-vindo!</p> : <p>Por favor, faça login</p>}
		</div>
	);
}
```

## Tipos TypeScript (`src/types/auth.ts`)

### `User`

Interface que representa um usuário autenticado.

```typescript
interface User {
	id: string;
	email: string;
	name: string;
}
```

### `LoginCredentials`

Interface para credenciais de login.

```typescript
interface LoginCredentials {
	email: string;
	password: string;
}
```

### `AuthResponse`

Interface para resposta de autenticação da API.

```typescript
interface AuthResponse {
	token: string;
	user: User;
}
```

### `AuthState`

Interface para o estado de autenticação.

```typescript
interface AuthState {
	isAuthenticated: boolean;
	user: User | null;
	token: string | null;
}
```

## Exemplo de Uso Completo

### 1. Página de Login

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveAuthToken } from '@/lib/utils';
import type { LoginCredentials } from '@/types';

export default function LoginPage() {
	const router = useRouter();
	const [credentials, setCredentials] = useState<LoginCredentials>({
		email: '',
		password: '',
	});

	const handleLogin = async (e: FormEvent) => {
		e.preventDefault();

		// Chamar API de login
		const response = await fetch('/api/auth/login', {
			method: 'POST',
			body: JSON.stringify(credentials),
		});

		const data = await response.json();
		saveAuthToken(data.token);

		// Redirecionar para área autenticada
		router.push('/Agendar');
	};

	return <form onSubmit={handleLogin}>...</form>;
}
```

### 2. Botão de Logout

```typescript
'use client';

import { useRouter } from 'next/navigation';
import { removeAuthToken } from '@/lib/utils';

export function LogoutButton() {
	const router = useRouter();

	const handleLogout = () => {
		removeAuthToken();
		router.push('/Login');
	};

	return <button onClick={handleLogout}>Sair</button>;
}
```

### 3. Página Protegida

```typescript
'use client';

import { useAuthRedirect } from '@/hooks';

export default function ProtectedPage() {
	useAuthRedirect({
		requireAuth: true,
		unauthenticatedRedirect: '/Login',
	});

	return (
		<div>
			<h1>Conteúdo Protegido</h1>
			<p>Apenas usuários autenticados podem ver isso</p>
		</div>
	);
}
```

## Próximos Passos

1. **Integrar com API real**: Substituir a lógica mock na página de login por
   chamadas reais à sua API
2. **Adicionar refresh token**: Implementar lógica de renovação automática de
   tokens
3. **Criar contexto de autenticação**: Para compartilhar dados do usuário em
   toda a aplicação
4. **Adicionar interceptor**: Para adicionar automaticamente o token em todas as
   requisições HTTP
5. **Implementar proteção de rotas**: Middleware para proteger rotas no lado do
   servidor

## Notas Importantes

-   ⚠️ **Segurança**: O token está sendo armazenado no localStorage. Para maior
    segurança, considere usar httpOnly cookies
-   ⚠️ **SSR**: As funções de autenticação verificam se `window` existe antes de
    acessar localStorage (compatível com SSR)
-   ✅ **Tipagem**: Todas as funções e hooks são totalmente tipados com
    TypeScript
-   ✅ **Código Limpo**: Lógica de autenticação separada em arquivos dedicados
