import { mergeTypeDefs } from '@graphql-tools/merge';
import { mutationDefs } from './mutation.schema';
import { typeDefs as CommonTypeDefs } from './common.schema';

export const typeDefs = mergeTypeDefs([CommonTypeDefs, mutationDefs]);
