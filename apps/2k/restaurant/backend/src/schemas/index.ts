import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as CommonTypeDefs } from './common.schema';
import { tableTypeDefs } from './tableSchema';

export const typeDefs = mergeTypeDefs([CommonTypeDefs, tableTypeDefs]);
