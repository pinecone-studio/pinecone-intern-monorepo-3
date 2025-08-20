import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as CommonTypeDefs } from './common.schema';
import { typeDefs as AuthTypeDefs } from './auth.schema';

export const typeDefs = mergeTypeDefs([CommonTypeDefs, AuthTypeDefs]);
