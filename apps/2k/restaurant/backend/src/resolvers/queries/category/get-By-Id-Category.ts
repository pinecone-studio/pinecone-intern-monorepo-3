import { QueryResolvers } from '../../../generated';
import { CategoryModel } from '../../../models/category.model';

export const getByIdCategory: QueryResolvers['getByIdCategory'] = async (_, { categoryId }) => {
 try {
    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      throw new Error(`Category with ID ${categoryId} not found`);
    }
    return category;
  } catch (error: any) {
   
    if (error.message.includes('not found')) {
      throw error;
    }
 
    throw new Error('Failed to fetch category by ID');
  }
};
