# Arquitetura da Solução - Financy

## Justificativa Técnica

Esta documentação apresenta os motivos pelos quais as tecnologias foram escolhidas para o desafio prático Financy, baseando-se nos requisitos e boas práticas recomendadas.

---

## 🏗️ Arquitetura Geral

```
financy/
├── backend/           # API GraphQL (Apollo Server)
│   ├── GraphQL API    # Schema + Resolvers
│   ├── Prisma ORM     # Camada de acesso a dados
│   └── SQLite         # Banco de dados local
│
└── frontend/          # SPA React (Vite)
    ├── Apollo Client  # Consumo da API GraphQL
    ├── React Router   # Navegação (via abas)
    └── TailwindCSS    # Estilização
```

---

## 🔧 Tecnologias do Backend

### GraphQL (Apollo Server)

**Por que GraphQL?**

1. **Flexibilidade de Consulta** - O frontend pode solicitar apenas os campos necessários, evitando over-fetching. Por exemplo, ao listar transações, podemos trazer apenas `id`, `title` e `amount` se necessário.

2. **Type Safety** - O schema GraphQL fornece tipagem forte tanto no backend quanto no frontend, reduzindo bugs relacionados a tipos de dados.

3. **Desenvolvimento Ágil** - Com o GraphQL Playground, é possível testar queries e mutations rapidamente sem criar endpoints REST separados.

4. **Requisito do Desafio** - A especificação do desafio obriga o uso de GraphQL, alinhando-se ao objetivo de aplicar conhecimentos aprendidos na disciplina.

### Prisma ORM

**Por que Prisma?**

1. **Type Safety** - Prisma gera tipos TypeScript automaticamente a partir do schema, garantindo consistência entre o código e o banco de dados.

2. **Migrations Simples** - O comando `prisma migrate` cria e versiona o esquema do banco de forma declarativa.

3. **Query Intuitiva** - A API do Prisma é fluente e fácil de entender, acelerando o desenvolvimento.

4. **Requisito do Desafio** - Prisma é uma tecnologia obrigatória do desafio.

### SQLite

**Por que SQLite?**

1. **Simplicidade** - Banco de dados em arquivo único, sem necessidade de instalação de servidor separado.

2. **Desenvolvimento Local** - Ideal para protótipos e aplicações pessoais, como este desafio.

3. **Requisito do Desafio** - SQLite é a opção padrão recomendada pelo desafio.

### TypeScript

**Por que TypeScript?**

1. **Type Safety** - Detecta erros em tempo de compilação, não em runtime.

2. **Documentação Automática** - Interfaces e tipos servem como documentação viva do código.

3. **Requisito do Desafio** - TypeScript é obrigatório tanto no backend quanto no frontend.

---

## 🎨 Tecnologias do Frontend

### React 18

**Por que React?**

1. **Componentização** - Permite reutilizar componentes como cards de categoria, modais, tabelas.

2. **Ecosystem Maduro** - Milhares de bibliotecas disponíveis (Apollo Client, React Hook Form, etc).

3. **Requisito do Desafio** - React é tecnologia obrigatória do frontend.

### Vite

**Por que Vite?**

1. **Performance** - Hot Module Replacement (HMR) extremamente rápido, graças ao uso de ES Modules nativos.

2. **Configuração Zero** - Funciona out-of-the-box com TypeScript, JSX e CSS.

3. **Requisito do Desafio** - Vite é o bundler obrigatório (sem framework).

### Apollo Client

**Por que Apollo Client?**

1. **Integração Nativa com GraphQL** - Gerencia cache, requisições e estado de forma otimizada para GraphQL.

2. **React Hooks** - `useQuery` e `useMutation` simplificam o consumo da API.

3. **Requisito do Desafio** - O frontend deve usar GraphQL para consultas na API.

### TailwindCSS

**Por que TailwindCSS?**

1. **Produtividade** - Classes utilitárias aceleram o desenvolvimento de interfaces.

2. **Consistência** - O Style Guide do Figma foi convertido em tokens do Tailwind, garantindo aderência ao design.

3. **Flexibilidade** - O desafio permite o uso opcional, mas foi implementado para melhorar a DX (Developer Experience).

### React Hook Form + Zod

**Por que essa combinação?**

1. **Performance** - React Hook Form minimiza re-renders, atualizando apenas os campos necessários.

2. **Validação Declarativa** - Zod permite definir schemas de validação de forma clara e tipada.

3. **Integração** - O resolver `@hookform/resolvers/zod` conecta as duas bibliotecas perfeitamente.

---

## 📁 Estrutura de Pastas

### Backend

```
src/
├── server.ts              # Ponto de entrada
├── graphql/
│   ├── modules/           # Separação por domínio (auth, category, transaction)
│   │   ├── auth/
│   │   ├── category/
│   │   └── transaction/
│   ├── context.ts         # Contexto JWT
│   └── schema.ts          # Schema unificado
├── lib/
│   └── prisma.ts          # Cliente Prisma singleton
└── services/              # Lógica de negócio separada
    ├── auth.service.ts
    ├── category.service.ts
    └── transaction.service.ts
```

**Justificativa:**
- **Services**: Separação da lógica de negócio permite testes unitários isolados
- **Modules**: Organização por domínio facilita a manutenção
- **lib**: Configurações compartilhadas (Prisma singleton)

### Frontend

```
src/
├── main.tsx               # Ponto de entrada
├── App.tsx                # Navegação principal
├── contexts/
│   └── AuthContext.tsx    # Gerenciamento de autenticação
├── graphql/
│   ├── client.ts          # Apollo Client configurado
│   ├── mutations/         # Mutations GraphQL
│   └── queries/           # Queries GraphQL
├── lib/
│   └── icon-mapper.tsx    # Mapeamento de ícones
├── pages/
│   ├── auth/              # Login e Register
│   └── dashboard/         # Dashboard, Transações, Categorias
├── styles/
│   └── global.css         # Estilos globais
└── tests/                 # Testes unitários
```

**Justificativa:**
- **Context**: Centraliza o estado de autenticação
- **Pages**: Organização por funcionalidade
- **Tests**: Testes próximos aos componentes que testam

---

## 🔒 Autenticação

### Backend

- **JWT (JSON Web Token)** - Padrão da indústria para autenticação stateless
- **bcryptjs** - Hash de senhas com salt integrado
- **Middleware de Contexto** - Extrai o token do header e valida no contexto GraphQL

### Frontend

- **LocalStorage** - Persiste o token e dados do usuário
- **Apollo Link** - Adiciona o token automaticamente em requisições autenticadas

---

## 🧪 Testes

### Backend (Jest)

- **Mocks do Prisma** - Testes isolados sem tocar no banco real
- **Cobertura de Services** - Testa toda a lógica de negócio

### Frontend (Vitest)

- **Testing Library** - Testa componentes como o usuário interagiria
- **Mocks do Apollo Client** - Simula respostas da API

---

## 🚀 Scripts Disponíveis

### Backend

```bash
npm run dev           # Servidor em desenvolvimento
npm run build         # Build TypeScript
npm run prisma:migrate # Executar migrations
npm run prisma:studio   # Visualizar dados
npm test              # Testes unitários
```

### Frontend

```bash
npm run dev           # Servidor Vite (porta 3000)
npm run build         # Build para produção
npm run preview       # Preview do build
npm test              # Testes unitários
```

---

## 📊 Checklist de Requisitos

### Requisitos Obrigatórios (✅ Concluídos)

- [x] TypeScript
- [x] GraphQL
- [x] Prisma
- [x] SQLite
- [x] React
- [x] Vite
- [x] CORS habilitado

### Requisitos Opcionais (✅ Implementados)

- [x] TailwindCSS
- [x] React Hook Form
- [x] Zod
- [x] Testes unitários

---

## 📝 Considerações Finais

A arquitetura escolhida prioriza:

1. **Simplicidade** - Tecnologias com curva de aprendizado suave
2. **Type Safety** - TypeScript e Prisma garantem consistência de dados
3. **Developer Experience** - Vite, Tailwind e Apollo Client aceleram o desenvolvimento
4. **Aderência ao Desafio** - Todas as tecnologias obrigatórias foram implementadas
5. **Escalabilidade** - Estrutura modular permite adicionar novas funcionalidades