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

  input AddCommentInput {
    postId: ID!
    content: String!
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
    troublelogin(trouble: TroubleLoginInput!): TroubleLoginResponse!
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
    addComment(input: AddCommentInput!): Comment!
  }

  type Query {
    getuser(id: ID!): User!
    me: User!
    followRequests: [User!]!
    getStories: [Story!]!
    getUserStories(userId: ID!): [Story!]!
    getPosts: [Post!]!
    getUserPosts(userId: ID!): [Post!]!
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

  type Post {
    id: ID!
    user: User!
    images: [String!]!
    caption: String!
    likes: [User!]!
    comments: [Comment!]!
    createdAt: String!
    updatedAt: String!
  }

  type Comment {
    id: ID!
    user: User!
    post: Post!
    content: String!
    createdAt: String!
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
  }
`;
