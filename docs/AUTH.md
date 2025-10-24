# 🔐 Sistema de Autenticação

> **Nota**: Para detalhes da API de autenticação, consulte
> [`API_SPECIFICATION.md`](./API_SPECIFICATION.md#autenticação)

## 📁 Arquivos

```
src/
├── lib/utils/auth.ts       # Funções utilitárias
├── hooks/useAuth.ts        # Hook de autenticação
└── types/auth.ts           # Tipos TypeScript
```

## 🔧 Funções Utilitárias

```typescript
import { isAuthenticated, saveAuthToken, removeAuthToken } from '@/lib/utils';

// Verificar se está autenticado
if (isAuthenticated()) {
	console.log('Usuário logado');
}

// Salvar token (após login)
saveAuthToken('seu-jwt-token');

// Remover token (logout)
removeAuthToken();
```

## 🎣 Hook useAuth

```typescript
import { useAuth, useAuthRedirect } from '@/hooks';

// Verificar autenticação
function Component() {
	const isAuthenticated = useAuth();
	return <div>{isAuthenticated ? 'Logado' : 'Não logado'}</div>;
}

// Redirecionar automaticamente
function ProtectedPage() {
	useAuthRedirect({
		requireAuth: true,
		unauthenticatedRedirect: '/Login',
	});

	return <div>Conteúdo protegido</div>;
}
```

## 📊 Fluxo de Autenticação

```typescript
// 1. Login
const response = await fetch('/api/auth/login', {
	method: 'POST',
	body: JSON.stringify({ email, senha }),
});

const { token, user } = await response.json();
saveAuthToken(token);

// 2. Requisições autenticadas
const token = getAuthToken();
fetch('/api/agendamentos', {
	headers: {
		Authorization: `Bearer ${token}`,
	},
});

// 3. Logout
removeAuthToken();
router.push('/Login');
```

## ⚠️ Notas de Segurança

-   Token armazenado no `localStorage`
-   Para produção: considerar `httpOnly` cookies
-   Token expira em 7 dias (configurável na API)

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
```
