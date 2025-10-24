# API AgendaAi - Instruções de Instalação

Esta é a API backend de teste para o projeto AgendaAi, construída com Node.js,
Express e SQLite, baseada na documentação fornecida.

## 1. Estrutura de Pastas

A estrutura atual do projeto é:

```
api/
├── .env                     (Variáveis de ambiente: Porta, JWT)
├── package.json             (Dependências e scripts)
├── readme.md                (Este arquivo)
├── database/
│   └── agendaai.sqlite      (Banco SQLite - criado automaticamente)
└── src/
    ├── app.js                 (Servidor principal Express)
    ├── database.js            (Configuração do DB e criação de tabelas)
    ├── middlewares/
    │   └── auth.js            (Middleware de autenticação JWT)
    └── routes/
        ├── index.js           (Roteador principal da API)
        ├── agendamentos.js    (Rotas de agendamentos)
        ├── auth.js            (Rotas de login/registro)
        ├── estabelecimentos.js(Rotas de estabelecimentos)
        ├── profissionais.js   (Rotas de profissionais)
        ├── servicos.js        (Rotas de serviços)
        └── usuarios.js        (Rotas de usuários)
```

O arquivo `agendaai.sqlite` será criado automaticamente em `api/database/`
quando você rodar o comando de setup.

## 2. Instalação

Navegue até a pasta `api` pelo seu terminal:

```bash
cd api
```

E instale as dependências necessárias:

```bash
npm install
```

## 3. Configuração

O arquivo `.env` contém as configurações básicas da API:

```env
PORT=3001
JWT_SECRET=supersecretkey123
```

⚠️ **Segurança**: Em produção, altere o `JWT_SECRET` para um valor aleatório e
seguro.

## 4. Rodando a API

### Setup Inicial (Primeira vez)

Execute este comando **apenas uma vez** antes de iniciar o servidor. Ele cria
todas as tabelas no banco de dados SQLite:

```bash
npm run setup
```

Saída esperada:

```
Executando setup do banco de dados...
Verificando e criando tabelas...
Tabelas criadas com sucesso (se não existiam).
Setup do banco de dados concluído.
```

### Modo Desenvolvimento

Inicia o servidor com nodemon (reinicia automaticamente ao salvar arquivos):

```bash
npm run dev
```

### Modo Produção

Inicia o servidor sem auto-reload:

```bash
npm start
```

🚀 **Sua API estará rodando em** `http://localhost:3001`

## 5. Endpoints

## 5. Endpoints

A API segue a especificação em `docs/API_SPECIFICATION.md`. Os endpoints
principais são:

### 🔐 Autenticação

-   `POST /api/auth/register` - Registrar cliente
-   `POST /api/auth/register/estabelecimento` - Registrar estabelecimento
-   `POST /api/auth/login` - Fazer login

### 👤 Usuários

-   `GET /api/usuarios/:id` - Buscar usuário
-   `PATCH /api/usuarios/:id` - Atualizar dados

### 🏢 Estabelecimentos

-   `GET /api/estabelecimentos` - Listar todos (busca: `?search=`)
-   `GET /api/estabelecimentos/:id` - Detalhes do estabelecimento
-   `GET /api/estabelecimentos/:id/servicos` - Serviços do estabelecimento
-   `GET /api/estabelecimentos/:id/profissionais` - Profissionais do
    estabelecimento

### 💼 Serviços (requer token de estabelecimento)

-   `POST /api/servicos` - Criar serviço
-   `GET /api/servicos/:id` - Detalhes do serviço
-   `PATCH /api/servicos/:id` - Atualizar serviço
-   `DELETE /api/servicos/:id` - Deletar serviço

### 📅 Agendamentos (requer token de cliente)

-   `POST /api/agendamentos` - Criar agendamento
-   `GET /api/agendamentos` - Listar agendamentos do usuário
-   `PATCH /api/agendamentos/:id` - Atualizar agendamento
-   `DELETE /api/agendamentos/:id` - Cancelar agendamento

## 🧪 Testando a API

Você pode testar os endpoints usando ferramentas como:

-   **Postman** - https://www.postman.com/
-   **Insomnia** - https://insomnia.rest/
-   **Thunder Client** (extensão VS Code)
-   **curl** (linha de comando)

### Exemplo com curl:

```bash
# Registrar um cliente
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@email.com",
    "senha": "senha123",
    "telefone": "11999999999"
  }'

# Fazer login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "senha": "senha123"
  }'

# Listar estabelecimentos
curl http://localhost:3001/api/estabelecimentos
```

## 📚 Documentação Completa

Para mais detalhes sobre todos os endpoints, schemas e validações, consulte:

-   `docs/API_SPECIFICATION.md` - Especificação completa da API

---

✅ **Setup concluído!** A API está pronta para ser consumida pelo frontend.
