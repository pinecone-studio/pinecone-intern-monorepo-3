import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as CommonTypeDefs } from './common.schema';
import { categoryTypeDefs } from './category.schema';
import { discountTypeDefs } from './discount.schema';


export const typeDefs = mergeTypeDefs([CommonTypeDefs, categoryTypeDefs, discountTypeDefs]);
