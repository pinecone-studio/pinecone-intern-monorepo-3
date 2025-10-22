import mongoose from 'mongoose';
import { CategoryModel } from '../../../models/category.model';
import { Food } from '../../../models/food.model';

export const DeleteFoodFromCategory = async (_: unknown, { foodId, categoryId }: { foodId: string; categoryId: string }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const category = await CategoryModel.findById(categoryId).session(session);
    const food = await Food.findById(foodId).session(session);

    if (!category) throw new Error('Category олдсонгүй');
    if (!food) throw new Error('Food олдсонгүй');

    const updatedCategory = await CategoryModel.findByIdAndUpdate(categoryId, { $pull: { food: foodId } }, { new: true, session });
    console.log('updatedCategory', updatedCategory);

    const updatedFood = await Food.findByIdAndUpdate(foodId, { $unset: { categoryId: '' } }, { new: true, session });
    console.log('updatedFood', updatedFood);

    await session.commitTransaction();
    session.endSession();

    return updatedFood;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error('Food-г category-с устгах үед алдаа гарлаа.');
  }
};
