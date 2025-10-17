import { FoodOrder } from '../../../models/food-order.model';

export const getAllOrderByUserId = async (
  _: unknown,
  { userId }: { userId: string }
) => {
  if (!userId) return [];

  const allOrderUser = await FoodOrder.find({ userId });
  return allOrderUser || [];
};
