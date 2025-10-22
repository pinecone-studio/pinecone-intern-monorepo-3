import { Food } from '../../../models/food.model';

export const GetFoodById = async (_: unknown, { foodId }: { foodId: string }) => {
  const foodById = await Food.findById(foodId);

  if (foodById !== null) {
    return foodById;
  } else {
    return [];
  }
};
