# AgendaAi API

API REST simples para o sistema AgendaAi.

## 🚀 Como rodar

```bash
cd api
npm install
npm start
```

A API estará disponível em `http://localhost:3001`

## 📚 Endpoints

### Autenticação

-   `POST /api/auth/login` - Login (cliente ou estabelecimento)
-   `POST /api/auth/register` - Cadastro de novo cliente

### Estabelecimentos

-   `GET /api/estabelecimentos` - Listar estabelecimentos
-   `GET /api/estabelecimentos/:id` - Buscar estabelecimento por ID
-   `POST /api/estabelecimentos` - Criar estabelecimento
-   `PUT /api/estabelecimentos/:id` - Atualizar estabelecimento
-   `DELETE /api/estabelecimentos/:id` - Deletar estabelecimento

### Serviços

-   `GET /api/estabelecimentos/:id/servicos` - Listar serviços de um
    estabelecimento
-   `POST /api/servicos` - Criar serviço
-   `PUT /api/servicos/:id` - Atualizar serviço
-   `DELETE /api/servicos/:id` - Deletar serviço

### Profissionais

-   `GET /api/estabelecimentos/:id/profissionais` - Listar profissionais de um
    estabelecimento
-   `POST /api/profissionais` - Criar profissional
-   `PUT /api/profissionais/:id` - Atualizar profissional
-   `DELETE /api/profissionais/:id` - Deletar profissional

### Agendamentos

-   `GET /api/agendamentos?usuarioId=xxx` - Listar agendamentos de um usuário
-   `POST /api/agendamentos` - Criar agendamento
-   `PATCH /api/agendamentos/:id` - Atualizar status do agendamento
-   `DELETE /api/agendamentos/:id` - Deletar agendamento

### Usuário

-   `GET /api/usuarios/:id` - Buscar dados do usuário
-   `PUT /api/usuarios/:id` - Atualizar dados do usuário

### Transações

-   `GET /api/transacoes?usuarioId=xxx` - Listar transações de um usuário
-   `POST /api/transacoes` - Criar transação

### Métodos de Pagamento

-   `GET /api/metodos-pagamento?usuarioId=xxx` - Listar métodos de pagamento
-   `POST /api/metodos-pagamento` - Criar método de pagamento
-   `DELETE /api/metodos-pagamento/:id` - Deletar método de pagamento

### Avaliações

-   `GET /api/avaliacoes?usuarioId=xxx` - Listar avaliações
-   `POST /api/avaliacoes` - Criar/Atualizar avaliação

### Preferências de Notificação

-   `GET /api/preferencias-notificacao/:usuarioId` - Buscar preferências
-   `PUT /api/preferencias-notificacao/:usuarioId` - Atualizar preferências

## 💡 Credenciais de Teste

**Cliente:**

-   Email: `cliente@exemplo.com`
-   Senha: `123456`

**Estabelecimentos:**

-   Email: `contato@belezapura.com` / Senha: `123456`
-   Email: `contato@barberiapremium.com` / Senha: `123456`
-   Email: `contato@esteticaecia.com` / Senha: `123456`

## ⚠️ Importante

Esta é uma API de desenvolvimento. NÃO use em produção!

-   Senhas em texto plano
-   Sem validações complexas
-   Sem autenticação JWT real
-   Dados em memória (reiniciar = perder dados)
