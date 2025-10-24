# Sistema de Autenticação - AgendaAi

## 📋 Visão Geral

Sistema completo de autenticação implementado seguindo princípios de **Clean
Architecture** e **Clean Code**, com suporte para dois tipos de usuários:
**Cliente** e **Estabelecimento**.

## 🏗️ Arquitetura

### Estrutura de Pastas

```
src/
├── types/auth.ts                    # Tipos TypeScript
├── constants/storage.ts             # Constantes de localStorage
├── lib/
│   ├── api.ts                       # Config da API
│   ├── services/
│   │   └── auth.service.ts          # Serviço de autenticação
│   └── utils/
│       └── auth.ts                  # Utilitários de auth
├── hooks/
│   ├── useAuth.ts                   # Hook de redirecionamento
│   └── useAuthentication.ts         # Hook completo de auth
├── components/
│   ├── features/auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterClienteForm.tsx
│   │   └── RegisterEstabelecimentoForm.tsx
│   └── ui/
│       └── LogoutButton.tsx
└── app/
    ├── Login/page.tsx
    ├── cadastro/
    │   ├── cliente/page.tsx
    │   └── estabelecimento/page.tsx
    ├── (app)/configuracoes/page.tsx
    └── (busines)/estabelecimento/configuracoes/page.tsx
```

## 🔐 Funcionalidades

### ✅ Implementado

-   **Login**

    -   Interface única com tabs para Cliente/Estabelecimento
    -   Validação de campos
    -   Feedback de erros
    -   Loading states
    -   Redirecionamento automático baseado no tipo de usuário

-   **Cadastro de Cliente**

    -   Campos: nome, email, senha, telefone, CPF, data de nascimento
    -   Validação de email e senha mínima (6 caracteres)
    -   Campos opcionais claramente marcados

-   **Cadastro de Estabelecimento**

    -   Campos: nome, email, senha, telefone, endereço
    -   Design diferenciado (gradiente roxo/rosa)
    -   Campos opcionais

-   **Logout**

    -   Botão em páginas de configurações
    -   Limpa token e dados do usuário
    -   Redireciona para login

-   **Persistência**
    -   Token JWT salvo no localStorage
    -   Dados do usuário salvos no localStorage
    -   Tipo de usuário identificado automaticamente

## 📡 Integração com API

### Endpoints

```typescript
POST /api/auth/login
Body: { email, senha }
Response: { token, user }

POST /api/auth/register
Body: { nome, email, senha, telefone?, cpf?, data_nascimento? }
Response: { token, user }

POST /api/auth/register/estabelecimento
Body: { nome, email, senha, telefone?, endereco? }
Response: { token, user }
```

### Headers Automáticos

```typescript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {token}'  // Quando token fornecido
}
```

## 🎯 Uso

### Hook de Autenticação Completo

```typescript
import { useAuthentication } from '@/hooks';

function MyComponent() {
	const {
		user, // Dados do usuário
		userType, // 'cliente' | 'estabelecimento'
		isAuthenticated, // Boolean
		isLoading, // Boolean
		error, // string | null
		login, // Função de login
		registerCliente, // Função de cadastro cliente
		registerEstabelecimento, // Função de cadastro estabelecimento
		logout, // Função de logout
		clearError, // Limpa mensagem de erro
	} = useAuthentication();

	// ...
}
```

### Formulário de Login

```typescript
import { LoginForm } from '@/components/features/auth';

<LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />;
```

### Formulário de Cadastro Cliente

```typescript
import { RegisterClienteForm } from '@/components/features/auth';

<RegisterClienteForm
	onSubmit={handleRegister}
	isLoading={isLoading}
	error={error}
/>;
```

### Botão de Logout

```typescript
import { LogoutButton } from '@/components/ui';

// Variante padrão
<LogoutButton />

// Variante danger (vermelho destacado)
<LogoutButton variant="danger" fullWidth />

// Variante link
<LogoutButton variant="link" />
```

### Utilitários de Autenticação

```typescript
import {
	isAuthenticated,
	getUserData,
	getUserType,
	isCliente,
	isEstabelecimento,
	logout,
	saveAuthToken,
	getAuthToken,
} from '@/lib/utils/auth';

// Verificar se está autenticado
if (isAuthenticated()) {
	// Usuário logado
}

// Obter dados do usuário
const user = getUserData();

// Verificar tipo de usuário
if (isCliente()) {
	// É um cliente
}

if (isEstabelecimento()) {
	// É um estabelecimento
}

// Fazer logout
logout();
```

## 🎨 UI/UX

### Design System

-   **Cores**

    -   Cliente: Gradiente azul/índigo
    -   Estabelecimento: Gradiente roxo/rosa
    -   Erro: Vermelho (red-600)
    -   Sucesso: Azul (blue-600)

-   **Componentes**

    -   Inputs com focus states
    -   Botões com loading states
    -   Mensagens de erro destacadas
    -   Transições suaves

-   **Responsividade**
    -   Mobile-first
    -   Max-width 28rem (448px)
    -   Padding adequado em todas as telas

### Acessibilidade

-   Labels em todos os inputs
-   Placeholders informativos
-   Feedback visual de erros
-   Estados disabled visualmente distintos
-   ARIA labels quando necessário

## 🔒 Segurança

### Implementado

-   ✅ Senhas com mínimo de 6 caracteres
-   ✅ Validação de email
-   ✅ Token JWT armazenado de forma segura
-   ✅ Limpeza de dados ao fazer logout
-   ✅ Headers de Authorization automáticos

### A Implementar (Produção)

-   [ ] Validação de força de senha
-   [ ] Confirmação de senha no cadastro
-   [ ] Rate limiting no login
-   [ ] Refresh tokens
-   [ ] httpOnly cookies (ao invés de localStorage)
-   [ ] CSRF protection
-   [ ] 2FA (Two-Factor Authentication)

## 🧪 Testando

### 1. Iniciar API

```bash
cd api
npm run dev
```

### 2. Iniciar Frontend

```bash
npm run dev
```

### 3. Testar Fluxos

**Cadastro de Cliente:**

1. Acessar http://localhost:3000/cadastro/cliente
2. Preencher formulário
3. Clicar em "Criar Conta"
4. Verificar redirecionamento para `/Agendar`

**Cadastro de Estabelecimento:**

1. Acessar http://localhost:3000/cadastro/estabelecimento
2. Preencher formulário
3. Clicar em "Criar Conta"
4. Verificar redirecionamento para `/estabelecimento`

**Login:**

1. Acessar http://localhost:3000/Login
2. Escolher tab (Cliente ou Estabelecimento)
3. Inserir credenciais
4. Verificar redirecionamento correto

**Logout:**

1. Ir para Configurações
2. Clicar em "Sair da Conta"
3. Verificar redirecionamento para `/Login`
4. Verificar que dados foram limpos do localStorage

## 📝 Tipos TypeScript

### Principais Interfaces

```typescript
// Usuário Cliente
interface Cliente {
	id: string;
	nome: string;
	email: string;
	telefone?: string;
	cpf?: string;
	data_nascimento?: string;
	tipo: 'cliente';
}

// Estabelecimento
interface Estabelecimento {
	id: number;
	nome: string;
	email: string;
	telefone?: string;
	endereco?: string;
	imagem?: string;
	avaliacao?: number;
	total_avaliacoes?: number;
	horario_funcionamento?: string;
	tipo: 'estabelecimento';
}

// União de tipos
type User = Cliente | Estabelecimento;

// Credenciais de login
interface LoginCredentials {
	email: string;
	senha: string;
}

// Resposta da API
interface AuthResponse {
	token: string;
	user: User;
}
```

## 🚀 Próximos Passos

1. **Implementar "Esqueci Minha Senha"**
2. **Adicionar validação de CPF**
3. **Máscara de formatação para telefone e CPF**
4. **Implementar refresh tokens**
5. **Adicionar testes unitários**
6. **Implementar 2FA**
7. **Adicionar proteção de rotas no middleware**
8. **Implementar verificação de email**

## 🔗 Referências

-   [API Specification](../../../docs/API_SPECIFICATION.md)
-   [Clean Architecture](../../../docs/STRUCTURE.md)
-   [Next.js Auth Patterns](https://nextjs.org/docs/authentication)

---

**Status**: ✅ Completo e funcional  
**Última Atualização**: 23 de Outubro de 2025
