# 📘 Exemplos de Uso da API AgendaAi

Este documento contém exemplos práticos de como usar os principais endpoints da
API.

---

## 🔐 Autenticação

### 1. Registrar Cliente

```http
POST /api/auth/register
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "senha123",
  "telefone": "(11) 98765-4321",
  "cpf": "123.456.789-00",
  "data_nascimento": "1990-05-15"
}
```

**Resposta:**

```json
{
	"id": 1,
	"nome": "João Silva",
	"email": "joao@email.com",
	"tipo": "cliente"
}
```

### 2. Registrar Estabelecimento

```http
POST /api/auth/register/estabelecimento
Content-Type: application/json

{
  "nome": "Barbearia Estilo",
  "email": "contato@barbearia.com",
  "senha": "senha123",
  "telefone": "(11) 3456-7890",
  "endereco": "Rua das Flores, 123 - Centro"
}
```

### 3. Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "senha": "senha123"
}
```

**Resposta:**

```json
{
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
	"user": {
		"id": 1,
		"nome": "João Silva",
		"email": "joao@email.com",
		"tipo": "cliente"
	}
}
```

> 💡 **Use o token retornado no header:** `Authorization: Bearer <token>`

---

## 🏢 Estabelecimentos

### 1. Listar Todos os Estabelecimentos

```http
GET /api/estabelecimentos
```

**Resposta:**

```json
[
	{
		"id": 1,
		"nome": "Barbearia Estilo Masculino",
		"endereco": "Rua das Flores, 123 - Centro",
		"telefone": "(11) 3456-7890",
		"avaliacao_media": 4.5,
		"total_avaliacoes": 120
	}
]
```

### 2. Buscar Estabelecimento por Nome

```http
GET /api/estabelecimentos?search=barbearia
```

### 3. Ver Serviços do Estabelecimento

```http
GET /api/estabelecimentos/1/servicos
```

**Resposta:**

```json
[
	{
		"id": 1,
		"nome": "Corte Masculino",
		"duracao": 45,
		"preco": 40.0,
		"categoria": "Cortes",
		"icone": "fa-cut"
	},
	{
		"id": 2,
		"nome": "Barba Terapia",
		"duracao": 30,
		"preco": 35.0,
		"categoria": "Barbas",
		"icone": "fa-scissors"
	}
]
```

### 4. Ver Profissionais do Estabelecimento

```http
GET /api/estabelecimentos/1/profissionais
```

### 5. Ver Disponibilidade

```http
GET /api/estabelecimentos/1/disponibilidade?data=2025-10-25&servico_id=1&profissional_id=1
Authorization: Bearer <token>
```

**Resposta:**

```json
{
	"data": "2025-10-25",
	"horarios_disponiveis": [
		"09:00",
		"09:45",
		"10:30",
		"11:15",
		"14:00",
		"14:45",
		"15:30",
		"16:15"
	]
}
```

---

## 📅 Agendamentos

### 1. Criar Agendamento (Cliente)

```http
POST /api/agendamentos
Authorization: Bearer <token_cliente>
Content-Type: application/json

{
  "estabelecimento_id": 1,
  "servico_id": 1,
  "profissional_id": 1,
  "data": "2025-10-25",
  "horario": "14:00",
  "observacoes": "Prefiro o corte degradê"
}
```

**Resposta:**

```json
{
	"id": 10,
	"estabelecimento_id": 1,
	"servico_id": 1,
	"profissional_id": 1,
	"usuario_id": 5,
	"data": "2025-10-25",
	"horario": "14:00",
	"status": "pendente",
	"preco": 40.0,
	"duracao": 45,
	"observacoes": "Prefiro o corte degradê",
	"servico_nome": "Corte Masculino",
	"profissional_nome": "João da Silva"
}
```

### 2. Listar Meus Agendamentos (Cliente)

```http
GET /api/agendamentos
Authorization: Bearer <token_cliente>
```

### 3. Listar Agendamentos do Estabelecimento

```http
GET /api/agendamentos?data_inicio=2025-10-01&data_fim=2025-10-31&status=confirmado
Authorization: Bearer <token_estabelecimento>
```

### 4. Confirmar Agendamento (Estabelecimento)

```http
PATCH /api/agendamentos/10/confirmar
Authorization: Bearer <token_estabelecimento>
```

### 5. Cancelar Agendamento

```http
PATCH /api/agendamentos/10/cancelar
Authorization: Bearer <token_cliente>
Content-Type: application/json

{
  "motivo": "Imprevisto no trabalho"
}
```

### 6. Reagendar

```http
PUT /api/agendamentos/10/reagendar
Authorization: Bearer <token_cliente>
Content-Type: application/json

{
  "data": "2025-10-26",
  "horario": "15:00"
}
```

---

## ⭐ Avaliações

### 1. Criar Avaliação (Cliente - após serviço concluído)

```http
POST /api/avaliacoes
Authorization: Bearer <token_cliente>
Content-Type: application/json

{
  "agendamento_id": 10,
  "nota": 5,
  "comentario": "Excelente atendimento! Profissional muito competente."
}
```

### 2. Ver Avaliações do Estabelecimento

```http
GET /api/estabelecimentos/1/avaliacoes
```

**Resposta:**

```json
[
	{
		"id": 1,
		"usuario_nome": "João Silva",
		"nota": 5,
		"comentario": "Excelente atendimento!",
		"data_criacao": "2025-10-20T14:30:00Z"
	}
]
```

---

## 💼 Gerenciamento (Estabelecimento)

### 1. Criar Serviço

```http
POST /api/servicos
Authorization: Bearer <token_estabelecimento>
Content-Type: application/json

{
  "nome": "Corte + Barba",
  "descricao": "Combo completo",
  "duracao": 75,
  "preco": 70.00,
  "categoria": "Combos",
  "icone": "fa-star",
  "ativo": true
}
```

### 2. Atualizar Serviço

```http
PUT /api/servicos/1
Authorization: Bearer <token_estabelecimento>
Content-Type: application/json

{
  "preco": 45.00,
  "ativo": true
}
```

### 3. Excluir Serviço

```http
DELETE /api/servicos/1
Authorization: Bearer <token_estabelecimento>
```

### 4. Criar Profissional

```http
POST /api/profissionais
Authorization: Bearer <token_estabelecimento>
Content-Type: application/json

{
  "nome": "Pedro Costa",
  "telefone": "(11) 98765-0000",
  "horario_entrada": "09:00",
  "horario_saida": "18:00",
  "dias_trabalho": [1, 2, 3, 4, 5, 6]
}
```

---

## ⚙️ Configurações do Estabelecimento

### 1. Buscar Configurações

```http
GET /api/configuracoes/me
Authorization: Bearer <token_estabelecimento>
```

### 2. Atualizar Configurações

```http
PUT /api/configuracoes/me
Authorization: Bearer <token_estabelecimento>
Content-Type: application/json

{
  "padraoFuncionamento": "seg-sab",
  "diasTrabalho": [1, 2, 3, 4, 5, 6],
  "horarioAbertura": "09:00",
  "horarioFechamento": "19:00",
  "possuiIntervalo": true,
  "intervaloInicio": "12:00",
  "intervaloFim": "13:00",
  "fecharFeriadosNacionais": true,
  "datasBloqueadas": ["2025-12-25", "2026-01-01"],
  "antecedenciaMinima": 2,
  "antecedenciaMinimaAtivo": true,
  "bufferEntreServicos": 10,
  "bufferEntreServicosAtivo": true,
  "cancelamentoAntecedencia": 24,
  "reagendamentoPermitido": true
}
```

---

## 👤 Perfil do Usuário

### 1. Ver Meus Dados

```http
GET /api/usuarios/me
Authorization: Bearer <token>
```

### 2. Atualizar Dados (Cliente)

```http
PUT /api/usuarios/me
Authorization: Bearer <token_cliente>
Content-Type: application/json

{
  "nome": "João Pedro Silva",
  "telefone": "(11) 98765-9999",
  "notif_lembretes": true,
  "notif_promocoes": false,
  "pref_tema_escuro": true,
  "pref_idioma": "pt-BR"
}
```

### 3. Alterar Senha

```http
PUT /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "senhaAtual": "senha123",
  "novaSenha": "novaSenha456"
}
```

---

## 💳 Formas de Pagamento (Cliente)

### 1. Listar Formas de Pagamento

```http
GET /api/usuarios/me/pagamentos
Authorization: Bearer <token_cliente>
```

### 2. Adicionar Cartão

```http
POST /api/usuarios/me/pagamentos
Authorization: Bearer <token_cliente>
Content-Type: application/json

{
  "tipo": "credito",
  "descricao": "Visa **** 1234",
  "ultimos_digitos": "1234",
  "bandeira": "Visa",
  "validade": "12/2027",
  "principal": true
}
```

---

## 📊 Dashboard (Estabelecimento)

### 1. Métricas do Dashboard

```http
GET /api/dashboard/metrics
Authorization: Bearer <token_estabelecimento>
```

**Resposta:**

```json
{
	"agendamentosHoje": 12,
	"faturamentoHoje": 520.0,
	"faturamentoMes": 8250.0,
	"clientesAtivos": 147,
	"avaliacaoMedia": 4.8
}
```

---

## 💰 Finanças

### 1. Dados Financeiros (Cliente)

```http
GET /api/financas/me
Authorization: Bearer <token_cliente>
```

**Resposta:**

```json
{
	"tipo": "cliente",
	"gastoMes": 145.0,
	"gastoTotal": 580.0,
	"pagamentosPendentes": 0
}
```

### 2. Dados Financeiros (Estabelecimento)

```http
GET /api/financas/me
Authorization: Bearer <token_estabelecimento>
```

**Resposta:**

```json
{
	"tipo": "estabelecimento",
	"ganhosMes": 8250.0,
	"ganhoTotal": 47890.0
}
```

---

## 📈 Relatórios (Estabelecimento)

### 1. Serviços Mais Agendados

```http
GET /api/relatorios/servicos-mais-agendados
Authorization: Bearer <token_estabelecimento>
```

### 2. Desempenho dos Profissionais

```http
GET /api/relatorios/desempenho-profissionais
Authorization: Bearer <token_estabelecimento>
```

### 3. Taxa de Cancelamento

```http
GET /api/relatorios/taxa-cancelamento
Authorization: Bearer <token_estabelecimento>
```

---

## 🔧 Códigos de Status HTTP

| Código | Significado                                            |
| ------ | ------------------------------------------------------ |
| 200    | ✅ Sucesso - Operação realizada                        |
| 201    | ✅ Criado - Recurso criado com sucesso                 |
| 400    | ❌ Requisição inválida - Dados incorretos              |
| 401    | ❌ Não autorizado - Token inválido ou ausente          |
| 403    | ❌ Proibido - Sem permissão para acessar               |
| 404    | ❌ Não encontrado - Recurso não existe                 |
| 409    | ❌ Conflito - Recurso já existe ou conflito de horário |
| 500    | ❌ Erro interno - Problema no servidor                 |

---

## 🧪 Testando com cURL

### Exemplo: Login e Criar Agendamento

```bash
# 1. Fazer login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@email.com","senha":"senha123"}'

# Salve o token retornado
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# 2. Criar agendamento
curl -X POST http://localhost:3001/api/agendamentos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "estabelecimento_id": 1,
    "servico_id": 1,
    "profissional_id": 1,
    "data": "2025-10-25",
    "horario": "14:00"
  }'
```

---

## 🎯 Dicas de Uso

1. **Sempre use HTTPS em produção** para proteger os tokens
2. **Tokens JWT expiram em 24h** - implemente refresh token se necessário
3. **Valide disponibilidade** antes de criar agendamentos
4. **Use os filtros** nas listagens para melhor performance
5. **Implemente paginação** ao listar muitos registros
6. **Trate erros** adequadamente no frontend

---

**Última atualização:** 24/10/2025  
**Versão da API:** 1.0.0
