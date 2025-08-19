import gql from 'graphql-tag';

export const typeDefs = gql`
  input SignupInput {
  email: String!
  password: String!
  fullname: String!
  username: String!
}

 input LoginInput {
    email: String!
    password: String!
  }


type Mutation {
  signup(signup: SignupInput!): AuthPayload!
  login(login: LoginInput!): AuthPayload!
}

type Query {
  getuser(id: ID!): User!
}

type AuthPayload {
  token: String!
  user: User!
}

type User {
  id: ID!
  username: String!
  email: String!
  fullname: String!
}

`;
