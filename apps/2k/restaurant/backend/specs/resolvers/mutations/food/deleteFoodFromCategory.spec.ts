import mongoose from 'mongoose';
import { DeleteFoodFromCategory } from '../../../../src/resolvers/mutations/food/Delete-Food-from-Category';
import { CategoryModel } from '../../../../src/models/category.model';
import { Food } from '../../../../src/models/food.model';

jest.mock('mongoose', () => ({
  startSession: jest.fn(),
}));

jest.mock('../../../../src/models/category.model', () => ({
  CategoryModel: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

jest.mock('../../../../src/models/food.model', () => ({
  Food: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

describe('DeleteFoodFromCategory', () => {
  const mockSession = {
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    abortTransaction: jest.fn(),
    endSession: jest.fn(),
  };

  beforeEach(() => {
    (mongoose.startSession as jest.Mock).mockResolvedValue(mockSession);
    jest.clearAllMocks();
  });

  it('should remove food from category and unset categoryId', async () => {
    const mockCategory = { _id: 'cat1', food: ['food1'] };
    const mockFood = { _id: 'food1', categoryId: 'cat1' };
    const mockUpdatedCategory = { _id: 'cat1', food: [] };
    const mockUpdatedFood = { _id: 'food1' };

    (CategoryModel.findById as jest.Mock).mockReturnValueOnce({
      session: jest.fn().mockResolvedValue(mockCategory),
    });

    (Food.findById as jest.Mock).mockReturnValueOnce({
      session: jest.fn().mockResolvedValue(mockFood),
    });

    (CategoryModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedCategory);
    (Food.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedFood);

    const result = await DeleteFoodFromCategory({}, { categoryId: 'cat1', foodId: 'food1' });

    expect(CategoryModel.findById).toHaveBeenCalledWith('cat1');
    expect(Food.findById).toHaveBeenCalledWith('food1');
    expect(CategoryModel.findByIdAndUpdate).toHaveBeenCalledWith(
      'cat1',
      { $pull: { food: 'food1' } },
      { new: true, session: mockSession }
    );
    expect(Food.findByIdAndUpdate).toHaveBeenCalledWith(
      'food1',
      { $unset: { categoryId: '' } },
      { new: true, session: mockSession }
    );
    expect(mockSession.commitTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
    expect(result).toEqual(mockUpdatedFood);
  });

  it('should throw error if category not found', async () => {
    (CategoryModel.findById as jest.Mock).mockReturnValueOnce({
      session: jest.fn().mockResolvedValue(null),
    });

    (Food.findById as jest.Mock).mockReturnValueOnce({
      session: jest.fn().mockResolvedValue({}),
    });

    await expect(DeleteFoodFromCategory({}, { categoryId: 'invalid', foodId: 'food1' }))
      .rejects
      .toThrow('Food-г category-с устгах үед алдаа гарлаа.');

    expect(mockSession.abortTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
  });

  it('should throw error if food not found', async () => {
    (CategoryModel.findById as jest.Mock).mockReturnValueOnce({
      session: jest.fn().mockResolvedValue({}),
    });

    (Food.findById as jest.Mock).mockReturnValueOnce({
      session: jest.fn().mockResolvedValue(null),
    });

    await expect(DeleteFoodFromCategory({}, { categoryId: 'cat1', foodId: 'invalid' }))
      .rejects
      .toThrow('Food-г category-с устгах үед алдаа гарлаа.');

    expect(mockSession.abortTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
  });

  it('should abort transaction if an unexpected error occurs', async () => {
    (CategoryModel.findById as jest.Mock).mockImplementation(() => {
      throw new Error('Unexpected DB error');
    });

    await expect(DeleteFoodFromCategory({}, { categoryId: 'cat1', foodId: 'food1' }))
      .rejects
      .toThrow('Food-г category-с устгах үед алдаа гарлаа.');

    expect(mockSession.abortTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
  });
});
