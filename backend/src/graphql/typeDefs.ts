import { gql } from 'apollo-server';

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Category {
    id: ID!
    name: String!
    userId: String!
  }

  type Transaction {
    id: ID!
    title: String!
    amount: Float!
    type: String!
    category: Category!
    date: String!
  }

  type Query {
    # Categorias
    categories: [Category!]! @auth [cite: 41, 151]
    
    # Transações
    transactions: [Transaction!]! @auth [cite: 37, 147]
  }

  type Mutation {
    # Autenticação 
    register(name: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!

    # Categorias [cite: 38, 39, 40]
    createCategory(name: String!): Category!
    updateCategory(id: ID!, name: String!): Category!
    deleteCategory(id: ID!): Boolean!

    # Transações [cite: 34, 35, 36]
    createTransaction(title: String!, amount: Float!, type: String!, categoryId: String!): Transaction!
    updateTransaction(id: ID!, title: String, amount: Float, type: String, categoryId: String): Transaction!
    deleteTransaction(id: ID!): Boolean!
  }
`;