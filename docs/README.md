# 📚 Documentação AgendaAi

Bem-vindo à documentação do projeto AgendaAi! Este diretório contém toda a
documentação técnica necessária para entender, desenvolver e manter o sistema.

## 📖 Índice de Documentos

### 🚀 Essencial

-   **[API_SPECIFICATION.md](./API_SPECIFICATION.md)** - Especificação completa
    da API
    -   Stack frontend (Next.js, React, TypeScript)
    -   10 categorias de endpoints (Auth, Estabelecimentos, Serviços, etc.)
    -   Modelos de dados TypeScript
    -   Schemas SQL para PostgreSQL
    -   Exemplos de implementação Node.js/Express
    -   Validações e segurança (JWT, bcrypt)

### 📐 Arquitetura

-   **[STRUCTURE.md](./STRUCTURE.md)** - Estrutura de pastas do projeto
    -   Organização de diretórios
    -   Convenções de nomenclatura
    -   Padrões de arquivos

### 🔐 Autenticação

-   **[AUTH.md](./AUTH.md)** - Sistema de autenticação (legado)

    -   Hooks de autenticação (`useAuth`)
    -   Utilitários de token JWT
    -   Fluxo de login/logout

-   **[AUTHENTICATION.md](./AUTHENTICATION.md)** - ⭐ **Sistema Completo de
    Autenticação**
    -   Login e cadastro para clientes e estabelecimentos
    -   Clean Architecture aplicada
    -   Hooks completos (`useAuthentication`)
    -   Componentes de formulário reutilizáveis
    -   Integração com API REST
    -   Exemplos de uso e testes

### 🏗️ Refatorações

-   **[REFACTORING.md](./REFACTORING.md)** - Histórico de refatorações gerais

    -   Melhorias implementadas
    -   Estrutura de pastas
    -   Componentes refatorados
    -   Convenções estabelecidas

-   **[REFACTORING_ESTABELECIMENTO.md](./REFACTORING_ESTABELECIMENTO.md)** -
    Refatoração Clean Architecture

    -   Área do estabelecimento
    -   Componentes e hooks específicos
    -   Páginas pendentes de implementação

-   **[REFACTORING_ESTABELECIMENTO_API.md](./REFACTORING_ESTABELECIMENTO_API.md)** -
    ⭐ **Integração com API REST**
    -   Serviços criados (estabelecimento, agendamento, serviço, profissional)
    -   Hooks refatorados com autenticação JWT
    -   Dashboard consumindo API real
    -   Próximas páginas a implementar

### 📅 Funcionalidades

-   **[AGENDAMENTO_IMPLEMENTACAO.md](./AGENDAMENTO_IMPLEMENTACAO.md)** - Sistema
    de agendamento
    -   Fluxo completo (3 passos)
    -   Calendário interativo
    -   Integração com API
    -   Comparação com protótipo

### 💡 Exemplos

-   **[EXAMPLES.md](./EXAMPLES.md)** - Exemplos de código
    -   Uso de componentes UI
    -   Hooks customizados
    -   Funções utilitárias
    -   Padrões de criação de novos componentes

## 🎯 Por Onde Começar?

### Para desenvolvedores novos no projeto:

1. Leia **API_SPECIFICATION.md** para entender a arquitetura completa
2. Revise **STRUCTURE.md** para conhecer a organização de pastas
3. Explore **EXAMPLES.md** para ver padrões de código

### Para implementar a API:

-   Consulte **API_SPECIFICATION.md** - documento principal com tudo que você
    precisa

### Para adicionar novas features:

1. **EXAMPLES.md** - Ver padrões de componentes/hooks
2. **REFACTORING_ESTABELECIMENTO.md** - Ver estrutura Clean Architecture
3. **AGENDAMENTO_IMPLEMENTACAO.md** - Ver exemplo de implementação completa

### Para trabalhar com autenticação:

-   **AUTHENTICATION.md** ⭐ - Sistema completo implementado (login, cadastro,
    logout)
-   **AUTH.md** - Documentação legada de utilitários

## 📝 Convenções de Documentação

-   Todos os documentos usam formato Markdown
-   Código de exemplo em blocos cercados (```)
-   Emojis para melhor navegação visual
-   Links entre documentos quando relevante

## 🔄 Atualização

Esta documentação é mantida sincronizada com o código. Ao fazer mudanças
significativas no projeto, atualize os documentos correspondentes.

---

**Última atualização**: Janeiro 2025  
**Versão do Projeto**: Next.js 15.5.4 | React 19 | TypeScript 5
