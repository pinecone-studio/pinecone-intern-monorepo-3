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

input TroubleLoginInput {
  email: String!
}
type TroubleLoginResponse {
  message: String!
}

input VerifyOtpInput {
  otp: String!
}

input UpdateProfileInput {
  bio: String
  gender: String
  phone: String
  profilePicture: String
  fullname: String
}

type Mutation {
  signup(signup: SignupInput!): AuthPayload!
  login(login: LoginInput!): AuthPayload!
  updateProfile(userId: ID!, update: UpdateProfileInput!): User!
  troublelogin(trouble: TroubleLoginInput!): TroubleLoginResponse!
   verifyOtp(verifyOtp: VerifyOtpInput!): MessageResponse!
}

type Query {
  getuser(id: ID!): User!
}

type AuthPayload {
  user: User!
}

type MessageResponse {
  token: String!
  message: String!
  user: User!
}

type User {
  id: ID!
  username: String!
  email: String!
  fullname: String!
  bio: String
  gender: String
  profilePicture: String
  followers: [User!]!
  following: [User!]!
}
`;
