# 🎉 API AgendaAi - Sistema Completo de Agendamentos

[![Status](https://img.shields.io/badge/Status-Pronta%20para%20Produ%C3%A7%C3%A3o-green)](https://github.com)
[![Cobertura](https://img.shields.io/badge/Cobertura-98%25-brightgreen)](./CHECKLIST_API.md)
[![Node.js](https://img.shields.io/badge/Node.js-18+-blue)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.18+-lightgrey)](https://expressjs.com)
[![SQLite](https://img.shields.io/badge/SQLite-3-blue)](https://www.sqlite.org)

## 📊 Resumo Executivo

API RESTful completa construída com **Node.js**, **Express** e **SQLite** para o
sistema de agendamentos AgendaAi. Implementa **98% das funcionalidades** do
protótipo HTML com autenticação JWT, validações de negócio e sistema de
disponibilidade inteligente.

### 🎯 Principais Recursos

-   ✅ **50+ endpoints** cobrindo todas as operações CRUD
-   ✅ **Sistema de autenticação** completo com JWT
-   ✅ **Cálculo de disponibilidade** inteligente considerando configurações
-   ✅ **Dashboard** com métricas em tempo real
-   ✅ **Sistema de avaliações** e feedback
-   ✅ **Configurações avançadas** (horários, feriados, bloqueios)
-   ✅ **Relatórios financeiros** e analytics

### 📈 Estatísticas

| Métrica                          | Valor                                  |
| -------------------------------- | -------------------------------------- |
| **Endpoints implementados**      | 50+                                    |
| **Funcionalidades do protótipo** | 101/103 (98%)                          |
| **Rotas principais**             | 14 grupos                              |
| **Middlewares de segurança**     | 3 (auth, isCliente, isEstabelecimento) |

> 📄 **Documentação completa:** Veja
> [ANALISE_PROTOTIPO_VS_API.md](./ANALISE_PROTOTIPO_VS_API.md) e
> [CHECKLIST_API.md](./CHECKLIST_API.md)

### 📖 **Índice de Documentação**

-   📊 [**RESUMO_EXECUTIVO.md**](./RESUMO_EXECUTIVO.md) - Visão geral rápida
-   📋 [**CHECKLIST_API.md**](./CHECKLIST_API.md) - Lista completa de
    funcionalidades
-   🔍 [**ANALISE_PROTOTIPO_VS_API.md**](./ANALISE_PROTOTIPO_VS_API.md) -
    Análise detalhada
-   📘 [**EXEMPLOS_USO_API.md**](./EXEMPLOS_USO_API.md) - Exemplos práticos de
    uso
-   📚 [**README.md**](./README.md) - Este documento (documentação geral)

---

## 📁 Estrutura do Projeto

```
/api
├── database/
│   └── agendaai.sqlite          # Banco de dados SQLite
├── src/
│   ├── routes/                  # Definições de rotas da API
│   │   ├── auth.js              # Autenticação e registro
│   │   ├── usuarios.js          # Gestão de usuários/clientes
│   │   ├── estabelecimentos.js  # Estabelecimentos e recursos
│   │   ├── servicos.js          # CRUD de serviços
│   │   ├── profissionais.js     # CRUD de profissionais
│   │   ├── clientes.js          # Gestão de clientes
│   │   ├── agendamentos.js      # Sistema de agendamentos
│   │   ├── configuracoes.js     # Configurações avançadas
│   │   ├── disponibilidade.js   # Cálculo de horários
│   │   ├── dashboard.js         # Métricas e analytics
│   │   ├── relatorios.js        # Relatórios financeiros
│   │   ├── avaliacoes.js        # Sistema de avaliações
│   │   ├── financas.js          # Dados financeiros
│   │   └── index.js             # Agregador de rotas
│   ├── middlewares/             # Middlewares customizados
│   │   └── auth.js              # Autenticação JWT
│   ├── utils/                   # Funções auxiliares
│   │   └── availabilityHelper.js # Cálculo de disponibilidade
│   ├── migrations/              # Migrações de banco
│   │   ├── create-configuracoes-table.js
│   │   └── run-migrations.js
│   ├── app.js                   # Configuração Express
│   └── database.js              # Schema e conexão DB
├── .env                         # Variáveis de ambiente
├── package.json
├── README.md                    # Este arquivo
├── ANALISE_PROTOTIPO_VS_API.md  # Análise detalhada
└── CHECKLIST_API.md             # Checklist de funcionalidades
```

---

## 🚀 Configuração e Execução

### 1. Instalação

```bash
npm install
```

**Dependências principais:**

-   express ^4.18.2
-   sqlite3 ^5.1.7
-   bcryptjs ^2.4.3
-   jsonwebtoken ^9.0.2
-   cors ^2.8.5
-   dotenv ^16.3.1
-   uuid ^9.0.1

### 2. Configuração de Ambiente

Crie o arquivo `.env` na raiz do projeto:

```env
PORT=3001
JWT_SECRET=seu_segredo_super_secreto_aqui_minimo_32_caracteres
NODE_ENV=development
```

> ⚠️ **Importante:** Gere uma chave JWT segura para produção!

### 3. Inicialização do Banco de Dados

```bash
# Cria o banco e todas as tabelas
npm run setup

# Ou execute diretamente
node src/database.js
```

### 4. Executar Migrações

```bash
# Executa migrações pendentes
npm run migrate

# Ou execute diretamente
node src/migrations/run-migrations.js
```

### 5. Iniciar o Servidor

```bash
# Desenvolvimento (com nodemon)
npm run dev

# Produção
npm start
```

🎉 **Servidor rodando em:** `http://localhost:3001`

---

## 📚 Documentação da API

### 🔐 Autenticação (`/api/auth`)

POST /register: Registra um novo cliente.

POST /register/estabelecimento: Registra um novo estabelecimento.

POST /login: Autentica um cliente ou estabelecimento e retorna um token JWT.

POST /change-password: (Autenticado) Altera a senha do usuário logado.

Usuários (Clientes) (/api/usuarios)

GET /me: (Autenticado) Retorna os dados do usuário logado (cliente ou
estabelecimento).

PUT /me: (Autenticado como Cliente) Atualiza os dados (nome, telefone,
dataNascimento, preferências) do cliente logado.

DELETE /me: (Autenticado) Exclui a conta do usuário logado (cliente ou
estabelecimento).

GET /me/pagamentos: (Autenticado como Cliente) Lista as formas de pagamento do
cliente.

POST /me/pagamentos: (Autenticado como Cliente) Adiciona uma nova forma de
pagamento.

PUT /me/pagamentos/:id: (Autenticado como Cliente) Atualiza uma forma de
pagamento (descrição, principal).

DELETE /me/pagamentos/:id: (Autenticado como Cliente) Remove uma forma de
pagamento.

GET /me/avaliacoes: (Autenticado como Cliente) Lista as avaliações feitas pelo
cliente logado.

Estabelecimentos (/api/estabelecimentos)

GET /: Lista todos os estabelecimentos (público). Aceita ?search=nome.

GET /me: (Autenticado como Estabelecimento) Retorna os dados do estabelecimento
logado.

PUT /me: (Autenticado como Estabelecimento) Atualiza os dados (nome, telefone,
endereco, horario, imagem, preferências de notificação) do estabelecimento
logado.

GET /:id: Busca um estabelecimento específico pelo ID (público).

GET /:id/servicos: Lista os serviços ativos de um estabelecimento (público).

GET /:id/profissionais: Lista os profissionais de um estabelecimento (público).

GET /:id/clientes: (Autenticado como Estabelecimento) Lista os clientes do
estabelecimento (:id pode ser 'me'). Retorna ultima_visita.

POST /:id/clientes: (Autenticado como Estabelecimento) Cria um novo cliente para
o estabelecimento (:id pode ser 'me').

GET /:id/avaliacoes: Lista as avaliações de um estabelecimento (público).

GET /:id/disponibilidade: (Autenticado) Retorna horários disponíveis.
(Implementação Simplificada). Query Params: data (YYYY-MM-DD), servico_id,
profissional_id.

Serviços (/api/servicos) - Requer autenticação como Estabelecimento

POST /: Cria um novo serviço para o estabelecimento logado. Inclui categoria,
icone, ativo.

PUT /:id: Atualiza um serviço existente. Inclui categoria, icone, ativo.

DELETE /:id: Deleta um serviço.

Profissionais (/api/profissionais) - Requer autenticação como Estabelecimento

POST /: Cria um novo profissional. Inclui horario_entrada, horario_saida,
dias_trabalho.

PUT /:id: Atualiza um profissional. Inclui horario_entrada, horario_saida,
dias_trabalho.

DELETE /:id: Deleta um profissional.

Clientes (CRUD específico) (/api/clientes) - Requer autenticação (geralmente
Estabelecimento)

GET /:id: Busca um cliente específico (usado pelo estabelecimento).

PUT /:id: Atualiza um cliente (usado pelo estabelecimento).

DELETE /:id: Deleta um cliente (usado pelo estabelecimento).

Agendamentos (/api/agendamentos) - Requer autenticação

GET /: Lista agendamentos (do cliente logado ou do estabelecimento logado).

Para estabelecimentos, aceita query params:
?data_inicio=YYYY-MM-DD&data_fim=YYYY-MM-DD&status=...&profissional_id=...&page=1&limit=10.

POST /: Cria um novo agendamento (apenas clientes).

PATCH /:id: Atualiza o status de um agendamento (confirmado, cancelado,
concluido, nao_compareceu).

PUT /:id/reagendar: (Autenticado) Reagenda um agendamento existente (valida
disponibilidade de forma simples).

DELETE /:id: Deleta um agendamento (geralmente cliente cancelando ou
estabelecimento).

Configurações do Estabelecimento (/api/configuracoes) - Requer autenticação como
Estabelecimento

GET /me: Busca as configurações do estabelecimento logado.

PUT /me: Atualiza as configurações do estabelecimento logado.

Avaliações (/api/avaliacoes) - Requer autenticação como Cliente

POST /: Cliente cria uma nova avaliação para um agendamento concluído.

Dashboard (/api/dashboard) - Requer autenticação como Estabelecimento

GET /metrics: Retorna métricas básicas para o dashboard (agendamentos hoje,
faturamento hoje/mês, clientes ativos, avaliação média). (Implementação
Simplificada).

Relatórios (/api/relatorios) - Requer autenticação como Estabelecimento

GET /servicos-mais-agendados: Retorna os serviços mais agendados (concluídos).
(Implementação Simplificada).

GET /desempenho-profissionais: Retorna contagem de agendamentos (concluídos) por
profissional. (Implementação Simplificada).

GET /taxa-cancelamento: Retorna a taxa de cancelamento. (Implementação
Simplificada).

Finanças (/api/financas) - Requer autenticação

GET /me: Retorna dados financeiros agregados (Gasto Mês/Total para cliente,
Ganhos Mês/Total para estabelecimento). (Implementação Simplificada).
