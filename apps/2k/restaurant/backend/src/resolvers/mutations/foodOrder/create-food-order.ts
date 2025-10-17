import { FoodOrderInput } from '../../../generated';
import { FoodOrder } from '../../../models/food-order.model';

const generateOrderNumber = () => Math.floor(10000 + Math.random() * 90000);

export const createOrder = async (
  _: unknown,
  { userId, tableId, input }: { userId: string; tableId: string; input: FoodOrderInput }
) => {
  if (!userId || !input || !tableId) return null;

  return await FoodOrder.create({
    ...input,
    userId,
    tableId,
    orderNumber: generateOrderNumber(),
  });
};
