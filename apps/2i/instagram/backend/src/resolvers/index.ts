
import { respondFollowRequest,sendFollowRequest, unfollowUser } from './mutations/followers';
import { login } from './mutations/login';
import { verifyOtp } from './mutations/otp-verify';
import { updateProfile } from './mutations/profile-update';
import {  updatePrivacy } from './mutations/public-private';
import { signup } from './mutations/sign-up';
import { troublelogin } from './mutations/trouble-login';

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
       updateProfile
  },

Query: {
getuser,
},



}

