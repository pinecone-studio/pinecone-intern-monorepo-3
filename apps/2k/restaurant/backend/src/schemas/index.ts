import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as CommonTypeDefs } from './common.schema';
import { categoryTypeDefs } from './category.schema';
import { discountTypeDefs } from './discount.schema';
import { userTypeDefs } from './user.schema';
import { typeDefs as FoodType } from './food.schema';
import { typeDefs as FoodOrder } from './food-order.schema';
import { tableTypeDefs } from './table.schema';

export const typeDefs = mergeTypeDefs([CommonTypeDefs, categoryTypeDefs, discountTypeDefs, FoodType, FoodOrder, userTypeDefs, tableTypeDefs]);
