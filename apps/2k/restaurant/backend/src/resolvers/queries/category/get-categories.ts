import { QueryResolvers } from '../../../generated';
import { CategoryModel } from '../../../models/category.model';

export const getCategories: QueryResolvers['getCategories'] = async () => {
  try {
    const categoriesDocs = await CategoryModel.find().populate('food');

    if (!categoriesDocs || categoriesDocs.length === 0) {
      return [];
    }

    return categoriesDocs as any ;
  } catch (error) {
    // console.error(error);
    // throw new Error('Failed to fetch categories');
  }
};
