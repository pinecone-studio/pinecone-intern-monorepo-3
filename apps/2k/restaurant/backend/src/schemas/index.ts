import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as CommonTypeDefs } from './common.schema';
import { categoryTypeDefs } from './category.schema';


export const typeDefs = mergeTypeDefs([CommonTypeDefs, categoryTypeDefs]);
