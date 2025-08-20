const common = /* GraphQL */ `
  type User {
    id: ID!
    email: String!
    username: String!
    fullName: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }
`;
export default common;
