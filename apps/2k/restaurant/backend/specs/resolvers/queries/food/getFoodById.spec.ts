import { GetFoodById } from '../../../../src/resolvers/queries/food/get-food-by-id';
import { Food } from '../../../../src/models/food.model';

jest.mock('../../../../src/models/food.model', () => ({
  Food: {
    findById: jest.fn(),
  },
}));

describe('GetFoodById', () => {
  it('should return food if found', async () => {
    const mockFood = { _id: '1', name: 'Pizza' };
    (Food.findById as jest.Mock).mockResolvedValue(mockFood);

    const result = await GetFoodById(null, { foodId: '1' });
    expect(result).toEqual(mockFood);
  });

  it('should return undefined if food not found', async () => {
    (Food.findById as jest.Mock).mockResolvedValue(null);

    const result = await GetFoodById(null, { foodId: '2' });
    expect(result).toEqual([]);
  });
});
