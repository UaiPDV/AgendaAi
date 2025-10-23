# AgendaAi - Atualização para API Real

## ✅ O que foi feito

### 1. **API Real Criada** (`/api`)
- ✅ Servidor Express rodando em `http://localhost:3001`
- ✅ Banco de dados em memória (`database.js`)
- ✅ CRUD completo para todas as entidades
- ✅ Autenticação (login + registro)

### 2. **Mock API Removida**
- ✅ Pasta `src/lib/mock` deletada
- ✅ Nenhuma referência ao mock no código

### 3. **Hooks Atualizados**
Todos os hooks agora consomem a API real:
- ✅ `useEstabelecimentos` - GET estabelecimentos
- ✅ `useAgendamentos` - CRUD agendamentos
- ✅ `useFinancas` - GET transações
- ✅ `usePagamentos` - CRUD métodos de pagamento
- ✅ `useUsuario` - GET/PUT dados do usuário
- ✅ `useAvaliacoes` - GET/POST avaliações

### 4. **Configuração da API** (`src/lib/api.ts`)
- ✅ Helper `apiRequest` para fazer requisições
- ✅ Constantes `API_ENDPOINTS` com todas as rotas
- ✅ Configuração centralizada da URL base

### 5. **Arquivo Corrompido Corrigido**
- ✅ `src/app/(app)/configuracoes/page.tsx` recriado

## 🚀 Como rodar

### Terminal 1 - API
```bash
cd api
npm install
npm start
```
A API estará em: `http://localhost:3001`

### Terminal 2 - Frontend
```bash
npm run dev
```
O frontend estará em: `http://localhost:3000`

## 📁 Estrutura Final

```
AgendaAi/
├── api/                          # ← API REAL (fora do src)
│   ├── server.js                # Servidor Express
│   ├── database.js              # Banco em memória
│   ├── package.json
│   └── README.md
│
├── src/
│   ├── app/                     # Páginas Next.js
│   ├── components/              # Componentes React
│   ├── hooks/                   # ← Hooks atualizados (usam API real)
│   │   ├── useAgendamentos.ts  # ✅ Atualizado
│   │   ├── useAvaliacoes.ts    # ✅ Atualizado
│   │   ├── useEstabelecimentos.ts # ✅ Atualizado
│   │   ├── useFinancas.ts      # ✅ Atualizado
│   │   ├── usePagamentos.ts    # ✅ Atualizado
│   │   └── useUsuario.ts       # ✅ Atualizado
│   │
│   ├── lib/
│   │   ├── api.ts              # ← Helper para requisições API
│   │   └── mock/               # ❌ REMOVIDA
│   │
│   └── types/                   # TypeScript types
```

## 🔌 Endpoints Disponíveis

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro

### Estabelecimentos
- `GET /api/estabelecimentos` - Listar
- `GET /api/estabelecimentos/:id` - Buscar por ID
- `POST /api/estabelecimentos` - Criar
- `PUT /api/estabelecimentos/:id` - Atualizar
- `DELETE /api/estabelecimentos/:id` - Deletar

### Serviços
- `GET /api/estabelecimentos/:id/servicos` - Listar serviços
- `POST /api/servicos` - Criar serviço
- `PUT /api/servicos/:id` - Atualizar serviço
- `DELETE /api/servicos/:id` - Deletar serviço

### Agendamentos
- `GET /api/agendamentos?usuarioId=xxx` - Listar
- `POST /api/agendamentos` - Criar
- `PATCH /api/agendamentos/:id` - Atualizar status
- `DELETE /api/agendamentos/:id` - Deletar

### Outros
- `GET /api/usuarios/:id` - Dados do usuário
- `PUT /api/usuarios/:id` - Atualizar usuário
- `GET /api/transacoes` - Transações
- `GET /api/metodos-pagamento` - Métodos de pagamento
- `GET /api/avaliacoes` - Avaliações
- `GET /api/preferencias-notificacao/:usuarioId` - Preferências

## 💡 Credenciais de Teste

**Cliente:**
- Email: `cliente@exemplo.com`
- Senha: `123456`

**Estabelecimentos:**
- Email: `contato@belezapura.com` / Senha: `123456`
- Email: `contato@barberiapremium.com` / Senha: `123456`
- Email: `contato@esteticaecia.com` / Senha: `123456`

## ⚠️ Próximos Passos

1. **Implementar contexto de autenticação** - Os hooks estão usando `usuarioId` hardcoded
2. **Testes** - Testar todas as páginas com a API real
3. **Loading states** - Melhorar estados de carregamento
4. **Error handling** - Melhorar tratamento de erros
5. **Páginas de estabelecimento** - Criar interfaces para gestão de estabelecimentos
