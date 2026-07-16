# GraphQL - Guia de Conceitos e Implementação

## O que é GraphQL?

GraphQL é uma linguagem de consulta de APIs e um runtime para executar essas consultas com seus dados existentes. Foi desenvolvida pelo Facebook em 2012 e open-sourced em 2015. Diferente de APIs REST tradicionais, GraphQL permite que o cliente especifique exatamente que dados ele precisa, retornando apenas essas informações.

---

## Principais Conceitos

### Schema

O schema é a definição central de uma API GraphQL. Ele descreve todos os tipos de dados disponíveis, operações (queries e mutations) e relações entre eles.

```graphql
# Exemplo do Financy
type User {
  id: ID!
  name: String!
  email: String!
  categories: [Category!]!
  transactions: [Transaction!]!
}

type Category {
  id: ID!
  name: String!
  userId: String!
  user: User!
}

type Transaction {
  id: ID!
  title: String!
  amount: Float!
  type: String!
  date: String!
  userId: String!
  categoryId: String!
}
```

### Type Definitions (typeDefs)

As typeDefs são a definição dos tipos GraphQL em código. No Financy, elas estão organizadas por módulo:

```
backend/src/graphql/modules/
├── auth/
│   └── auth.typeDefs.ts    # typeDefs de autenticação
├── category/
│   └── category.typeDefs.ts # typeDefs de categorias
└── transaction/
    └── transaction.typeDefs.ts # typeDefs de transações
```

**Exemplo de typeDefs no Financy:**

```typescript
// auth.typeDefs.ts
import { gql } from 'apollo-server';

export const authTypeDefs = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
  }

  type AuthPayload {
    token: String!
    user: User!
  }
`;
```

### Resolvers

Resolvers são funções que respondem a cada campo no schema. Eles contêm a lógica de negócio para buscar ou modificar dados.

```
backend/src/graphql/modules/
├── auth/
│   └── auth.resolvers.ts    # Resolvers de autenticação
├── category/
│   └── category.resolvers.ts # Resolvers de categorias
└── transaction/
    └── transaction.resolvers.ts # Resolvers de transações
```

**Exemplo de resolver no Financy:**

```typescript
// category.resolvers.ts
export const categoryResolvers = {
  Query: {
    categories: (_: any, __: any, context: Context) => {
      return CategoryService.listAll(context.userId);
    },
  },
  Mutation: {
    createCategory: (_: any, { name }: { name: string }, context: Context) => {
      return CategoryService.create(name, context.userId);
    },
    updateCategory: (_: any, { id, name }: { id: string; name: string }, context: Context) => {
      return CategoryService.update(id, name, context.userId);
    },
    deleteCategory: (_: any, { id }: { id: string }, context: Context) => {
      return CategoryService.delete(id, context.userId);
    },
  },
};
```

### Context

O contexto em GraphQL é um objeto compartilhado por todos os resolvers. No Financy, é usado para autenticação:

```typescript
// context.ts
import { prisma } from '../lib/prisma';
import jwt from 'jsonwebtoken';

export const context = async ({ req }: { req: any }) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) return { userId: null };
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
    return { userId: payload.userId };
  } catch {
    return { userId: null };
  }
};
```

---

## Dores que o GraphQL Resolve

### 1. Over-fetching

**Problema REST:**
```
GET /api/users/123
Retorna: { id, name, email, password, createdAt, updatedAt, ...15 campos }
Mas o frontend só precisa: { id, name }
```

**Solução GraphQL:**
```graphql
query {
  user(id: "123") {
    id
    name
  }
}
# Retorna apenas o necessário
```

### 2. Under-fetching

**Problema REST:**
```
GET /api/users/123          # Dados do usuário
GET /api/users/123/transactions  # Transações do usuário
GET /api/users/123/categories    # Categorias do usuário
# 3 requisições para montar a tela
```

**Solução GraphQL:**
```graphql
query {
  user(id: "123") {
    id
    name
    transactions {
      id
      title
      amount
    }
    categories {
      id
      name
    }
  }
}
# 1 requisição com todos os dados
```

### 3. Versioning de API

**Problema REST:**
- Precisa criar `/api/v2/users` quando queremos novos campos
- Manutenção de múltiplas versões

**Solução GraphQL:**
- Schema evolui naturalmente
- Campos novos são adicionados sem quebrar consultas existentes
- Campos obsoletos podem ser depreciados

### 4. Type Safety

GraphQL fornece tipagem forte tanto no backend quanto no frontend:
- Erros de tipo são detectados em tempo de compilação
- IDE oferece autocompletar baseado no schema
- Documentação automática via GraphQL Playground

---

## GraphQL no Financy

### Estrutura Implementada

```
backend/src/graphql/
├── modules/
│   ├── auth/
│   │   ├── auth.typeDefs.ts
│   │   └── auth.resolvers.ts
│   ├── category/
│   │   ├── category.typeDefs.ts
│   │   └── category.resolvers.ts
│   └── transaction/
│       ├── transaction.typeDefs.ts
│       └── transaction.resolvers.ts
├── context.ts
└── schema.ts
```

### Schema Unificado

```typescript
// schema.ts
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { authTypeDefs } from './modules/auth/auth.typeDefs';
import { categoryTypeDefs } from './modules/category/category.typeDefs';
import { transactionTypeDefs } from './modules/transaction/transaction.typeDefs';

export const typeDefs = mergeTypeDefs([
  authTypeDefs,
  categoryTypeDefs,
  transactionTypeDefs,
]);

export const resolvers = mergeResolvers([
  authResolvers,
  categoryResolvers,
  transactionResolvers,
]);
```

### Autenticação no Contexto

O Financy usa JWT no contexto GraphQL para garantir que cada usuário veja apenas seus dados:

```graphql
# Query protegida - só retorna dados do usuário autenticado
query {
  transactions {
    id
    title
    amount
    category {
      name
    }
  }
}
```

---

## GraphQL vs REST vs gRPC

### GraphQL

| Característica | Detalhe |
|---------------|-------|
| **Protocolo** | HTTP/HTTPS (mas pode ser WebSocket) |
| **Formato** | Texto (query/mutation) |
| **Versioning** | Não precisa (schema evolui) |
| **Over-fetching** | ❌ Não existe |
| **Under-fetching** | ❌ Não existe |
| **Caching** | Complexo (Apollo Client ajuda) |
| **Type Safety** | ✅ Excelente |
| **Documentação** | Automática (GraphQL Playground) |
| **Curva de Aprendizado** | Média |

### REST

| Característica | Detalhe |
|---------------|-------|
| **Protocolo** | HTTP/HTTPS |
| **Formato** | JSON |
| **Versioning** | Necessário (/api/v1, /api/v2) |
| **Over-fetching** | ✅ Comum |
| **Under-fetching** | ✅ Comum |
| **Caching** | ✅ Simples (HTTP caching) |
| **Type Safety** | ❌ Dependente de bibliotecas |
| **Documentação** | Manual (Swagger/OpenAPI) |
| **Curva de Aprendizado** | Baixa |

### gRPC

| Característica | Detalhe |
|---------------|-------|
| **Protocolo** | HTTP/2 (binário) |
| **Formato** | Protocol Buffers |
| **Versioning** | Complexo |
| **Over-fetching** | ❌ Não existe |
| **Under-fetching** | ❌ Não existe |
| **Caching** | ❌ Não suportado |
| **Type Safety** | ✅ Excelente |
| **Documentação** | Automática |
| **Curva de Aprendizado** | Alta |

---

## Vantagens do GraphQL

### 1. **Flexibilidade**
- Frontend decide quais dados buscar
- Uma única endpoint para todas as operações

### 2. **Type Safety**
- Schema como fonte da verdade
- Autocompletar e validação em tempo real

### 3. **Desenvolvimento Ágil**
- GraphQL Playground para testar queries
- Hot reload de schema

### 4. **Evolução de API**
- Adicionar campos não quebra clientes existentes
- Depreciação controlada

### 5. **Ferramentas**
- Apollo Studio para monitoramento
- Apollo Client para cache inteligente
- GraphQL Code Generator

---

## Desvantagens do GraphQL

### 1. **Complexidade**
- Aprendizado inicial mais alto que REST
- Necessita entender conceitos novos (schema, resolvers, etc)

### 2. **Caching**
- Mais complexo que HTTP caching
- Requer bibliotecas como Apollo Client

### 3. **File Upload**
- Não suportado nativamente
- Requer implementações customizadas

### 4. **Error Handling**
- Erros em formato diferente
- HTTP status sempre 200 (mesmo com erros)

### 5. **Over-engineering**
- Para APIs simples, pode ser exagero
- Mais código boilerplate

---

## Quando Usar GraphQL?

### ✅ Use GraphQL quando:
- Frontend precisa de diferentes conjuntos de dados
- API precisa evoluir frequentemente
- Equipe valoriza Type Safety
- Aplicação tem muitas entidades relacionadas
- Performance de rede é crítica

### ❌ Use REST quando:
- API simples com poucos recursos
- Necessita caching HTTP simples
- Equipe não tem experiência com GraphQL
- Requisições simples e previsíveis

---

## Exemplos de Uso no Financy

### Registro de Usuário

```graphql
mutation Register {
  register(name: "João Silva", email: "joao@email.com", password: "123456") {
    token
    user {
      id
      name
      email
    }
  }
}
```

### Criar Categoria

```graphql
mutation CreateCategory {
  createCategory(name: "Alimentação") {
    id
    name
  }
}
```

### Criar Transação

```graphql
mutation CreateTransaction {
  createTransaction(
    title: "Salário",
    amount: 5000,
    type: "INCOME",
    categoryId: "123"
  ) {
    id
    title
    amount
    type
    date
    category {
      id
      name
    }
  }
}
```

### Listar Transações

```graphql
query ListTransactions {
  transactions {
    id
    title
    amount
    type
    date
    category {
      id
      name
    }
  }
}
```

---

## Conclusão

GraphQL foi escolhido para o Financy por ser uma tecnologia obrigatória do desafio e por oferecer benefícios significativos para aplicações de gerenciamento de dados como esta. A capacidade de buscar apenas os campos necessários, combinar múltiplas entidades em uma única requisição e manter type safety entre frontend e backend torna o desenvolvimento mais eficiente e a aplicação mais performática.