import { gql } from 'apollo-server';
export const categoryTypeDefs = gql`
  type Category { id: ID!, name: String!, userId: String! }
  extend type Query { categories: [Category!]! }
  extend type Mutation {
    createCategory(name: String!): Category!
    updateCategory(id: ID!, name: String!): Category!
    deleteCategory(id: ID!): Boolean!
  }
`;