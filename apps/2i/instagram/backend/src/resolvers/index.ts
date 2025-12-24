import { createStory } from './mutations/create-story';
import { createPost } from './mutations/create-post';
import { likePost } from './mutations/like-post';
import { addComment } from './mutations/add-comment';
import { respondFollowRequest, sendFollowRequest, unfollowUser } from './mutations/followers';
import { forgetverify } from './mutations/forget-verify';
import { forgetverifyOtp } from './mutations/forget-verify-otp';
import { login } from './mutations/login';
import { verifyOtp } from './mutations/otp-verify';
import { updateProfile } from './mutations/profile-update';
import { updatePrivacy } from './mutations/public-private';
import { signup } from './mutations/sign-up';
import { updatePassword } from './mutations/up-password';
import { getSearchResults } from './queries/get-search-result';
import { getPosts, getPost } from './queries/get-posts';
import { getuser } from './queries/get-signup';
import { getNotifications } from './queries/get-notifications';

export const resolvers = {
  Mutation: {
    signup,
    login,
    verifyOtp,
    updatePrivacy,
    respondFollowRequest,
    unfollowUser,
    sendFollowRequest,
    updateProfile,
    forgetverify,
    forgetverifyOtp,
    updatePassword,
    createStory,
    createPost,
    likePost,
    addComment,
  },

  Query: {
    getuser,
    getSearchResults,
    getPosts,
    getPost,
    getNotifications,
  },
};
