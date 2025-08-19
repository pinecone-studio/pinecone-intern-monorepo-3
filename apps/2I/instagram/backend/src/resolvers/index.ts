import { ApolloServer } from '@apollo/server';
import * as Mutation from './mutations';
import { login } from './mutations/login';
import { signup } from './mutations/sign-up';
import * as Query from './queries';
import { getuser } from './queries/get-signup';
import { UserModel } from '../models';



export const resolvers = {
  Mutation: {
       signup,
       login
  },

Query: {
getuser
}


}

