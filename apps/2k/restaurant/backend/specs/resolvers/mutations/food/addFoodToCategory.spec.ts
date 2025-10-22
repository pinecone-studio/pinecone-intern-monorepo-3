import mongoose from 'mongoose';
import { AddFoodToCategory } from '../../../../src/resolvers/mutations/food/Add-Food-Category';
import { CategoryModel } from '../../../../src/models/category.model';
import { Food } from '../../../../src/models/food.model';

// 🧩 Mock-ууд
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

describe('AddFoodToCategory', () => {
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

  it('should add food to category and update food categoryId', async () => {
    const mockCategory = { _id: 'cat1', food: [] };
    const mockFood = { _id: 'food1', name: 'Test food' };
    const mockUpdatedCategory = { _id: 'cat1', food: ['food1'] };
    const mockUpdatedFood = { _id: 'food1', categoryId: 'cat1' };

    (CategoryModel.findById as jest.Mock).mockReturnValueOnce({
      session: jest.fn().mockResolvedValue(mockCategory),
    });

    (Food.findById as jest.Mock).mockReturnValueOnce({
      session: jest.fn().mockResolvedValue(mockFood),
    });

    (CategoryModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedCategory);
    (Food.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedFood);

    const result = await AddFoodToCategory({}, { categoryId: 'cat1', foodId: 'food1' });

    expect(mongoose.startSession).toHaveBeenCalledTimes(1);
    expect(CategoryModel.findById).toHaveBeenCalledWith('cat1');
    expect(Food.findById).toHaveBeenCalledWith('food1');
    expect(CategoryModel.findByIdAndUpdate).toHaveBeenCalledWith(
      'cat1',
      { $addToSet: { food: 'food1' } },
      { new: true, session: mockSession }
    );
    expect(Food.findByIdAndUpdate).toHaveBeenCalledWith(
      'food1',
      { categoryId: 'cat1' },
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

    await expect(AddFoodToCategory({}, { categoryId: 'invalid', foodId: 'food1' }))
      .rejects.toThrow('Category олдсонгүй');

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

    await expect(AddFoodToCategory({}, { categoryId: 'cat1', foodId: 'invalid' }))
      .rejects.toThrow('Food олдсонгүй');

    expect(mockSession.abortTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
  });

  it('should abort transaction if an unexpected error occurs', async () => {
    (CategoryModel.findById as jest.Mock).mockImplementation(() => {
      throw new Error('Unexpected error');
    });

    await expect(AddFoodToCategory({}, { categoryId: 'cat1', foodId: 'food1' }))
      .rejects.toThrow('Unexpected error');

    expect(mockSession.abortTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
  });
});
