<p align="center">
  <img src="https://img.shields.io/badge/Financy-Gestão%20Financeira-168054?style=for-the-badge" alt="Financy" />
</p>

<h1 align="center">💰 Financy</h1>

<p align="center">
  <strong>Aplicação FullStack de Gerenciamento de Finanças Pessoais</strong>
  <br />
  API GraphQL + React com TypeScript
</p>

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/GraphQL-E10098?style=flat-square&logo=graphql&logoColor=white" alt="GraphQL" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white" alt="SQLite" />
  <img src="https://img.shields.io/badge/Apollo%20Server-311C87?style=flat-square&logo=apollographql&logoColor=white" alt="Apollo Server" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
</p>

---

## 📋 Sobre o Projeto

O **Financy** é uma aplicação FullStack desenvolvida como desafio prático da Pós-Graduação da Rocketseat. O objetivo é criar uma plataforma que permita aos usuários organizar suas finanças pessoais através do gerenciamento de **transações** e **categorias**.

### Funcionalidades Principais

- ✅ **Autenticação de usuários** — Criação de conta e login com JWT
- ✅ **Gerenciamento de Transações** — CRUD completo (criar, listar, editar, deletar)
- ✅ **Gerenciamento de Categorias** — CRUD completo (criar, listar, editar, deletar)
- ✅ **Dashboard Financeiro** — Visão geral com saldo, receitas, despesas e transações recentes
- ✅ **Filtros Avançados** — Busca por descrição, tipo (entrada/saída), categoria e período
- ✅ **Isolamento de Dados** — Cada usuário vê e gerencia apenas seus próprios dados
- ✅ **Confirmação de Exclusão por Modal** — Exclusão de categorias e transações com modal de confirmação
- ✅ **Privacidade de Dados** — Toggle para ocultar valores sensíveis na interface
- ✅ **Layout Responsivo** — Header, navegação e páginas adaptados para desktop/mobile

### Melhorias Recentes

- ✅ **Correção do `register` no GraphQL** — Merge profundo dos resolvers por módulo, evitando sobrescrita de `Mutation`.
- ✅ **Ícones locais integrados** — Aplicação passou a usar os SVGs de `frontend/src/assets/Icon` via `IconMapper`.
- ✅ **Pipeline de estilo estabilizado** — Configuração de PostCSS adicionada para garantir processamento do Tailwind.
- ✅ **Modais de edição implementados** — Edição de categorias e transações agora abre modal no mesmo padrão da criação.
- ✅ **Modal de exclusão implementado** — Substituição de `alert/confirm` por componente reutilizável de confirmação.
- ✅ **Data de transação validada ponta a ponta** — Campo de data no formulário, validação no frontend e backend, e serialização consistente em ISO no GraphQL.
- ✅ **Filtro de período funcional** — Dropdown de período preenchido dinamicamente e formatado como `Mês / Ano`.
- ✅ **Categorias com identidade visual persistente** — Ícone e cor da categoria são salvos no banco e refletidos na UI.
- ✅ **CORS habilitado no backend** — API pronta para consumo pelo frontend local durante desenvolvimento/avaliação.

### Tecnologias Utilizadas

| Camada | Tecnologia | Finalidade |
|--------|-----------|------------|
| **Backend** | TypeScript | Linguagem principal |
| | GraphQL (Apollo Server) | API de consultas e mutations |
| | Prisma ORM | Modelagem e acesso a dados |
| | SQLite | Banco de dados local |
| | bcryptjs | Hash de senhas |
| | jsonwebtoken | Autenticação JWT |
| **Frontend** | React 18 | Biblioteca de interface |
| | Vite | Bundler e dev server |
| | Apollo Client | Consumo da API GraphQL |
| | TailwindCSS | Estilização utilitária |
| | Zod | Validação de formulários |
| | React Hook Form | Gerenciamento de formulários |
| | SVGs locais + IconMapper | Ícones da aplicação |
| | Radix UI | Componentes acessíveis (Dialog, Select) |

---

## 🏗️ Estrutura do Projeto

```
financy/
├── backend/                    # API GraphQL
│   ├── prisma/
│   │   ├── schema.prisma       # Modelo de dados (User, Category, Transaction)
│   │   ├── migrations/          # Histórico de migrations do Prisma
│   │   └── dev.db              # Banco SQLite local
│   ├── src/
│   │   ├── server.ts           # Ponto de entrada do servidor
│   │   ├── graphql/
│   │   │   ├── modules/        # Módulos GraphQL por domínio
│   │   │   │   ├── auth/       # Autenticação (register, login)
│   │   │   │   ├── category/   # Categorias (CRUD)
│   │   │   │   └── transaction/# Transações (CRUD)
│   │   │   ├── context.ts      # Contexto JWT
│   │   │   └── schema.ts       # Schema unificado
│   │   ├── lib/
│   │   │   └── prisma.ts       # Cliente Prisma singleton
│   │   └── services/           # Lógica de negócio
│   │       ├── auth.service.ts
│   │       ├── category.service.ts
│   │       └── transaction.service.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # Aplicação React
│   ├── src/
│   │   ├── main.tsx            # Ponto de entrada
│   │   ├── App.tsx             # Componente raiz com navegação
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx  # Contexto de autenticação
│   │   ├── graphql/
│   │   │   ├── client.ts       # Apollo Client configurado
│   │   │   ├── mutations/      # Mutations GraphQL
│   │   │   └── queries/        # Queries GraphQL
│   │   ├── lib/
│   │   │   └── icon-mapper.tsx # Mapeador de ícones para SVGs locais
│   │   ├── assets/
│   │   │   └── Icon/            # Biblioteca de ícones SVG do projeto
│   │   ├── pages/
│   │   │   ├── auth/           # Login e Register
│   │   │   └── dashboard/      # Dashboard, Transações, Categorias
│   │   ├── components/
│   │   │   └── ConfirmDeleteModal.tsx # Modal reutilizável de confirmação
│   │   └── styles/
│   │       └── global.css      # Estilos globais Tailwind
│   ├── .env.example
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── package.json
│
├── docs/                       # Documentação do plano de ação
│   ├── backend/
│   │   └── PLANO_DE_ACAO.md    # Correções pendentes do backend
│   └── frontend/
│       └── PLANO_DE_ACAO.md    # Correções pendentes do frontend
│
└── README.md                   # Este arquivo
```

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

- **Node.js** v18+ (recomendado: v20 LTS)
- **npm** v9+ ou **pnpm** v8+
- **Git**

### 1. Clone o repositório

```bash
git clone https://github.com/vzeizer/financy_rocketseat.git
cd financy_rocketseat
```

---

### 2. Backend

#### 2.1. Configure as variáveis de ambiente

```bash
cd backend
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# URL de conexão com o banco SQLite local
DATABASE_URL="file:./dev.db"

# Chave secreta para assinatura e validação dos tokens JWT
JWT_SECRET="sua_chave_secreta_aqui"

# Porta de execução do servidor (opcional, padrão: 4000)
PORT=4000
```

#### 2.2. Instale as dependências

```bash
npm install
```

#### 2.3. Execute as migrations do Prisma

```bash
npm run prisma:migrate
```

> Isso criará o banco SQLite (`dev.db`) com as tabelas `User`, `Category` e `Transaction`.

> Caso queira visualizar os dados: `npm run prisma:studio`

#### 2.4. Inicie o servidor

```bash
npm run dev
```

O servidor GraphQL estará disponível em: **http://localhost:4000**

> A interface GraphQL Playground estará acessível pelo navegador para testar queries e mutations.

---

### 3. Frontend

#### 3.1. Configure as variáveis de ambiente

```bash
cd frontend
cp .env.example .env
```

Edite o arquivo `.env`:

```env
VITE_BACKEND_URL=http://localhost:4000
```

#### 3.2. Instale as dependências

```bash
npm install
```

#### 3.3. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

O frontend estará disponível em: **http://localhost:3000**

---

## 🧪 Testes Unitários

### Backend

```bash
cd backend
npm test
```

> Executa os testes dos serviços: `auth.service`, `category.service`, `transaction.service`

### Frontend

```bash
cd frontend
npm test
```

> Executa os testes dos componentes principais: `App`, `Login`, `Register`, `Categories`, `Transactions`, `Dashboard`

---

## ✅ Verificando Requisitos do Desafio

O desafio exige as seguintes funcionalidades, todas implementadas:

### Backend (Obrigatórios)
- [x] Usuário pode criar uma conta e fazer login
- [x] Usuário pode ver e gerenciar apenas transações e categorias criadas por ele
- [x] Criar transação
- [x] Deletar transação
- [x] Editar transação
- [x] Listar todas as transações
- [x] Criar categoria
- [x] Deletar categoria
- [x] Editar categoria
- [x] Listar todas as categorias

### Frontend (Obrigatórios)
- [x] Usuário pode criar uma conta e fazer login
- [x] Usuário pode ver e gerenciar apenas transações e categorias criadas por ele
- [x] Criar transação
- [x] Deletar transação
- [x] Editar transação (via modal)
- [x] Listar todas as transações
- [x] Criar categoria
- [x] Deletar categoria
- [x] Editar categoria (via modal)
- [x] Listar todas as categorias

### Tecnologias (Obrigatórias)
- [x] TypeScript
- [x] GraphQL
- [x] Prisma
- [x] SQLite
- [x] React
- [x] Vite
- [x] TailwindCSS (opcional, mas implementado)
- [x] Apollo Client (consumo da API GraphQL)

---

## 🧪 Testando a Aplicação

### Fluxo Completo

1. **Acesse** `http://localhost:3000`
2. **Crie uma conta** — Clique em "Criar conta" e preencha nome, e-mail e senha
3. **Crie categorias** — Navegue até "Categorias" e crie categorias como Alimentação, Transporte, etc.
4. **Crie transações** — Navegue até "Transações" e registre receitas e despesas
5. **Visualize o Dashboard** — Acompanhe saldo total, receitas, despesas e transações recentes
6. **Gerencie seus dados** — Edite e exclua transações e categorias conforme necessário

### Testando a API Diretamente

Com o backend rodando, acesse `http://localhost:4000` para abrir o GraphQL Playground.

**Exemplo: Criar um usuário**

```graphql
mutation Register {
  register(name: "João Silva", email: "joao@email.com", password: "123456") {
    token
    user { id name email }
  }
}
```

**Exemplo: Listar transações (autenticado)**

```graphql
query ListTransactions {
  transactions {
    id
    title
    amount
    type
    date
    category { id name }
  }
}
```

---

## 🛣️ Rotas da Aplicação

### Backend — API GraphQL

| Mutation | Descrição | Autenticação |
|----------|-----------|:---:|
| `register(name, email, password)` | Criar nova conta | ❌ |
| `login(email, password)` | Fazer login | ❌ |
| `createCategory(name, icon?, color?)` | Criar categoria | ✅ |
| `updateCategory(id, name, icon?, color?)` | Editar categoria | ✅ |
| `deleteCategory(id)` | Excluir categoria | ✅ |
| `createTransaction(title, amount, type, categoryId, date)` | Criar transação | ✅ |
| `updateTransaction(id, title, amount, type, categoryId, date?)` | Editar transação | ✅ |
| `deleteTransaction(id)` | Excluir transação | ✅ |

| Query | Descrição | Autenticação |
|-------|-----------|:---:|
| `categories` | Listar categorias do usuário | ✅ |
| `transactions` | Listar transações do usuário | ✅ |

### Frontend — Páginas

| Rota | Página | Descrição |
|------|--------|-----------|
| `/` | Login / Dashboard | Tela de login se deslogado, dashboard se logado |

> A navegação interna é feita por abas (Dashboard, Transações, Categorias).

---

## 🧰 Modelo de Dados

```prisma
model User {
  id           String        @id @default(uuid())
  name         String
  email        String        @unique
  password     String        # Hash com bcrypt
  transactions Transaction[]
  categories   Category[]
  createdAt    DateTime      @default(now())
}

model Category {
  id           String        @id @default(uuid())
  name         String
  icon         String        @default("tag.svg")
  color        String        @default("#2563EB")
  userId       String
  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  transactions Transaction[]
  createdAt    DateTime      @default(now())
}

model Transaction {
  id         String    @id @default(uuid())
  title      String
  amount     Float
  type       String    // "INCOME" ou "EXPENSE"
  userId     String
  user       User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  categoryId String
  category   Category  @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  date       DateTime  @default(now())
}
```

---

## 🎨 Paleta de Cores (Style Guide)

O design segue o layout do Figma com a seguinte paleta definida no Tailwind:

| Token | Cor | Uso |
|-------|-----|-----|
| `brand-dark` | `#0F5237` | Hover de botões |
| `brand-primary` | `#168054` | Botões e destaques principais |
| `brand-light` | `#EAF8F2` | Fundo de sucesso |
| `feedback-error` | `#EF4444` | Valores de saída/erro |
| `feedback-success` | `#22C55E` | Valores de entrada |
| `neutral-darkest` | `#0F172A` | Texto principal |
| `neutral-medium` | `#94A3B8` | Placeholders |
| `neutral-light` | `#E2E8F0` | Bordas |
| `neutral-bg` | `#F8FAFC` | Fundo da aplicação |

---

## 📚 Documentação Adicional

- [Plano de Ação — Backend](docs/backend/PLANO_DE_ACAO.md) — Correções e melhorias pendentes no backend
- [Plano de Ação — Frontend](docs/frontend/PLANO_DE_ACAO.md) — Correções e melhorias pendentes no frontend
- [Especificações do Desafio](instructions/DesafioPratico_Financy_Rocketseat.pdf) — PDF com requisitos originais
- [Style Guide - Figma](instructions/Estilos.pdf) — Guia de estilos do layout
- [Layout das Páginas - Figma](instructions/figma_financy.pdf) — Design das telas

---

## 🚧 Melhorias Futuras

- [ ] Upload de avatar do usuário
- [ ] Paginação no backend (atualmente a filtragem é feita no frontend)
- [ ] Filtro por período funcional no backend
- [ ] Testes automatizados (unitários e E2E)
- [ ] Melhorar cobertura de testes para fluxos de modal e responsividade
- [ ] Dark mode

---

## 📝 Licença

Este projeto foi desenvolvido para fins educacionais como parte do desafio prático da **Pós-Graduação Rocketseat**.

---

<p align="center">
  <sub>Desenvolvido com 💚 por <a href="https://github.com/vzeizer">vzeizer</a></sub>
</p>