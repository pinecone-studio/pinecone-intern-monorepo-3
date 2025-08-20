const root = /* GraphQL */ `
  type Query {
    me: User
  }

  type Mutation {
    signup(email: String!, password: String!, fullName: String!, username: String!): User!
    login(email: String!, password: String!): AuthPayload!
  }
`;

import common from "./common.schema";

export default [common, root]; 
