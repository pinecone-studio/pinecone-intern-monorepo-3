import { respondFollowRequest, sendFollowRequest, unfollowUser } from './mutations/followers';
import { login } from './mutations/login';
import { verifyOtp } from './mutations/otp-verify';
import { updatePrivacy } from './mutations/public-private';
import { signup } from './mutations/sign-up';
import { troublelogin } from './mutations/trouble-login';
import { followers } from './queries/get-followers';

import { getuser } from './queries/get-signup';

export const resolvers = {
  Mutation: {
    signup,
    login,
    troublelogin,
    verifyOtp,
    updatePrivacy,
    respondFollowRequest,
    unfollowUser,
    sendFollowRequest,
  },

  Query: {
    getuser,
    followers,
  },
};
