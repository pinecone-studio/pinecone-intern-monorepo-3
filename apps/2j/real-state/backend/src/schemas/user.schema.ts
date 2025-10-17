import gql from 'graphql-tag';

export const userTypeDefs = gql`
  type User {
    _id: ID!
    email: String!
    isAdmin: Boolean!
    phone: Float!
    createdAt: Date!
    updatedAt: Date!
  }

  input SignUpInput {
    email: String!
    password: String!
    phone: Float!
  }

  input SignInInput {
    email: String!
    password: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  extend type Query {
    getUser(id: ID!): User
    getCurrentUser: User
  }

  extend type Mutation {
    signUp(input: SignUpInput!): AuthPayload!
    signIn(input: SignInInput!): AuthPayload!
  }
`;

