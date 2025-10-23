import { CategoryModel } from '../../../models/category.model';
import { Food } from '../../../models/food.model';

import mongoose from 'mongoose';

export const AddFoodToCategory = async (_: unknown, { categoryId, foodId }: { categoryId: string; foodId: string }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const category = await CategoryModel.findById(categoryId).session(session);
    const food = await Food.findById(foodId).session(session);

    if (!category) throw new Error('Category олдсонгүй');
    if (!food) throw new Error('Food олдсонгүй');

    const updatedCategory = await CategoryModel.findByIdAndUpdate(categoryId, { $addToSet: { food: foodId } }, { new: true, session });
    console.log('updatedCategory', updatedCategory);

    const updatedFood = await Food.findByIdAndUpdate(foodId, { categoryId: categoryId }, { new: true, session });

    await session.commitTransaction();
    session.endSession();

    return updatedFood;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
