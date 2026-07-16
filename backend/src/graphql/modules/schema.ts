import { gql } from 'apollo-server';
import { authTypeDefs } from './auth/auth.typeDefs';
import { categoryTypeDefs } from './category/category.typeDefs';
import { transactionTypeDefs } from './transaction/transaction.typeDefs';
import { authResolvers } from './auth/auth.resolvers';
import { categoryResolvers } from './category/category.resolvers';
import { transactionResolvers } from './transaction/transaction.resolvers';

type ResolverModule = {
  Query?: Record<string, unknown>;
  Mutation?: Record<string, unknown>;
  Transaction?: Record<string, unknown>;
};

const authModule = authResolvers as ResolverModule;
const categoryModule = categoryResolvers as ResolverModule;
const transactionModule = transactionResolvers as ResolverModule;

// TypeDefs base que declaram os tipos Query e Mutation vazios para extensão
const baseTypeDefs = gql`
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
`;

// Combina todos os typeDefs modulares
export const typeDefs = [
  baseTypeDefs,
  authTypeDefs,
  categoryTypeDefs,
  transactionTypeDefs,
];

// Combina todos os resolvers modulares
export const resolvers = {
  Query: {
    ...(authModule.Query || {}),
    ...(categoryModule.Query || {}),
    ...(transactionModule.Query || {}),
  },
  Mutation: {
    ...(authModule.Mutation || {}),
    ...(categoryModule.Mutation || {}),
    ...(transactionModule.Mutation || {}),
  },
  Transaction: {
    ...(transactionModule.Transaction || {}),
  },
};
