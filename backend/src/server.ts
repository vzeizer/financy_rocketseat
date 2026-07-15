import { ApolloServer } from 'apollo-server';
import { typeDefs, resolvers } from './graphql/modules/schema';
import { createContext } from './graphql/modules/context';
import dotenv from 'dotenv';

dotenv.config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: createContext,
  cors: {
    origin: '*',
    credentials: true,
  },
});

const PORT = process.env.PORT || 4000;

server.listen({ port: PORT }).then(({ url }) => {
  console.log(`🚀 Financy API rodando em: ${url}`);
});
