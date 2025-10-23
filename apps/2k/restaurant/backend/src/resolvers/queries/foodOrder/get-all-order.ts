import { FoodOrder } from '../../../models/food-order.model';

export const GetAllOrders = async () => {
  try {
    const getAllOrders = await FoodOrder.find().populate({path:"foodOrderItems.food"});

    console.log("getAllOrders", getAllOrders);
    
    if (getAllOrders.length !== 0) {
      return getAllOrders;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
  }
};
