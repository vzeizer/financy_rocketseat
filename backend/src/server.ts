import { ApolloServer } from 'apollo-server';
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';
import { createContext } from './graphql/context';
import dotenv from 'dotenv';

dotenv.config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: createContext,
  cors: {
    origin: '*', // Habilita explicitamente o CORS para evitar bloqueios do navegador 
    credentials: true,
  },
});

const PORT = process.env.PORT || 4000;

server.listen({ port: PORT }).then(({ url }) => {
  console.log(`🚀 Financy API rodando em: ${url}`);
});

/* Pode ser que haja necessidade uma adaptação aqui, conforme abaixo:

// No seu src/server.ts altere a assinatura para:
import { schema } from './graphql/schema';

const server = new ApolloServer({
  schema, // Passa o schema unificado aqui
  context: createContext,
  cors: { origin: '*', credentials: true }
});

*/