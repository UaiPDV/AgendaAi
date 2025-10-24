# 📘 Especificação Completa da API - AgendaAi

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Stack do Frontend](#stack-do-frontend)
3. [Arquitetura da API](#arquitetura-da-api)
4. [Autenticação](#autenticação)
5. [Endpoints](#endpoints)
6. [Modelos de Dados](#modelos-de-dados)
7. [Códigos de Status](#códigos-de-status)
8. [Validações](#validações)
9. [Notas de Implementação](#notas-de-implementação)

---

## 🎯 Visão Geral

O **AgendaAi** é uma plataforma completa de agendamentos online com duas
interfaces principais:

### 🧑‍💼 Área do Cliente

-   Buscar estabelecimentos (salões, barbearias, clínicas)
-   Agendar serviços com profissionais
-   Gerenciar agendamentos (visualizar, reagendar, cancelar)
-   Consultar histórico de serviços
-   Gerenciar perfil e dados pessoais
-   Gerenciar métodos de pagamento
-   Avaliar serviços recebidos
-   Configurar preferências de notificações
-   Acompanhar gastos e finanças pessoais

### 🏪 Área do Estabelecimento

-   Dashboard com métricas em tempo real
-   Agenda completa de agendamentos
-   Gerenciamento de serviços (CRUD)
-   Gerenciamento de profissionais (CRUD)
-   Visualização de clientes
-   Controle financeiro e faturamento
-   Histórico de agendamentos
-   Relatórios e estatísticas
-   Configurações do estabelecimento
-   Configuração de horários de funcionamento

---

## 🛠️ Stack do Frontend

### Tecnologias Principais

```json
{
	"framework": "Next.js 15.5.4",
	"react": "19.1.0",
	"typescript": "5.x",
	"styling": "Tailwind CSS 3.4.18",
	"icons": "Lucide React 0.546.0"
}
```

### Arquitetura do Frontend

```
src/
├── app/                          # App Router (Next.js 15)
│   ├── (app)/                   # Cliente (autenticado)
│   ├── (auth)/                  # Autenticação (Login/Registro)
│   └── (busines)/               # Estabelecimento (autenticado)
│
├── components/                   # Componentes React
│   ├── ui/                      # Componentes UI base reutilizáveis
│   │   ├── app/                # Componentes específicos área cliente
│   │   └── estabelecimento/    # Componentes específicos estabelecimento
│   ├── features/                # Componentes de features (agendamentos, etc)
│   ├── layout/                  # Sidebar, TopBar, MobileNav
│   └── modals/                  # Modais (NovoServicoModal, etc)
│
├── hooks/                        # Hooks customizados
│   ├── useAuth.ts               # Autenticação
│   ├── useAgendamentos.ts       # Gerenciar agendamentos
│   ├── useServicos.ts           # Gerenciar serviços
│   ├── useProfissionais.ts      # Gerenciar profissionais
│   ├── useEstabelecimentos.ts   # Listar estabelecimentos
│   ├── useUsuario.ts            # Dados do usuário
│   ├── useFinancas.ts           # Finanças
│   ├── usePagamentos.ts         # Métodos de pagamento
│   └── useAvaliacoes.ts         # Avaliações
│
├── lib/
│   ├── api.ts                   # Cliente HTTP (fetch/axios)
│   └── utils/                   # Funções utilitárias
│       ├── formatters.ts        # formatarData, formatarMoeda
│       └── validators.ts        # validarCPF, validarEmail
│
├── types/                        # Tipos TypeScript
│   ├── auth.ts
│   ├── cliente.ts
│   ├── estabelecimento.ts
│   └── index.ts
│
└── constants/                    # Constantes
    ├── app.ts                   # AGENDAMENTO_STATUS, etc
    └── storage.ts               # Chaves localStorage
```

### Padrão de Organização

#### ✅ Clean Architecture

-   **Páginas**: Apenas composição de componentes
-   **Componentes**: Apenas apresentação (UI)
-   **Hooks**: Lógica de negócio e estado
-   **Utils**: Funções puras (formatação, validação)
-   **Constants**: Valores estáticos centralizados

#### ✅ Componentização

-   Componentes atômicos e reutilizáveis
-   Props tipadas com TypeScript
-   Separação de responsabilidades
-   Exports centralizados via `index.ts`

#### ✅ Gerenciamento de Estado

-   Hooks customizados para cada domínio
-   Estado local com `useState`
-   Efeitos com `useEffect`
-   Memoization com `useMemo` quando necessário

---

## 🔐 Autenticação

### Método

-   **Token JWT** armazenado em `localStorage`
-   Chave: `'auth_token'`

### Fluxo de Login

```typescript
POST /api/auth/login
{
  "email": "usuario@exemplo.com",
  "senha": "123456"
}

Response (200):
{
  "success": true,
  "user": {
    "id": "uuid",
    "nome": "Nome do Usuário",
    "email": "usuario@exemplo.com",
    "tipo": "cliente" | "estabelecimento"
  },
  "token": "jwt_token_aqui"
}
```

### Fluxo de Registro (Cliente)

```typescript
POST /api/auth/register
{
  "nome": "Nome Completo",
  "email": "usuario@exemplo.com",
  "senha": "senha123",
  "telefone": "(11) 99999-9999",
  "cpf": "123.456.789-00",
  "dataNascimento": "1990-01-01"
}

Response (201):
{
  "success": true,
  "user": { ... },
  "token": "jwt_token_aqui"
}
```

### Headers de Autenticação

```
Authorization: Bearer {token}
```

---

## 🚀 Endpoints

### Base URL

```
http://localhost:3001/api
```

---

## 📁 1. Autenticação

### `POST /auth/login`

**Descrição**: Login de usuário ou estabelecimento

**Body**:

```json
{
	"email": "string",
	"senha": "string"
}
```

**Response (200)**:

```json
{
  "success": true,
  "user": {
    "id": "string",
    "nome": "string",
    "email": "string",
    "tipo": "cliente" | "estabelecimento"
  },
  "token": "string"
}
```

**Response (401)**:

```json
{
	"success": false,
	"message": "Credenciais inválidas"
}
```

---

### `POST /auth/register`

**Descrição**: Cadastro de novo cliente

**Body**:

```json
{
	"nome": "string",
	"email": "string",
	"senha": "string",
	"telefone": "string",
	"cpf": "string",
	"dataNascimento": "YYYY-MM-DD"
}
```

**Response (201)**:

```json
{
  "success": true,
  "user": { ... },
  "token": "string"
}
```

**Response (400)**:

```json
{
	"success": false,
	"message": "Email já cadastrado"
}
```

---

## 📁 2. Estabelecimentos

### `GET /estabelecimentos`

**Descrição**: Listar estabelecimentos (com busca)

**Query Params**:

-   `search` (opcional): Filtrar por nome

**Response (200)**:

```json
[
	{
		"id": 1,
		"nome": "Salão Beleza Pura",
		"email": "contato@belezapura.com",
		"telefone": "(11) 98765-4321",
		"endereco": "Rua das Flores, 123 - Centro",
		"imagem": "url_da_imagem",
		"avaliacao": 4.8,
		"totalAvaliacoes": 156,
		"horarioFuncionamento": "Seg-Sex: 9h às 19h | Sáb: 9h às 17h",
		"tipo": "estabelecimento",
		"createdAt": "2025-10-20T00:00:00.000Z"
	}
]
```

---

### `GET /estabelecimentos/:id`

**Descrição**: Buscar estabelecimento por ID

**Response (200)**:

```json
{
  "id": 1,
  "nome": "Salão Beleza Pura",
  ...
}
```

**Response (404)**:

```json
{
	"message": "Estabelecimento não encontrado"
}
```

---

### `POST /estabelecimentos`

**Descrição**: Criar novo estabelecimento

**Body**:

```json
{
	"nome": "string",
	"email": "string",
	"senha": "string",
	"telefone": "string",
	"endereco": "string",
	"imagem": "string (url)",
	"horarioFuncionamento": "string"
}
```

**Response (201)**:

```json
{
  "id": 4,
  "nome": "Novo Estabelecimento",
  ...
}
```

---

### `PUT /estabelecimentos/:id`

**Descrição**: Atualizar estabelecimento

**Body**: Mesmos campos do POST (todos opcionais)

**Response (200)**:

```json
{
  "id": 1,
  "nome": "Nome Atualizado",
  ...
}
```

---

### `DELETE /estabelecimentos/:id`

**Descrição**: Deletar estabelecimento

**Response (200)**:

```json
{
	"message": "Estabelecimento deletado com sucesso"
}
```

---

## 📁 3. Serviços

### `GET /estabelecimentos/:id/servicos`

**Descrição**: Listar serviços de um estabelecimento

**Response (200)**:

```json
[
	{
		"id": "uuid",
		"estabelecimentoId": 1,
		"nome": "Corte Feminino",
		"descricao": "Corte de cabelo feminino com acabamento profissional",
		"preco": "80.00",
		"duracao": "60",
		"createdAt": "2025-10-20T00:00:00.000Z"
	}
]
```

---

### `POST /servicos`

**Descrição**: Criar novo serviço

**Body**:

```json
{
	"estabelecimentoId": 1,
	"nome": "string",
	"descricao": "string",
	"preco": "string (formato: 00.00)",
	"duracao": "string (minutos)"
}
```

**Response (201)**:

```json
{
  "id": "uuid",
  ...
}
```

---

### `PUT /servicos/:id`

**Descrição**: Atualizar serviço

**Body**: Mesmos campos do POST (todos opcionais)

**Response (200)**:

```json
{
  "id": "uuid",
  ...
}
```

---

### `DELETE /servicos/:id`

**Descrição**: Deletar serviço

**Response (200)**:

```json
{
	"message": "Serviço deletado com sucesso"
}
```

---

## 📁 4. Profissionais

### `GET /estabelecimentos/:id/profissionais`

**Descrição**: Listar profissionais de um estabelecimento

**Response (200)**:

```json
[
	{
		"id": "uuid",
		"estabelecimentoId": 1,
		"nome": "Ana Silva",
		"telefone": "(11) 98765-4321",
		"especialidades": ["Corte Feminino", "Escova"],
		"createdAt": "2025-10-20T00:00:00.000Z"
	}
]
```

---

### `POST /profissionais`

**Descrição**: Criar novo profissional

**Body**:

```json
{
	"estabelecimentoId": 1,
	"nome": "string",
	"telefone": "string",
	"especialidades": ["string"]
}
```

**Response (201)**:

```json
{
  "id": "uuid",
  ...
}
```

---

### `PUT /profissionais/:id`

**Descrição**: Atualizar profissional

**Body**: Mesmos campos do POST (todos opcionais)

**Response (200)**:

```json
{
  "id": "uuid",
  ...
}
```

---

### `DELETE /profissionais/:id`

**Descrição**: Deletar profissional

**Response (200)**:

```json
{
	"message": "Profissional deletado com sucesso"
}
```

---

## 📁 5. Agendamentos

### `GET /agendamentos`

**Descrição**: Listar agendamentos

**Query Params**:

-   `usuarioId` (opcional): Filtrar por usuário

**Response (200)**:

```json
[
  {
    "id": "uuid",
    "usuarioId": "uuid",
    "estabelecimentoId": 2,
    "servicoId": "uuid",
    "profissionalId": "uuid",
    "data": "2025-10-25",
    "horario": "10:00",
    "status": "confirmado" | "pendente" | "concluido" | "cancelado",
    "servico": "Corte Masculino",
    "profissional": "João Souza",
    "preco": "40.00",
    "estabelecimento": "Barbearia Premium",
    "createdAt": "2025-10-20T00:00:00.000Z"
  }
]
```

---

### `POST /agendamentos`

**Descrição**: Criar novo agendamento

**Body**:

```json
{
	"usuarioId": "uuid",
	"estabelecimentoId": 1,
	"servicoId": "uuid",
	"profissionalId": "uuid",
	"data": "YYYY-MM-DD",
	"horario": "HH:mm",
	"servico": "string",
	"profissional": "string",
	"preco": "string",
	"estabelecimento": "string"
}
```

**Response (201)**:

```json
{
  "id": "uuid",
  "status": "pendente",
  ...
}
```

---

### `PATCH /agendamentos/:id`

**Descrição**: Atualizar status do agendamento

**Body**:

```json
{
  "status": "confirmado" | "cancelado" | "concluido"
}
```

**Response (200)**:

```json
{
  "id": "uuid",
  ...
}
```

---

### `DELETE /agendamentos/:id`

**Descrição**: Deletar agendamento

**Response (200)**:

```json
{
	"message": "Agendamento deletado com sucesso"
}
```

---

## 📁 6. Usuários (Clientes)

### `GET /usuarios`

**Descrição**: Listar todos os usuários (sem senhas)

**Response (200)**:

```json
[
	{
		"id": "uuid",
		"nome": "Cliente Exemplo",
		"email": "cliente@exemplo.com",
		"telefone": "(11) 99999-9999",
		"cpf": "123.456.789-00",
		"dataNascimento": "1990-01-01",
		"tipo": "cliente",
		"createdAt": "2025-10-20T00:00:00.000Z"
	}
]
```

---

### `GET /usuarios/:id`

**Descrição**: Buscar dados do usuário

**Response (200)**:

```json
{
	"id": "uuid",
	"nome": "Cliente Exemplo",
	"email": "cliente@exemplo.com",
	"telefone": "(11) 99999-9999",
	"cpf": "123.456.789-00",
	"dataNascimento": "1990-01-01",
	"tipo": "cliente",
	"createdAt": "2025-10-20T00:00:00.000Z"
}
```

---

### `PUT /usuarios/:id`

**Descrição**: Atualizar dados do usuário

**Body**:

```json
{
	"nome": "string (opcional)",
	"telefone": "string (opcional)",
	"dataNascimento": "YYYY-MM-DD (opcional)"
}
```

**Response (200)**:

```json
{
  "id": "uuid",
  ...
}
```

---

## 📁 7. Transações

### `GET /transacoes`

**Descrição**: Listar transações

**Query Params**:

-   `usuarioId` (opcional): Filtrar por usuário

**Response (200)**:

```json
[
  {
    "id": "uuid",
    "usuarioId": "uuid",
    "agendamentoId": "uuid",
    "descricao": "Combo Corte + Barba",
    "valor": 60.0,
    "data": "2025-10-15",
    "status": "pago" | "pendente" | "cancelado",
    "metodoPagamento": "Cartão de Crédito" | "PIX" | null,
    "createdAt": "2025-10-15T00:00:00.000Z"
  }
]
```

---

### `POST /transacoes`

**Descrição**: Criar nova transação

**Body**:

```json
{
  "usuarioId": "uuid",
  "agendamentoId": "uuid",
  "descricao": "string",
  "valor": 60.0,
  "data": "YYYY-MM-DD",
  "status": "pago" | "pendente" | "cancelado",
  "metodoPagamento": "string | null"
}
```

**Response (201)**:

```json
{
  "id": "uuid",
  ...
}
```

---

## 📁 8. Métodos de Pagamento

### `GET /metodos-pagamento`

**Descrição**: Listar métodos de pagamento

**Query Params**:

-   `usuarioId` (opcional): Filtrar por usuário

**Response (200)**:

```json
[
  {
    "id": "uuid",
    "usuarioId": "uuid",
    "tipo": "cartao-credito" | "cartao-debito" | "pix",
    "descricao": "Visa",
    "numero": "1234",
    "validade": "12/2027",
    "principal": true,
    "createdAt": "2025-10-20T00:00:00.000Z"
  }
]
```

---

### `POST /metodos-pagamento`

**Descrição**: Criar método de pagamento

**Body**:

```json
{
  "usuarioId": "uuid",
  "tipo": "cartao-credito" | "cartao-debito" | "pix",
  "descricao": "string",
  "numero": "string (últimos 4 dígitos)",
  "validade": "MM/YYYY",
  "principal": boolean
}
```

**Response (201)**:

```json
{
  "id": "uuid",
  ...
}
```

---

### `DELETE /metodos-pagamento/:id`

**Descrição**: Deletar método de pagamento

**Response (200)**:

```json
{
	"message": "Método deletado com sucesso"
}
```

---

## 📁 9. Avaliações

### `GET /avaliacoes`

**Descrição**: Listar avaliações

**Query Params**:

-   `usuarioId` (opcional): Filtrar por usuário

**Response (200)**:

```json
[
	{
		"id": "uuid",
		"usuarioId": "uuid",
		"agendamentoId": "uuid",
		"estabelecimentoId": 1,
		"servicoNome": "Combo Corte + Barba",
		"profissionalNome": "João Souza",
		"data": "2025-10-15",
		"nota": 5,
		"comentario": "Excelente atendimento!",
		"avaliado": true,
		"createdAt": "2025-10-15T00:00:00.000Z"
	}
]
```

---

### `POST /avaliacoes`

**Descrição**: Criar ou atualizar avaliação

**Body**:

```json
{
  "usuarioId": "uuid",
  "agendamentoId": "uuid",
  "nota": 1 | 2 | 3 | 4 | 5,
  "comentario": "string (opcional)"
}
```

**Response (201)**:

```json
{
  "id": "uuid",
  ...
}
```

---

## 📁 10. Preferências de Notificação

### `GET /preferencias-notificacao/:usuarioId`

**Descrição**: Buscar preferências de notificação

**Response (200)**:

```json
{
	"lembretes": true,
	"promocoes": true,
	"confirmacoes": true,
	"updatedAt": "2025-10-20T00:00:00.000Z"
}
```

---

### `PUT /preferencias-notificacao/:usuarioId`

**Descrição**: Atualizar preferências de notificação

**Body**:

```json
{
  "lembretes": boolean,
  "promocoes": boolean,
  "confirmacoes": boolean
}
```

**Response (200)**:

```json
{
	"lembretes": true,
	"promocoes": false,
	"confirmacoes": true,
	"updatedAt": "2025-10-20T00:00:00.000Z"
}
```

---

## 📊 Modelos de Dados

### Usuario (Cliente)

```typescript
interface Usuario {
	id: string; // UUID
	nome: string;
	email: string; // Único
	senha: string; // Hash (não retornar em responses)
	telefone: string;
	cpf: string; // Único
	dataNascimento: string; // YYYY-MM-DD
	tipo: 'cliente';
	createdAt: string; // ISO 8601
	updatedAt?: string; // ISO 8601
}
```

---

### Estabelecimento

```typescript
interface Estabelecimento {
	id: number;
	nome: string;
	email: string; // Único
	senha: string; // Hash (não retornar)
	telefone: string;
	endereco: string;
	imagem: string; // URL
	avaliacao: number; // 0.0 - 5.0
	totalAvaliacoes: number;
	horarioFuncionamento: string;
	tipo: 'estabelecimento';
	createdAt: string;
	updatedAt?: string;
}
```

---

### Servico

```typescript
interface Servico {
	id: string; // UUID
	estabelecimentoId: number;
	nome: string;
	descricao: string;
	preco: string; // Formato: "00.00"
	duracao: string; // Minutos (string)
	createdAt: string;
	updatedAt?: string;
}
```

---

### Profissional

```typescript
interface Profissional {
	id: string; // UUID
	estabelecimentoId: number;
	nome: string;
	telefone: string;
	especialidades: string[];
	createdAt: string;
	updatedAt?: string;
}
```

---

### Agendamento

```typescript
interface Agendamento {
	id: string; // UUID
	usuarioId: string; // UUID do cliente
	estabelecimentoId: number;
	servicoId: string; // UUID
	profissionalId: string; // UUID
	data: string; // YYYY-MM-DD
	horario: string; // HH:mm
	status: 'pendente' | 'confirmado' | 'concluido' | 'cancelado';
	servico: string; // Nome do serviço
	profissional: string; // Nome do profissional
	preco: string; // Formato: "00.00"
	estabelecimento: string; // Nome do estabelecimento
	createdAt: string;
	updatedAt?: string;
}
```

---

### Transacao

```typescript
interface Transacao {
	id: string; // UUID
	usuarioId: string;
	agendamentoId: string;
	descricao: string;
	valor: number;
	data: string; // YYYY-MM-DD
	status: 'pago' | 'pendente' | 'cancelado';
	metodoPagamento: string | null;
	createdAt: string;
}
```

---

### MetodoPagamento

```typescript
interface MetodoPagamento {
	id: string; // UUID
	usuarioId: string;
	tipo: 'cartao-credito' | 'cartao-debito' | 'pix';
	descricao: string; // Ex: "Visa", "PIX - CPF"
	numero: string | null; // Últimos 4 dígitos
	validade: string | null; // MM/YYYY
	principal: boolean;
	createdAt: string;
}
```

---

### Avaliacao

```typescript
interface Avaliacao {
	id: string; // UUID
	usuarioId: string;
	agendamentoId: string;
	estabelecimentoId: number;
	servicoNome: string;
	profissionalNome: string;
	data: string; // YYYY-MM-DD
	nota: 1 | 2 | 3 | 4 | 5 | null;
	comentario: string | null;
	avaliado: boolean;
	createdAt: string;
	updatedAt?: string;
}
```

---

### PreferenciasNotificacao

```typescript
interface PreferenciasNotificacao {
	lembretes: boolean;
	promocoes: boolean;
	confirmacoes: boolean;
	updatedAt: string;
}
```

---

## 📝 Códigos de Status HTTP

| Código | Significado           | Quando usar                               |
| ------ | --------------------- | ----------------------------------------- |
| `200`  | OK                    | Requisição bem-sucedida (GET, PUT, PATCH) |
| `201`  | Created               | Recurso criado (POST)                     |
| `400`  | Bad Request           | Dados inválidos no body                   |
| `401`  | Unauthorized          | Token inválido ou ausente                 |
| `404`  | Not Found             | Recurso não encontrado                    |
| `500`  | Internal Server Error | Erro no servidor                          |

---

## ✅ Validações Necessárias

### Email

-   Formato válido: `regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/`
-   Único no banco

### CPF

-   Formato: `000.000.000-00`
-   Validar algoritmo do CPF
-   Único no banco

### Telefone

-   Formato: `(00) 00000-0000` ou `(00) 0000-0000`

### Senha

-   Mínimo 6 caracteres
-   Armazenar hash (bcrypt)

### Data

-   Formato: `YYYY-MM-DD`
-   Não permitir datas passadas para agendamentos

### Horário

-   Formato: `HH:mm`
-   Validar horário de funcionamento do estabelecimento

### Preço

-   Formato: `"00.00"` (string)
-   Não negativo

### Duração

-   Em minutos (string)
-   Múltiplo de 5 ou 15

---

## 🚧 Notas de Implementação

### 1. Banco de Dados

**Recomendações**:

-   **PostgreSQL** (produção) - Relacional, robusto
-   **SQLite** (desenvolvimento) - Simples, rápido
-   **MySQL/MariaDB** (alternativa)

**Estrutura de Tabelas**:

```sql
-- Usuários (clientes)
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  cpf VARCHAR(14) UNIQUE,
  data_nascimento DATE,
  tipo VARCHAR(20) DEFAULT 'cliente',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);

-- Estabelecimentos
CREATE TABLE estabelecimentos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  endereco TEXT,
  imagem TEXT,
  avaliacao DECIMAL(2,1) DEFAULT 0.0,
  total_avaliacoes INT DEFAULT 0,
  horario_funcionamento TEXT,
  tipo VARCHAR(20) DEFAULT 'estabelecimento',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);

-- Serviços
CREATE TABLE servicos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  estabelecimento_id INT REFERENCES estabelecimentos(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10,2) NOT NULL,
  duracao INT NOT NULL, -- minutos
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);

-- Profissionais
CREATE TABLE profissionais (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  estabelecimento_id INT REFERENCES estabelecimentos(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  especialidades TEXT[], -- array de strings
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);

-- Agendamentos
CREATE TABLE agendamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  estabelecimento_id INT REFERENCES estabelecimentos(id),
  servico_id UUID REFERENCES servicos(id),
  profissional_id UUID REFERENCES profissionais(id),
  data DATE NOT NULL,
  horario TIME NOT NULL,
  status VARCHAR(20) DEFAULT 'pendente',
  servico_nome VARCHAR(255),
  profissional_nome VARCHAR(255),
  preco DECIMAL(10,2),
  estabelecimento_nome VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);

-- Transações
CREATE TABLE transacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES usuarios(id),
  agendamento_id UUID REFERENCES agendamentos(id),
  descricao TEXT,
  valor DECIMAL(10,2),
  data DATE,
  status VARCHAR(20),
  metodo_pagamento VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Métodos de Pagamento
CREATE TABLE metodos_pagamento (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  tipo VARCHAR(20),
  descricao VARCHAR(100),
  numero VARCHAR(4),
  validade VARCHAR(7),
  principal BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Avaliações
CREATE TABLE avaliacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES usuarios(id),
  agendamento_id UUID REFERENCES agendamentos(id),
  estabelecimento_id INT REFERENCES estabelecimentos(id),
  servico_nome VARCHAR(255),
  profissional_nome VARCHAR(255),
  data DATE,
  nota INT CHECK (nota >= 1 AND nota <= 5),
  comentario TEXT,
  avaliado BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);

-- Preferências de Notificação
CREATE TABLE preferencias_notificacao (
  usuario_id UUID PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
  lembretes BOOLEAN DEFAULT TRUE,
  promocoes BOOLEAN DEFAULT TRUE,
  confirmacoes BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

### 2. Segurança

#### Hash de Senhas (Node.js)

```javascript
const bcrypt = require('bcrypt');

// Criar hash
const hashSenha = await bcrypt.hash(senha, 10);

// Verificar senha
const senhaValida = await bcrypt.compare(senha, hashArmazenado);
```

#### JWT (Node.js)

```javascript
const jwt = require('jsonwebtoken');

// Gerar token
const token = jwt.sign(
	{ userId: usuario.id, tipo: usuario.tipo },
	process.env.JWT_SECRET,
	{ expiresIn: '7d' }
);

// Verificar token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

#### Middleware de Autenticação

```javascript
function authenticateToken(req, res, next) {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (!token) return res.status(401).json({ message: 'Token ausente' });

	jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
		if (err) return res.status(403).json({ message: 'Token inválido' });
		req.user = user;
		next();
	});
}
```

---

### 3. CORS

```javascript
const cors = require('cors');

app.use(
	cors({
		origin: ['http://localhost:3000', 'http://localhost:3001'],
		credentials: true,
	})
);
```

---

### 4. Variáveis de Ambiente

```env
# .env
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/agendaai
JWT_SECRET=seu_segredo_super_secreto_aqui
NODE_ENV=development
```

---

### 5. Estrutura de Projeto da API

```
api/
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── estabelecimentosController.js
│   │   ├── servicosController.js
│   │   ├── profissionaisController.js
│   │   ├── agendamentosController.js
│   │   ├── usuariosController.js
│   │   ├── transacoesController.js
│   │   ├── pagamentosController.js
│   │   ├── avaliacoesController.js
│   │   └── notificacoesController.js
│   │
│   ├── models/
│   │   ├── Usuario.js
│   │   ├── Estabelecimento.js
│   │   ├── Servico.js
│   │   ├── Profissional.js
│   │   ├── Agendamento.js
│   │   ├── Transacao.js
│   │   ├── MetodoPagamento.js
│   │   ├── Avaliacao.js
│   │   └── index.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── estabelecimentos.js
│   │   ├── servicos.js
│   │   ├── profissionais.js
│   │   ├── agendamentos.js
│   │   ├── usuarios.js
│   │   ├── transacoes.js
│   │   ├── pagamentos.js
│   │   ├── avaliacoes.js
│   │   ├── notificacoes.js
│   │   └── index.js
│   │
│   ├── middlewares/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   ├── errorHandler.js
│   │   └── logger.js
│   │
│   ├── utils/
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   └── helpers.js
│   │
│   ├── config/
│   │   ├── database.js
│   │   └── jwt.js
│   │
│   └── app.js
│
├── .env
├── .env.example
├── package.json
└── README.md
```

---

### 6. Scripts NPM Recomendados

```json
{
	"scripts": {
		"dev": "nodemon src/app.js",
		"start": "node src/app.js",
		"migrate": "node scripts/migrate.js",
		"seed": "node scripts/seed.js"
	}
}
```

---

### 7. Dependências Sugeridas

```json
{
	"dependencies": {
		"express": "^4.18.2",
		"cors": "^2.8.5",
		"dotenv": "^16.0.3",
		"bcrypt": "^5.1.1",
		"jsonwebtoken": "^9.0.2",
		"pg": "^8.11.0",
		"uuid": "^9.0.0",
		"express-validator": "^7.0.1"
	},
	"devDependencies": {
		"nodemon": "^3.0.1"
	}
}
```

---

### 8. Validação de Entrada (Express Validator)

```javascript
const { body, validationResult } = require('express-validator');

// Exemplo: validação de login
const validateLogin = [
	body('email').isEmail().withMessage('Email inválido'),
	body('senha')
		.isLength({ min: 6 })
		.withMessage('Senha deve ter no mínimo 6 caracteres'),
];

app.post('/api/auth/login', validateLogin, (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	// Lógica de login
});
```

---

## 📚 Recursos Adicionais

### Documentação de Referência

-   [Express.js](https://expressjs.com/)
-   [PostgreSQL](https://www.postgresql.org/docs/)
-   [JWT](https://jwt.io/)
-   [Bcrypt](https://github.com/kelektiv/node.bcrypt.js)

### Frontend - Como Consumir a API

```typescript
// lib/api.ts
const API_URL = 'http://localhost:3001/api';

export async function fetchEstabelecimentos(search?: string) {
	const url = search
		? `${API_URL}/estabelecimentos?search=${encodeURIComponent(search)}`
		: `${API_URL}/estabelecimentos`;

	const response = await fetch(url);
	if (!response.ok) throw new Error('Erro ao buscar estabelecimentos');
	return response.json();
}

export async function criarAgendamento(data: NovoAgendamento) {
	const token = localStorage.getItem('auth_token');

	const response = await fetch(`${API_URL}/agendamentos`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	});

	if (!response.ok) throw new Error('Erro ao criar agendamento');
	return response.json();
}
```

---

## 🎯 Resumo Executivo

### O que a API deve fazer:

1. **Autenticar** usuários (clientes e estabelecimentos)
2. **Gerenciar** estabelecimentos, serviços e profissionais
3. **Processar** agendamentos com validação de horários
4. **Controlar** transações e métodos de pagamento
5. **Armazenar** avaliações e preferências de notificação

### Stack Recomendada:

-   **Runtime**: Node.js 18+
-   **Framework**: Express.js
-   **Database**: PostgreSQL
-   **Auth**: JWT + Bcrypt
-   **Validation**: Express Validator

### Credenciais de Teste:

-   **Cliente**: `cliente@exemplo.com` / `123456`
-   **Estabelecimento**: `contato@belezapura.com` / `123456`

---

**Versão**: 1.0  
**Data**: Outubro 2025  
**Status**: ✅ Especificação Completa
