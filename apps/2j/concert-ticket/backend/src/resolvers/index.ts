import { Resolvers } from '../generated/resolvers-types';
import { Query } from './Query';
import { Mutation } from './Mutation';
import { Concert } from './Concert';

export const resolvers: Resolvers = {
  Query,
  Mutation,
  Concert,
};
