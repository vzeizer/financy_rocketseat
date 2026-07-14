# Plano de Ação — Frontend Financy

## Status Atual e Diagnóstico

O frontend do Financy está **parcialmente implementado** — a estrutura de páginas, componentes, contexto de
autenticação e cliente GraphQL estão configurados, mas existem **4 erros críticos que impedem o build**,
além de funcionalidades obrigatórias não implementadas e inconsistências com o backend.

---

### ✅ O que já funciona

| Componente | Status |
|------------|--------|
| Apollo Client com auth link (Bearer token) | ✅ |
| AuthContext com persistência em localStorage | ✅ |
| Página de Login com validação Zod + mutation | ✅ |
| Dashboard com KPIs (saldo, receitas, despesas) | ✅ |
| Página de Transações com filtros (busca, tipo, categoria, período) | ✅ |
| Página de Categorias com grid de cards e indicadores | ✅ |
| Tailwind Config completo (brand, feedback, tag, font Inter) | ✅ |
| IconMapper usando lucide-react | ✅ |
| Modal de criação de categoria (NewCategoryModal) | ✅ |
| Modal de criação de transação (NewTransactionalModal) | ✅ |
| Tema de cores e estilos alinhados ao Figma | ✅ |

---

### ❌ Problemas identificados

#### 🔴 CRÍTICOS — Impedem o build/execução

| # | Problema | Arquivo | Linha | Solução |
|---|----------|---------|-------|---------|
| 1 | **`zod.create` não existe** | `NewTransactionalModal.tsx` | 6 | Trocar `zod.create({...})` por `zod.object({...})` |
| 2 | **Import de `Dashboard` (sem 's')** | `App.tsx` | 4 | O arquivo real é `Dashboards.tsx`. Corrigir import para `./pages/dashboard/Dashboards` |
| 3 | **Import de `NewTransactionModal` (sem 'al')** | `Transactions.tsx` | 4 | O arquivo real é `NewTransactionalModal.tsx`. Corrigir import |
| 4 | **Import de `globals.css` (com 's')** | `main.tsx` | 7 | O arquivo real é `global.css` (sem 's'). Corrigir import |

#### 🟡 FUNCIONAIS — Funcionalidades obrigatórias não implementadas

| # | Problema | Detalhes | Solução |
|---|----------|----------|---------|
| 5 | **Register inacessível** | `App.tsx` só renderiza `<Login />` quando deslogado. Não há como acessar a tela de cadastro | Adicionar toggle entre Login e Register no `App.tsx` |
| 6 | **Botões Edit/Delete sem ação** | `Transactions.tsx:174-179` e `Categories.tsx:98-103` — botões de editar e deletar não têm `onClick` | Conectar às mutations de update/delete |
| 7 | **Mutations de UPDATE/DELETE ausentes** | Não há implementação de `updateTransaction`, `deleteTransaction`, `updateCategory`, `deleteCategory` | Criar as mutations e conectar aos botões |
| 8 | **NewCategoryModal usa `<img>` para ícones** | Carrega `/icons/utensils.svg` que não existe no projeto | Substituir por IconMapper com lucide-react |
| 9 | **Date handling frágil** | `new Date(Number(t.date) || Date.now())` — assume timestamp string | Tratar formato ISO 8601 que o backend retorna |
| 10 | **Sem roteamento** | Requisito pede 6 páginas com rota raiz `/` alternando login/dashboard | Atualmente é tab-based, o que atende o requisito básico |
| 11 | **Dashboard sem tratamento de erro** | `Dashboards.tsx` só trata `loading`, não trata `error` | Adicionar tratamento de erro do GraphQL |

#### 🔵 ALINHAMENTO BACKEND — Dependências do backend

| # | Problema | Detalhes |
|---|----------|----------|
| 12 | **Backend precisa ser corrigido primeiro** | O backend tem 6 problemas documentados em `docs/backend/PLANO_DE_ACAO.md`. Sem as correções do backend, as queries/mutations do frontend falharão |
| 13 | **Verificar alinhamento de schemas** | Garantir que os campos retornados pelo backend correspondem aos esperados pelo frontend (ex: `Transaction.date` como ISO string vs timestamp) |

---

## Passo a Passo da Correção

### Passo 1 — Corrigir os 4 erros críticos de build

#### 1.1 — `zod.create` → `zod.object` em `NewTransactionalModal.tsx`

**Antes (linha 6):**
```typescript
const transactionSchema = zod.create({
```

**Depois:**
```typescript
const transactionSchema = zod.object({
```

#### 1.2 — Corrigir import de `Dashboard` em `App.tsx`

**Antes (linha 4):**
```typescript
import { Dashboard } from './pages/dashboard/Dashboard';
```

**Depois:**
```typescript
import { Dashboard } from './pages/dashboard/Dashboards';
```

E atualizar o uso no JSX (linha 59):
```typescript
{currentTab === 'dashboard' && <Dashboard />}
```

#### 1.3 — Corrigir import de `NewTransactionModal` em `Transactions.tsx`

**Antes (linha 4):**
```typescript
import { NewTransactionModal } from './NewTransactionModal';
```

**Depois:**
```typescript
import { NewTransactionModal } from './NewTransactionalModal';
```

#### 1.4 — Corrigir import de CSS em `main.tsx`

**Antes (linha 7):**
```typescript
import './styles/globals.css';
```

**Depois:**
```typescript
import './styles/global.css';
```

---

### Passo 2 — Tornar Register acessível

**Arquivo:** `App.tsx`

Adicionar estado `showRegister` e toggle entre Login e Register:

```typescript
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

// No componente App:
const [showRegister, setShowRegister] = useState(false);

if (!signed) {
  return showRegister ? (
    <Register onSwitchToLogin={() => setShowRegister(false)} />
  ) : (
    <Login onSwitchToRegister={() => setShowRegister(true)} />
  );
}
```

E em `Login.tsx`, adicionar botão "Criar conta" que chama `onSwitchToRegister`.

---

### Passo 3 — Implementar mutations de UPDATE/DELETE

Criar as seguintes mutations GraphQL no frontend:

#### 3.1 — `deleteTransaction`

```graphql
mutation DeleteTransaction($id: ID!) {
  deleteTransaction(id: $id)
}
```

#### 3.2 — `updateTransaction`

```graphql
mutation UpdateTransaction($id: ID!, $title: String, $amount: Float, $type: String, $categoryId: String) {
  updateTransaction(id: $id, title: $title, amount: $amount, type: $type, categoryId: $categoryId) {
    id title amount type date category { id name }
  }
}
```

#### 3.3 — `deleteCategory`

```graphql
mutation DeleteCategory($id: ID!) {
  deleteCategory(id: $id)
}
```

#### 3.4 — `updateCategory`

```graphql
mutation UpdateCategory($id: ID!, $name: String!) {
  updateCategory(id: $id, name: $name) {
    id name
  }
}
```

---

### Passo 4 — Conectar botões Edit/Delete às mutations

#### 4.1 — Em `Transactions.tsx`

Adicionar `useMutation` para `DELETE_TRANSACTION` e conectar ao botão de lixeira:

```typescript
const [deleteTransaction] = useMutation(DELETE_TRANSACTION);

const handleDelete = async (id: string) => {
  if (confirm('Tem certeza que deseja excluir esta transação?')) {
    await deleteTransaction({ variables: { id } });
    refetch();
  }
};

// No botão de deletar:
<button onClick={() => handleDelete(t.id)} ...>
```

#### 4.2 — Em `Categories.tsx`

Adicionar `useMutation` para `DELETE_CATEGORY` e conectar ao botão de lixeira:

```typescript
const [deleteCategory] = useMutation(DELETE_CATEGORY);

const handleDelete = async (id: string) => {
  if (confirm('Tem certeza que deseja excluir esta categoria?')) {
    await deleteCategory({ variables: { id } });
    refetch();
  }
};
```

---

### Passo 5 — Corrigir NewCategoryModal para usar IconMapper

**Arquivo:** `NewCategoryModal.tsx`

Substituir a seção de seleção de ícones (linhas 56-70) que usa `<img>` por uma grade de botões
usando o `IconMapper` com ícones do lucide-react:

```typescript
import { IconMapper } from '../../lib/icon-mapper';

const iconOptions = ['Utensils', 'CarFront', 'ShoppingCart', 'HeartPulse', 'BriefcaseBusiness', 'Dumbbell'];

// No JSX:
<div className="grid grid-cols-6 gap-2">
  {iconOptions.map((icon) => (
    <button
      key={icon}
      type="button"
      className="p-2.5 border border-neutral-light hover:border-brand-primary rounded-xl flex items-center justify-center text-neutral-dark transition-all bg-white"
    >
      <IconMapper name={`${icon.toLowerCase()}.svg`} size={20} />
    </button>
  ))}
</div>
```

---

### Passo 6 — Melhorar tratamento de loading/error no Dashboard

**Arquivo:** `Dashboards.tsx`

Adicionar tratamento de erro:

```typescript
const { data, loading, error } = useQuery(GET_DASHBOARD_DATA);

if (loading) return <div className="text-center py-12">Carregando dados financeiros...</div>;
if (error) return <div className="text-center py-12 text-feedback-error">Erro ao carregar dados: {error.message}</div>;
```

---

### Passo 7 — Alinhar nomenclatura com o backend

**Verificações necessárias após backend corrigido:**

1. **Campo `date`:** Backend retorna `DateTime` do Prisma (ISO 8601). Frontend deve tratar como string ISO:
   ```typescript
   new Date(t.date).toLocaleDateString('pt-BR')
   ```
   Em vez de:
   ```typescript
   new Date(Number(t.date) || Date.now()).toLocaleDateString('pt-BR')
   ```

2. **Campo `amount`:** Backend retorna `Float`. Frontend já trata com `toLocaleString` — OK.

3. **Campo `category`:** Backend retorna `Category { id, name }`. Frontend espera `category { id name }` — OK.

---

## Estrutura Final Esperada

```
frontend/
├── src/
│   ├── main.tsx                          🔧 (corrigir import CSS)
│   ├── App.tsx                           🔧 (corrigir import Dashboard + toggle Register)
│   ├── graphql/
│   │   ├── client.ts                     ✅
│   │   ├── mutations/                    ➕ (adicionar delete/update)
│   │   └── queries/                      ✅
│   ├── contexts/
│   │   └── AuthContext.tsx               ✅
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.tsx                 🔧 (adicionar link para Register)
│   │   │   └── Register.tsx              ✅
│   │   └── dashboard/
│   │       ├── Dashboards.tsx            🔧 (adicionar tratamento de erro)
│   │       ├── Transactions.tsx          🔧 (corrigir import + conectar delete)
│   │       ├── Categories.tsx            🔧 (conectar delete)
│   │       ├── NewCategoryModal.tsx      🔧 (corrigir ícones)
│   │       └── NewTransactionalModal.tsx 🔧 (corrigir zod.create)
│   ├── lib/
│   │   └── icon-mapper.tsx               ✅
│   └── styles/
│       └── global.css                    ✅
├── .env.example                          ✅
├── tailwind.config.js                    ✅
├── vite.config.ts                        ✅
└── package.json                          ✅
```

**Legenda:** ✅ = OK | 🔧 = Precisa corrigir | ➕ = Precisa criar

---

## Checklist de Implementação

### 🔴 Passo 1 — Erros críticos de build
- [ ] 1.1 Corrigir `zod.create` → `zod.object` em `NewTransactionalModal.tsx`
- [ ] 1.2 Corrigir import `Dashboard` → `Dashboards` em `App.tsx`
- [ ] 1.3 Corrigir import `NewTransactionModal` → `NewTransactionalModal` em `Transactions.tsx`
- [ ] 1.4 Corrigir import `globals.css` → `global.css` em `main.tsx`

### 🟡 Passo 2 — Register acessível
- [ ] 2.1 Adicionar estado `showRegister` e toggle em `App.tsx`
- [ ] 2.2 Adicionar botão "Criar conta" em `Login.tsx`

### 🟡 Passo 3 — Mutations de UPDATE/DELETE
- [ ] 3.1 Criar mutation `deleteTransaction`
- [ ] 3.2 Criar mutation `updateTransaction`
- [ ] 3.3 Criar mutation `deleteCategory`
- [ ] 3.4 Criar mutation `updateCategory`

### 🟡 Passo 4 — Conectar botões
- [ ] 4.1 Conectar botão de deletar em `Transactions.tsx`
- [ ] 4.2 Conectar botão de deletar em `Categories.tsx`
- [ ] 4.3 Conectar botão de editar (opcional, pode ser modal de edição)

### 🟡 Passo 5 — Corrigir NewCategoryModal
- [ ] 5.1 Substituir `<img>` por `IconMapper` no seletor de ícones

### 🟡 Passo 6 — Tratamento de erro no Dashboard
- [ ] 6.1 Adicionar tratamento de `error` na query do Dashboard

### 🔵 Passo 7 — Alinhamento com backend
- [ ] 7.1 Corrigir parsing de `date` para ISO 8601
- [ ] 7.2 Verificar alinhamento após backend corrigido

### 🧪 Testes Finais
- [ ] Rodar `npm run dev` e verificar se o build não tem erros
- [ ] Testar fluxo: Register → Login → Criar categoria → Criar transação → Deletar transação → Deletar categoria
- [ ] Verificar Dashboard com dados reais
- [ ] Verificar filtros na página de Transações