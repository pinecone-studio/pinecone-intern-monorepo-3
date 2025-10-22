import { CategoryModel } from '../../../models/category.model';

export const getByIdCategory = async (_: unknown, { categoryId }: { categoryId: string }) => {

  const category = await CategoryModel.findById(categoryId).populate('food');

  if (!category) {
    throw new Error(`Category with ID ${categoryId} not found`);
  }

  console.log('category get by id', category);

  return category;
};
