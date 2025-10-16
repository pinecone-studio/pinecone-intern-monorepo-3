import { DeleteFood } from "../../../../src/resolvers/mutations/food/delete-food";
import { Food } from "../../../../src/models/food.model";

jest.mock('../../../../src/models/food.model', () => ({
  Food: {
    findByIdAndDelete: jest.fn(),
  },
}));

describe('DeleteFood', () => {
  afterEach(() => {
    jest.clearAllMocks(); // ← энэ нь өмнөх mock дуудлагуудыг арилгана
  });

  it('should return deleted food if found', async () => {
    const mockFood = { _id: '1', name: 'Pizza' };
    (Food.findByIdAndDelete as jest.Mock).mockResolvedValue(mockFood);

    const result = await DeleteFood(null, { foodId: '1' });
    expect(result).toEqual(mockFood);
    expect(Food.findByIdAndDelete).toHaveBeenCalledWith('1');
  });

  it('should return null if food not found', async () => {
    (Food.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

    const result = await DeleteFood(null, { foodId: '2' });
    expect(result).toBeNull();
    expect(Food.findByIdAndDelete).toHaveBeenCalledWith('2');
  });

  it('should catch and log error', async () => {
    const error = new Error('DB error');
    (Food.findByIdAndDelete as jest.Mock).mockRejectedValue(error);
    console.log = jest.fn();

    const result = await DeleteFood(null, { foodId: '3' });
    expect(result).toBeUndefined();
    expect(console.log).toHaveBeenCalledWith(error);
  });

  it('should return undefined if no foodId is provided', async () => {
    const result = await DeleteFood(null, { foodId: '' });
    expect(result).toBeUndefined();
    expect(Food.findByIdAndDelete).not.toHaveBeenCalled();
  });
});