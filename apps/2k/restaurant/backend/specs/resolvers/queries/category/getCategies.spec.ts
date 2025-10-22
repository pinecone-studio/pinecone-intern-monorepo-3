import { CategoryModel } from '../../../../src/models/category.model';
import { getCategories } from '../../../../src/resolvers/queries/category/get-categories';
import { GraphQLResolveInfo } from 'graphql';

// ⚠️ Mock замаа яг import хийж байгаа замтай тааруул
jest.mock('../../../../src/models/category.model', () => ({
  CategoryModel: {
    find: jest.fn().mockReturnThis(),
    populate: jest.fn(),
  },
}));

describe('getCategories', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a list of categories', async () => {
    const mockCategories = [
      { categoryId: '1', categoryName: 'Test Category 1' },
      { categoryId: '2', categoryName: 'Test Category 2' },
    ];

    // mock find().populate() chain
    (CategoryModel.find as jest.Mock).mockReturnValueOnce({
      populate: jest.fn().mockResolvedValueOnce(mockCategories),
    });

    const result = await getCategories!({}, {}, {}, {} as GraphQLResolveInfo);
    expect(result).toEqual(mockCategories);
  });

  it('should return an empty array if no categories exist', async () => {
    (CategoryModel.find as jest.Mock).mockReturnValueOnce({
      populate: jest.fn().mockResolvedValueOnce([]),
    });

    const result = await getCategories!({}, {}, {}, {} as GraphQLResolveInfo);
    expect(result).toEqual([]);
  });

  // it('should throw an error if database fails', async () => {
  //   (CategoryModel.find as jest.Mock).mockReturnValueOnce({
  //     populate: jest.fn().mockRejectedValueOnce(new Error('DB error')),
  //   });

  //   await expect(
  //     getCategories({}, {}, {}, {} as GraphQLResolveInfo)
  //   ).rejects.toThrow('Failed to fetch categories');
  // });
});
