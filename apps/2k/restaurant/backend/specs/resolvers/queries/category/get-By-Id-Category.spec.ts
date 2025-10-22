import { getByIdCategory } from '../../../../src/resolvers/queries/category/get-By-Id-Category';
import { CategoryModel } from '../../../../src/models/category.model';

jest.mock('../../../../src/models/category.model', () => ({
  CategoryModel: {
    findById: jest.fn().mockReturnThis(),
    populate: jest.fn(),
  },
}));

describe('getByIdCategory resolver', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a category when found', async () => {
    const mockCategory = { _id: '2', categoryName: 'Test Category' };

    // mock findById().populate()
    (CategoryModel.findById as jest.Mock).mockReturnValueOnce({
      populate: jest.fn().mockResolvedValueOnce(mockCategory),
    });

    const result = await getByIdCategory({}, { categoryId: '2' });

    expect(CategoryModel.findById).toHaveBeenCalledWith('2');
    expect(result).toEqual(mockCategory);
  });

  it("should throw an error if category doesn't exist", async () => {
    (CategoryModel.findById as jest.Mock).mockReturnValueOnce({
      populate: jest.fn().mockResolvedValueOnce(null),
    });

    await expect(getByIdCategory({}, { categoryId: '3' }))
      .rejects
      .toThrow('Category with ID 3 not found');
  });

  it('should throw an error if database fails', async () => {
    (CategoryModel.findById as jest.Mock).mockReturnValueOnce({
      populate: jest.fn().mockRejectedValueOnce(new Error('DB error')),
    });

    await expect(getByIdCategory({}, { categoryId: '2' }))
      .rejects
      .toThrow('DB error');
  });
});
