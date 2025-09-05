import { createStory } from './mutations/create-story';

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

import { getuser } from './queries/get-signup';

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
  },

  Query: {
    getuser,
    getSearchResults,
  },
};
