import { gql } from 'apollo-server-cloud-functions';

export const userTypeDefs = gql`
  enum UserRole {
    ADMIN
    USER
  }

  type User {
    userId: ID!
    email: String!
    username: String!
    profile: String
    password: String!
    bonusPoints: Int
    role: UserRole!
    phoneNumber: String
    createdAt: String
    updatedAt: String
  }

  type sendResetCodeResponse {
    message: String
    success: Boolean
  }

  type verifyResetCodeResponse {
    message: String
    success: Boolean
  }

  type resetPasswordResponse {
    message: String
    success: Boolean
  }

  input sendResetCodeInput {
    email: String!
  }

  input verifyResetCodeInput {
    email: String!
    code: String!
  }

  input resetPasswordInput {
    email: String!
    newPassword: String!
  }

  input CreateUserInput {
    email: String!
    password: String!
    username: String!
  }
  input LoginInput {
    email: String!
    password: String!
  }

  type LoginResponse {
    token: String!
    user: User!
  }
  input UpdateUserInput {
    email: String!
    password: String!
    profile: String
    phoneNumber: String!
    username: String
  }

  input GetUserInput {
    userId: ID!
  }

  type Query {
    getUser(input: GetUserInput!): User!
    getUsers: [User!]!
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
    userLogin(input: LoginInput!): LoginResponse!
    updateUser(userId: ID!, input: UpdateUserInput!): User!
    deleteUser(userId: ID!): User!
    sendResetCode(input: sendResetCodeInput!): sendResetCodeResponse
    verifyResetCode(input: verifyResetCodeInput!): verifyResetCodeResponse
    resetPassword(input: resetPasswordInput!): resetPasswordResponse
  }
`;
