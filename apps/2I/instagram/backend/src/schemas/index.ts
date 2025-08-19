import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as CommonTypeDefs } from './sign-up.schema';

export const typeDefs = mergeTypeDefs([CommonTypeDefs,]);
