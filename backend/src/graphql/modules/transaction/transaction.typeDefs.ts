import { gql } from 'apollo-server';
export const transactionTypeDefs = gql`
  type Transaction { id: ID!, title: String!, amount: Float!, type: String!, category: Category!, date: String! }
  extend type Query { transactions: [Transaction!]! }
  extend type Mutation {
    createTransaction(title: String!, amount: Float!, type: String!, categoryId: String!, date: String!): Transaction!
    updateTransaction(id: ID!, title: String, amount: Float, type: String, categoryId: String, date: String): Transaction!
    deleteTransaction(id: ID!): Boolean!
  }
`;