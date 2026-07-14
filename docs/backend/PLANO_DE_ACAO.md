# Plano de Ação — Backend Financy

## Status Atual e Diagnóstico

O backend do Financy está **parcialmente implementado** — os services, o Prisma schema e os módulos GraphQL estão
estruturados, mas existem duas arquiteturas concorrentes (monolítica vs. modular) que precisam ser unificadas,
além de pequenos bugs de tipagem e import que impedem a aplicação de rodar corretamente.

### ✅ O que já funciona

| Componente | Status |
|------------|--------|
| Prisma Schema (User, Category, Transaction) com SQLite | ✅ |
| Services (auth, category, transaction) com validação de dono do recurso | ✅ |
| Context JWT para autenticação (`userId` no contexto) | ✅ |
| `.env.example` configurado com JWT_SECRET, DATABASE_URL, PORT | ✅ |
| CORS habilitado no Apollo Server | ✅ |
| Separação modular de typeDefs por domínio (auth, category, transaction) | ✅ |
| Separação modular de resolvers por domínio | ✅ |
| Proteção de rotas com `requireAuth()` | ✅ |

### ❌ Problemas identificados

| # | Problema | Localização | Impacto |
|---|----------|-------------|---------|
| 1 | **Duplicação arquitetural**: typeDefs/resolvers monolíticos vs. modulares | `src/graphql/typeDefs.ts` + `src/graphql/resolvers.ts` divergem de `src/graphql/modules/` | O servidor usa o monolítico, deixando os módulos "mortos" |
| 2 | **`@auth` directive não funcional** | `src/graphql/typeDefs.ts` (linhas 32, 35) | `@auth` é uma string literal irreconhecível pelo Apollo Server sem implementação de directive |
| 3 | **Erro de tipo float no TypeScript** | `src/services/transaction.service.ts` (linha 11) | `float` não é um tipo válido; causa erro de compilação |
| 4 | **Import de ExpressContext inválido** | `src/graphql/modules/context.ts` + `src/graphql/resolvers.ts` | `ExpressContext` não existe em `apollo-server` (só em `apollo-server-express`) |
| 5 | **Module schema.ts incompleto** | `src/graphql/modules/schema.ts` | Só importa TransactionService, não faz merge dos schemas |
| 6 | **Falta unificação dos schemas modulares** | Nenhum arquivo combina os typeDefs + resolvers dos 3 módulos | Impede o server de usar a arquitetura modular |

---

## Passo a Passo da Correção

### Passo 1 — Escolher a arquitetura definitiva (Modular)

**Decisão arquitetural:** Manter a estrutura modular (`src/graphql/modules/`) e **remover** os arquivos monolíticos
`src/graphql/typeDefs.ts` e `src/graphql/resolvers.ts`.

**Justificativa:**
- Melhor separação de responsabilidades (cada domínio no seu módulo)
- Facilita manutenção e adição de novos módulos
- Já está parcialmente implementada (os 3 módulos existem)
- Compatível com code-first e schema-first

**Arquivos a remover:**
- `src/graphql/typeDefs.ts`
- `src/graphql/resolvers.ts`

**Arquivos a manter e corrigir:**
- `src/graphql/modules/auth/auth.typeDefs.ts`
- `src/graphql/modules/auth/auth.resolvers.ts`
- `src/graphql/modules/category/category.typeDefs.ts`
- `src/graphql/modules/category/category.resolvers.ts`
- `src/graphql/modules/transaction/transaction.typeDefs.ts`
- `src/graphql/modules/transaction/transaction.resolvers.ts`
- `src/graphql/modules/context.ts`
- `src/graphql/modules/schema.ts`

---

### Passo 2 — Eliminar o `@auth` directive dos typeDefs

**Problema:** O `@auth` nos typeDefs monolíticos (`typeDefs.ts`) não é funcional. Na arquitetura modular escolhida,
a proteção já é feita via `requireAuth(ctx.userId)` dentro dos resolvers (como já está implementado nos módulos).

**Ação:** Não precisa de ação específica — ao remover os typeDefs monolíticos (Passo 1), o `@auth` desaparece
automaticamente. Os resolvers modulares já têm a proteção correta via `requireAuth()`.

---

### Passo 3 — Corrigir o import de `ExpressContext`

**Problema:** `import { ExpressContext } from 'apollo-server-express'` não existe. O projeto usa `apollo-server`,
não `apollo-server-express`.

**Solução:** Usar `ServerInfo` do `apollo-server` ou simplesmente tipar o contexto de forma mais genérica.

**Antes:**
```typescript
import { ExpressContext } from 'apollo-server-express';
```

**Depois:**
```typescript
import { ServerInfo } from 'apollo-server'; // Para o server.listen
```

E o contexto pode ser tipado diretamente sem depender de tipos externos:

```typescript
export interface GraphQLContext {
  userId?: string;
}
```

A função `createContext` recebe `{ req }` que pode ser extraído do `express.Request`:

```typescript
import { Request } from 'express';

interface ContextParams {
  req: Request;
}

export const createContext = ({ req }: ContextParams): GraphQLContext => {
  // ... implementação
};
```

**Arquivos afetados:**
- `src/graphql/modules/context.ts`
- `src/graphql/resolvers.ts` (removido no Passo 1)

---

### Passo 4 — Corrigir tipagem no TransactionService

**Problema:** `amount: float` na linha 11 de `src/services/transaction.service.ts`.

**Solução:** Substituir `float` por `number`.

**Antes:**
```typescript
static async create(data: { title: string; amount: float; type: string; categoryId: string }, userId: string) {
```

**Depois:**
```typescript
static async create(data: { title: string; amount: number; type: string; categoryId: string }, userId: string) {
```

---

### Passo 5 — Unificar os schemas modulares em `schema.ts`

**Problema:** `src/graphql/modules/schema.ts` atual só importa TransactionService e não faz o merge dos schemas.

**Solução:** Reescrever `schema.ts` para combinar os typeDefs e resolvers de todos os módulos usando
`apollo-server`'s `makeExecutableSchema` ou simplesmente concatenando os typeDefs e resolvers.

```typescript
import { gql } from 'apollo-server';
import { authTypeDefs } from './auth/auth.typeDefs';
import { categoryTypeDefs } from './category/category.typeDefs';
import { transactionTypeDefs } from './transaction/transaction.typeDefs';
import { authResolvers } from './auth/auth.resolvers';
import { categoryResolvers } from './category/category.resolvers';
import { transactionResolvers } from './transaction/transaction.resolvers';

// Usar sintaxe extend type (já está nos typeDefs modulares)
export const typeDefs = [
  authTypeDefs,
  categoryTypeDefs,
  transactionTypeDefs,
];

// Combinar resolvers
export const resolvers = {
  ...authResolvers,
  ...categoryResolvers,
  ...transactionResolvers,
};
```

**Nota:** Como os typeDefs modulares já usam `extend type Mutation` e `extend type Query`, é necessário
um **typeDef base** que declare os tipos `Query` e `Mutation` vazios:

```typescript
const baseTypeDefs = gql`
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
`;
```

---

### Passo 6 — Atualizar `server.ts` para usar o schema modular unificado

**Antes:**
```typescript
import { ApolloServer } from 'apollo-server';
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';
import { createContext } from './graphql/context';
```

**Depois:**
```typescript
import { ApolloServer } from 'apollo-server';
import { createContext } from './graphql/modules/context';
import { typeDefs, resolvers } from './graphql/modules/schema';
```

**Atenção:** Se optar por usar `makeExecutableSchema` (recomendado quando há field resolvers ou schemas
mais complexos), a assinatura muda para:

```typescript
import { ApolloServer } from 'apollo-server';
import { createContext } from './graphql/modules/context';
import { schema } from './graphql/modules/schema';

const server = new ApolloServer({
  schema,
  context: createContext,
  cors: { origin: '*', credentials: true },
});
```

---

### Passo 7 (Opcional) — Adicionar Field Resolver para Transaction.category

Embora os services usem `include: { category: true }` para popular a categoria, é uma boa prática
definir um field resolver explícito para o campo `category` de `Transaction`, garantindo que mesmo
que a query não use `include`, a relação seja resolvida corretamente.

```typescript
// No transaction.resolvers.ts, adicionar:
Transaction: {
  category: (parent: any) => {
    if (parent.category) return parent.category;
    return prisma.category.findUnique({ where: { id: parent.categoryId } });
  },
},
```

---

## Estrutura Final Esperada

```
backend/
├── prisma/
│   ├── schema.prisma          ✅ (já está correto)
│   └── dev.db
├── src/
│   ├── server.ts              🔧 (ajustar imports)
│   ├── graphql/
│   │   ├── modules/
│   │   │   ├── schema.ts      🔧 (reescrever para merge)
│   │   │   ├── context.ts     🔧 (corrigir import)
│   │   │   ├── auth/
│   │   │   │   ├── auth.typeDefs.ts     ✅
│   │   │   │   └── auth.resolvers.ts    ✅
│   │   │   ├── category/
│   │   │   │   ├── category.typeDefs.ts ✅
│   │   │   │   └── category.resolvers.ts ✅
│   │   │   └── transaction/
│   │   │       ├── transaction.typeDefs.ts  ✅
│   │   │       └── transaction.resolvers.ts ✅
│   │   ├── typeDefs.ts        🗑️ (remover)
│   │   └── resolvers.ts       🗑️ (remover)
│   ├── lib/
│   │   └── prisma.ts          ✅
│   └── services/
│       ├── auth.service.ts        ✅
│       ├── category.service.ts    ✅
│       └── transaction.service.ts 🔧 (corrigir tipagem)
├── .env.example               ✅
└── package.json               ✅
```

**Legenda:** ✅ = OK | 🔧 = Precisa corrigir | 🗑️ = Remover

---

## Checklist de Implementação

- [ ] **Passo 1:** Criar base typeDefs e reescrever `schema.ts` para unificar typeDefs + resolvers modulares
- [ ] **Passo 2:** Corrigir import de `ExpressContext` em `context.ts`
- [ ] **Passo 3:** Corrigir tipagem `float` → `number` em `transaction.service.ts`
- [ ] **Passo 4:** Atualizar `server.ts` para importar do schema modular
- [ ] **Passo 5:** Remover `typeDefs.ts` e `resolvers.ts` monolíticos (opcional, mas recomendado para evitar confusão)
- [ ] **Passo 6 (opcional):** Adicionar field resolver Transaction.category
- [ ] **Teste Final:** Rodar `npm run dev` e validar GraphQL Playground
- [ ] **Teste Final:** Rodar `npx prisma studio` para confirmar dados
- [ ] **Teste Final:** Testar fluxo completo (register → login → CRUD categorias → CRUD transações)