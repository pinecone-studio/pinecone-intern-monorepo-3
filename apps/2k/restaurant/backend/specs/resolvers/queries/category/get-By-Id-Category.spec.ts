import { CategoryModel } from "apps/2k/restaurant/backend/src/models/category.model";
import { getByIdCategory } from "apps/2k/restaurant/backend/src/resolvers/queries";

jest.mock('apps/2k/restaurant/backend/src/models/category.model');

describe('getByIdCategory', () => {
  it('should return a category when found', async () => {
    const mockCategory = { categoryId: '2', categoryName: 'Test Category' };
    (CategoryModel.findById as jest.Mock).mockResolvedValue(mockCategory);

    const result = await getByIdCategory({}, { categoryId: '2' }, {}, {} as any);
    expect(result).toEqual(expect.objectContaining(mockCategory));
  });

  it("should throw an error if category doesn't exist", async () => {
    (CategoryModel.findById as jest.Mock).mockResolvedValue(null);

    await expect(
      getByIdCategory({}, { categoryId: '3' }, {}, {} as any)
    ).rejects.toThrow('Category with ID 3 not found');
  });

  it('should throw an error if database fails', async () => {
    (CategoryModel.findById as jest.Mock).mockRejectedValue(new Error('DB error'));

    await expect(
      getByIdCategory({}, { categoryId: '2' }, {}, {} as any)
    ).rejects.toThrow('Failed to fetch category by ID');
  });
});
