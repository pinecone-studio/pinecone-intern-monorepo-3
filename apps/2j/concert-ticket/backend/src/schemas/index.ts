import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as CommonTypeDefs } from './common.schema';
// @ts-ignore - .graphql files are imported as strings via webpack
import schemaTypeDefs from './schema.graphql';

export const typeDefs = mergeTypeDefs([CommonTypeDefs, schemaTypeDefs]);
