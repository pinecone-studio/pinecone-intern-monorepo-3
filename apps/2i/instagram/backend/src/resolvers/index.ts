


import { login } from './mutations/login';
import { verifyOtp } from './mutations/otp-verify';
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
      
  },

Query: {
getuser,

},



}

