import gql from 'graphql-tag';

export const typeDefs = gql`
  type ForgotPasswordResponse {
    success: Boolean!
    message: String!
  }

  input ForgotPasswordInput {
    email: String!
  }

  extend type Mutation {
    forgotPassword(input: ForgotPasswordInput!): ForgotPasswordResponse!
  }
`;
