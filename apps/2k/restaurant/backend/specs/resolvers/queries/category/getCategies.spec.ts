import { CategoryModel } from "apps/2k/restaurant/backend/src/models/category.model";
import { getCategories } from "apps/2k/restaurant/backend/src/resolvers/queries";

jest.mock('apps/2k/restaurant/backend/src/models/category.model');

describe('getCategories', () => {
  it('should return a list of categories', async () => {
    const mockCategories = [
      { categoryId: '1', categoryName: 'Test Category 1' },
      { categoryId: '2', categoryName: 'Test Category 2' },
    ];

    (CategoryModel.find as jest.Mock).mockResolvedValue(mockCategories);

    const result = await getCategories({}, {}, {}, {} as any);
    expect(result).toEqual(
      mockCategories.map(cat => expect.objectContaining(cat))
    );
  });

  it('should return an empty array if no categories exist', async () => {
    (CategoryModel.find as jest.Mock).mockResolvedValue([]);

    const result = await getCategories({}, {}, {}, {} as any);
    expect(result).toEqual([]);
  });

  it('should throw an error if database fails', async () => {
    (CategoryModel.find as jest.Mock).mockRejectedValue(new Error('DB error'));

    await expect(getCategories({}, {}, {}, {} as any)).rejects.toThrow(
      'Failed to fetch categories'
    );
  });
});
