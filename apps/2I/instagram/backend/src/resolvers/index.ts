
import { login } from './mutations/login';
import { signup } from './mutations/sign-up';
import { getuser } from './queries/get-signup';




export const resolvers = {
  Mutation: {
       signup,
       login
  },

Query: {
getuser
}


}

