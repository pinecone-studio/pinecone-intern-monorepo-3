import { FoodOrderInput } from '../../../generated';
import { FoodOrder } from '../../../models/food-order.model';

const generateOrderNumber = () => Math.floor(10000 + Math.random() * 90000);

export const createOrder = async (_: unknown, { userId, tableId, input }: { userId: string; tableId: string; input: FoodOrderInput }) => {
  if (!userId || !input || !tableId) return null;

  console.log('userId', userId);

  const newOrder = await FoodOrder.create({
    ...input,
    user: userId,
    tableId,
    orderNumber: generateOrderNumber(),
  });

  console.log('newOrder', newOrder);

  await newOrder.populate([{ path: 'foodOrderItems.food' }]);

  console.log('newOrder', newOrder);

  return newOrder;
};
