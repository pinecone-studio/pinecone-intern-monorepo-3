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

input UpdatePrivacyInput {
  isPrivate: Boolean!
}


input UpdateProfileInput {
  bio: String
  gender: String
  profilePicture: String
  fullname: String
}

type Mutation {
  signup(signup: SignupInput!): AuthPayload!
  login(login: LoginInput!): AuthPayload!
  updateProfile( update: UpdateProfileInput!): User!
  troublelogin(trouble: TroubleLoginInput!): TroubleLoginResponse!
  verifyOtp(verifyOtp: VerifyOtpInput!): MessageResponse!
  updatePrivacy(input: UpdatePrivacyInput!): User!
    sendFollowRequest(userId: ID!): MessageResponse!
  respondFollowRequest(userId: ID!, accept: Boolean!): MessageResponse!
  unfollowUser(userId: ID!): MessageResponse!
}

type Query {
  getuser(id: ID!): User!
   me: User!
   followRequests: [User!]!
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
  isActive: Boolean!
  isPrivate: Boolean! 
  followers: [User!]!
  following: [User!]!
  followRequests: [User!]!
}
`;
