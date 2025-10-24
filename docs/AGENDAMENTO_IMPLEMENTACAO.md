# Sistema de Agendamento - Implementação

> � Para detalhes da API, consulte
> [API_SPECIFICATION.md](./API_SPECIFICATION.md).

## ✅ Funcionalidades Implementadas

### 1. Página de Estabelecimentos (`/Agendar`)

-   Lista de estabelecimentos com busca
-   Cards com: nome, endereço, avaliação, horários, imagem
-   Click leva para página de serviços

### 2. Página de Serviços (`/Agendar/[id]`)

-   Serviços do estabelecimento: nome, descrição, duração, preço
-   Botão "Reservar" para iniciar agendamento

### 3. Fluxo de Agendamento - 3 Passos (`/Agendar/[id]/agendar`)

**Passo 1: Profissional**

-   Lista de profissionais com especialidades
-   Cards clicáveis

**Passo 2: Data e Horário**

-   Calendário interativo:
    -   Desabilita finais de semana e datas passadas
    -   Navegação entre meses
    -   Destaque visual do dia selecionado
-   Grid de horários: 09:00 - 17:00
-   Feedback visual da seleção

**Passo 3: Confirmação**

-   Resumo completo: serviço, profissional, data, hora, preço
-   Botões de voltar e confirmar
-   Integração com API

### 4. Barra de Progresso

-   Indicador visual (1/3, 2/3, 3/3)
-   Animação suave entre passos

### 5. Página de Sucesso

-   Notificação animada após confirmação
-   Redirecionamento para "Meus Agendamentos"
-   Auto-fechar após 5 segundos

## 🎨 Componentes

-   `PassoEscolhaProfissional` - Seleção de profissional
-   `PassoEscolhaDataHora` - Calendário e horários
-   `PassoConfirmacao` - Resumo final

## 🔧 API Endpoints

-   `GET /api/estabelecimentos` - Listar todos
-   `GET /api/estabelecimentos/:id` - Detalhes
-   `GET /api/estabelecimentos/:id/servicos` - Serviços
-   `GET /api/estabelecimentos/:id/profissionais` - Profissionais
-   `POST /api/agendamentos` - Criar agendamento

## 📦 Dados Mock

Arquivo `api/database.js` contém:

-   3 Estabelecimentos
-   8 Serviços
-   5 Profissionais
-   5 Agendamentos de exemplo

## 🚀 Como Testar

```bash
# API
cd api && npm install && node server.js

# Frontend
npm run dev
```

**Fluxo**: `/Agendar` → Escolher estabelecimento → Serviço → Profissional →
Data/Hora → Confirmar → Sucesso

## ✨ Features

✅ Responsivo (mobile, tablet, desktop)  
✅ Tema claro/escuro  
✅ Animações suaves  
✅ Loading spinners  
✅ Validações (datas, horários)  
✅ Estados: Pendente, Confirmado, Concluído, Cancelado

## � Ver Também

-   [API_SPECIFICATION.md](./API_SPECIFICATION.md) - Especificação completa da
    API
