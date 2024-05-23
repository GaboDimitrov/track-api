import { gql } from "graphql-tag";

export const userTypeDefs = gql`
  type User {
    id: ID!
    username: String!
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    token: String!
  }

  type Mutation {
    register(username: String!, password: String!): User!
    login(username: String!, password: String!): AuthPayload!
  }
`;
