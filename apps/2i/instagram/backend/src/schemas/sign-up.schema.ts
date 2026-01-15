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

  input ForgetPass {
    email: String!
  }

  input VerifyOtpInput {
    otp: String!
  }

  input UpdatePrivacyInput {
    isPrivate: Boolean!
  }

  input UpdatePasswordInput {
    email: String!
    password: String!
  }

  input CreateStoryInput {
    mediaUrl: String!
  }

  input CreatePostInput {
    images: [String!]!
    caption: String
  }
  input VerifyOtpInput {
    otp: String!
  }

  input UpdateProfileInput {
    bio: String
    gender: String
    profilePicture: String
    fullname: String
    username: String
  }

  type Mutation {
    signup(signup: SignupInput!): AuthPayload!
    login(login: LoginInput!): AuthPayload!
    updateProfile(update: UpdateProfileInput!): User!
    forgetverify(forget: ForgetPass): TroubleLoginResponse!
    updatePassword(input: UpdatePasswordInput): updatepasswordResponse!
    forgetverifyOtp(verifyOtp: VerifyOtpInput!): forgetOtpResponse!
    verifyOtp(verifyOtp: VerifyOtpInput!): MessageResponse!
    updatePrivacy(input: UpdatePrivacyInput!): User!
    sendFollowRequest(userId: ID!): MessageResponse!
    respondFollowRequest(userId: ID!, accept: Boolean!): MessageResponse!
    unfollowUser(userId: ID!): MessageResponse!
    createStory(input: CreateStoryInput!): Story!
    markStorySeen(storyId: ID!): Story!
    createPost(input: CreatePostInput!): Post!
    likePost(postId: ID!): Post!
    unlikePost(postId: ID!): Post!
    addComment(postId: ID!, text: String!): Comment!
  }

  type Query {
    getuser(id: ID!): User!
    me: User!
    followRequests: [User!]!
    getStories: [Story!]!
    getUserStories(userId: ID!): [Story!]!
    getSearchResults: [User]!
    getPosts: [Post!]!
    getPost(postId: ID!): Post!
  }

  type TroubleLoginResponse {
    message: String!
  }

  type updatepasswordResponse {
    message: String!
  }

  type forgetOtpResponse {
    message: String!
  }
  type AuthPayload {
    token: String!
    user: User!
  }

  type MessageResponse {
    token: String!
    message: String!
    user: User!
  }

  type Story {
    id: ID!
    user: User!
    mediaUrl: String!
    createdAt: String!
    expiresAt: String!
    viewers: [User!]!
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
    followers: [User!]
    following: [User!]
    followRequests: [User!]
    otp: String
    otpExpires: String
  }

  type Post {
    id: ID!
    user: User!
    images: [String!]!
    caption: String
    likes: [User!]!
    comments: [Comment!]!
    createdAt: String!
  }

  type Comment {
    id: ID!
    user: User!
    post: Post!
    text: String!
    createdAt: String!
  }
`;
