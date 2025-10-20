# Estrutura de Componentes - AgendaAi

## 📁 Organização de Componentes

### **UI Components** (`src/components/ui/`)

Componentes reutilizáveis sem lógica de negócio, focados em apresentação.

#### `Logo.tsx`

-   **Propósito**: Exibir o logotipo do sistema
-   **Variantes**:
    -   `full`: Logo completo com texto
    -   `icon`: Apenas o ícone
-   **Tamanhos**: `sm`, `md`, `lg`

#### `NavItem.tsx`

-   **Propósito**: Item individual de navegação com ícone e label
-   **Funcionalidades**:
    -   Destaque automático da página ativa
    -   Tooltip quando sidebar está colapsada
    -   Suporte a tema claro/escuro

#### `NavSection.tsx`

-   **Propósito**: Agrupar itens de navegação com título de seção
-   **Funcionalidades**:
    -   Oculta título quando sidebar está colapsada
    -   Exibe separador visual no modo colapsado

#### `ToggleButton.tsx`

-   **Propósito**: Botão para expandir/recolher sidebar
-   **Funcionalidades**:
    -   Animação de rotação do ícone
    -   Tooltip descritivo

#### `Switch.tsx`

-   **Propósito**: Componente de alternância (toggle switch)
-   **Props**:
    -   `checked`: Estado atual
    -   `onCheckedChange`: Callback de mudança
    -   `label`: Texto descritivo (opcional)
    -   `disabled`: Estado desabilitado

#### `SettingsCard.tsx`

-   **Propósito**: Card estilizado para seções de configurações
-   **Uso**: Agrupar configurações relacionadas

#### `SettingsItem.tsx`

-   **Propósito**: Item individual de configuração
-   **Props**:
    -   `label`: Título da configuração
    -   `description`: Descrição opcional
    -   `control`: Elemento de controle (switch, select, etc.)

---

### **Layout Components** (`src/components/layout/`)

Componentes estruturais que compõem o layout da aplicação.

#### `Sidebar.tsx`

-   **Propósito**: Barra lateral de navegação principal
-   **Funcionalidades**:
    -   Estado colapsado persistente (localStorage)
    -   Sincronização entre eventos
    -   Oculta automaticamente no mobile
    -   Suporte a scrollbar escondida

#### `SidebarToggle.tsx`

-   **Propósito**: Controle de expansão/recolhimento da sidebar
-   **Funcionalidades**:
    -   Posicionamento dinâmico sobre a borda da sidebar
    -   Sincronização com estado da sidebar
    -   Eventos customizados para comunicação

#### `TopBar.tsx`

-   **Propósito**: Barra superior do sistema
-   **Funcionalidades**:
    -   Logo responsiva (completa no mobile, simples no desktop)
    -   Link de ação opcional (trocar entre áreas)

#### `MobileNav.tsx`

-   **Propósito**: Navegação inferior para dispositivos móveis
-   **Funcionalidades**:
    -   Visível apenas em telas pequenas
    -   Destaque do item ativo
    -   Ícones e labels personalizáveis

---

## 🎨 Páginas de Configurações

### Cliente: `src/app/(app)/configuracoes/page.tsx`

### Estabelecimento: `src/app/(busines)/estabelecimento/configuracoes/page.tsx`

Ambas as páginas possuem:

-   **Switch de Tema**: Integrado com `ThemeContext`
-   **Seleção de Idioma**
-   **Configurações de Segurança**
-   **Gerenciamento de Conta**

---

## 🔧 Como Usar

### Exemplo: Adicionando novo item ao menu

```tsx
<NavSection title="Minha Seção">
	<NavItem href="/minha-rota" icon={MeuIcone} label="Minha Página" />
</NavSection>
```

### Exemplo: Criando card de configuração

```tsx
<SettingsCard title="Título da Seção">
	<SettingsItem
		label="Minha Config"
		description="Descrição da configuração"
		control={<Switch checked={value} onCheckedChange={setValue} />}
	/>
</SettingsCard>
```

---

## 🎯 Princípios de Design

1. **Componentização**: Cada componente tem uma responsabilidade única
2. **Reutilização**: Componentes UI são agnósticos de contexto
3. **Composição**: Layout é construído através de composição de componentes
4. **Responsividade**: Todos os componentes são mobile-first
5. **Tema**: Suporte completo a modo claro/escuro
6. **Acessibilidade**: Uso de aria-labels, tooltips e navegação por teclado

---

## 📱 Estrutura de Rotas

### Cliente

-   `/Agendar` - Página de agendamento
-   `/agendamentos` - Meus agendamentos
-   `/historico` - Histórico de serviços
-   `/dados` - Dados pessoais
-   `/financas` - Finanças pessoais
-   `/pagamentos` - Formas de pagamento
-   `/notificacoes` - Notificações
-   `/avaliacoes` - Avaliações
-   `/configuracoes` - **Configurações (com switch de tema)**

### Estabelecimento

-   `/estabelecimento/dashboard` - Dashboard
-   `/estabelecimento/agenda` - Agenda
-   `/estabelecimento/historico` - Histórico
-   `/estabelecimento/servicos` - Gerenciar serviços
-   `/estabelecimento/profissionais` - Profissionais
-   `/estabelecimento/clientes` - Clientes
-   `/estabelecimento/configuracao` - Config. do estabelecimento
-   `/estabelecimento/financeiro` - Ganhos
-   `/estabelecimento/relatorios` - Relatórios
-   `/estabelecimento/configuracoes` - **Configurações (com switch de tema)**

---

## 🚀 Próximos Passos

Para expandir o sistema, você pode:

1. Criar novos componentes UI conforme necessário
2. Adicionar novas seções no menu através de `NavSection` + `NavItem`
3. Implementar as páginas de conteúdo usando os componentes existentes
4. Adicionar mais opções na página de configurações
5. Criar variantes dos componentes UI para casos específicos

---

## 💡 Notas Importantes

-   O ThemeToggle foi **removido** do layout global e **movido para a página de
    configurações**
-   O switch de tema está acessível via `/configuracoes` para clientes e
    `/estabelecimento/configuracoes` para estabelecimentos
-   A sidebar sincroniza seu estado via `localStorage` e eventos customizados
-   Todos os componentes suportam tema claro/escuro automaticamente
-   A navegação mobile substitui a sidebar em telas pequenas
