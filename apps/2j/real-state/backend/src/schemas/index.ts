import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as CommonTypeDefs } from './common.schema';
import { userTypeDefs } from './user.schema';
import { propertyTypeDefs } from './property.schema';

export const typeDefs = mergeTypeDefs([CommonTypeDefs, userTypeDefs, propertyTypeDefs]);
