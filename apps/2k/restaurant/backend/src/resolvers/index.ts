import { CategoryType } from '../models/category.model';
import * as Mutation from './mutations';
import * as Query from './queries';

export const resolvers = {
   Category: {
    categoryId: (parent: CategoryType) => parent._id.toString(),
  },
  Mutation,
  Query,
};
