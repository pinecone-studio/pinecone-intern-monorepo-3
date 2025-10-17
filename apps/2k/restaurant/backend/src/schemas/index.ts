import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as CommonTypeDefs } from './common.schema';
import { typeDefs as FoodType } from './food.schema';
import { typeDefs as FoodOrder } from './food-order.schema';

import { userTypeDefs } from './user.schema';

export const typeDefs = mergeTypeDefs([CommonTypeDefs, FoodType, FoodOrder, userTypeDefs]);



