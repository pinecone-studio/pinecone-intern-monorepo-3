import { Food } from '../../../models/food.model';

export const DeleteFood = async (_: unknown, { foodId }: { foodId: string }) => {
  try {
    if(!foodId) return; 

    const response = await Food.findByIdAndDelete(foodId);
    
    return response;
  } catch (error) {
    console.log(error);
  }
};