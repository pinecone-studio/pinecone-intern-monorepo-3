import { CategoryModel } from 'apps/2k/restaurant/backend/src/models/category.model';
import { createCategory } from 'apps/2k/restaurant/backend/src/resolvers/mutations/category/createCategory';
import { GraphQLResolveInfo } from 'graphql';

jest.mock('apps/2k/restaurant/backend/src/models/category.model', () => ({
  CategoryModel: {
    create: jest.fn(),
  },
}));

describe('createCategory', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create new category successfully', async () => {
    (CategoryModel.create as jest.Mock).mockResolvedValue({
      categoryId: '2',
      categoryName: 'Test',
    });

    const result = await createCategory?.({}, { input: { categoryName: 'Test' } }, {}, {} as GraphQLResolveInfo);

    expect(result).toEqual(
      expect.objectContaining({
        categoryId: '2',
        categoryName: 'Test',
      })
    );
  });

  it('should throw error if categoryName is empty', async () => {
    await expect(createCategory?.({}, { input: { categoryName: '' } }, {}, {} as GraphQLResolveInfo)).rejects.toThrow('categoryName is required');
  });

  it('should throw error if CategoryModel.create returns null', async () => {
    (CategoryModel.create as jest.Mock).mockResolvedValue(null);

    await expect(createCategory?.({}, { input: { categoryName: 'Test' } }, {}, {} as GraphQLResolveInfo)).rejects.toThrow('Failed to create category in DB');
  });

  it('should handle database errors', async () => {
    (CategoryModel.create as jest.Mock).mockRejectedValue(new Error('Failed to create category'));

    await expect(createCategory?.({}, { input: { categoryName: 'Test' } }, {}, {} as GraphQLResolveInfo)).rejects.toThrow('Failed to create category');
  });
});
