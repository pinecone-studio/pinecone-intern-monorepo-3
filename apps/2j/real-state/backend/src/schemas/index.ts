import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as CommonTypeDefs } from './common.schema';
import { userTypeDefs } from '../../../../../2k/restaurant/backend/src/schemas/user.schema';

export const typeDefs = mergeTypeDefs([CommonTypeDefs, userTypeDefs]);
