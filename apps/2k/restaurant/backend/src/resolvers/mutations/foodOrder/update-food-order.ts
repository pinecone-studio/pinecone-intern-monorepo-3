import { UpdateOrderStatusInput } from '../../../generated';
import { FoodOrder } from '../../../models/food-order.model';

export const UpdateOrder = async (_: unknown, { input }: { input: UpdateOrderStatusInput }) => {
  console.log('orderId', input.order);

  const updatedOrder = await FoodOrder.findByIdAndUpdate(
    input.order,
    { status: input.status },
    { new: true } // <- update хийсний дараа шинэ утгыг буцаах
  ).populate({path:"foodOrderItems.food"});

  if (!updatedOrder) {
    throw new Error('Order not found');
  }

  return {
    id: updatedOrder._id,
    user: updatedOrder.user,
    status: updatedOrder.status,
    foodOrderItems: updatedOrder.foodOrderItems,
    tableId: updatedOrder.tableId,
    totalPrice: updatedOrder.totalPrice,
    orderNumber: updatedOrder.orderNumber, // <- null биш утга байгаарай
    serveType: updatedOrder.serveType,
    createdAt: updatedOrder.createdAt,
    updatedAt: updatedOrder.updatedAt,
  };
};

// export const UpdateOrder = async (_: unknown, { input }: { input: UpdateOrderStatusInput }) => {
//   console.log('helloooooooo');

//   console.log('orderId', input);

//   const updatedOrder = await FoodOrder.findByIdAndUpdate(input.order, { status: input.status });

//   console.log('updatedOrder', updatedOrder);

//   return UpdateOrder;
// //   return {
// //     id: '2',
// //     userId: 'user_002',
// //     status: 'COMPLETED',
// //     foodOrderItems: [
// //       {
// //         id: 'foi_003',
// //         foodId: 'food_003',
// //         quantity: 3,
// //         price: 2500,
// //         name: 'Цуйван',
// //       },
// //     ],
// //     tableId: 'table_2',
// //     totalPrice: 7500,
// //     orderNumber: 102,
// //     serveType: 'IN',
// //     createdAt: '2025-10-21T13:10:00Z',
// //     updatedAt: '2025-10-21T13:45:00Z',
// //   };
// };
