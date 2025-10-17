import { updateFood } from '../../../../src/resolvers/mutations/food/update-food';
import { Food } from '../../../../src/models/food.model';

// Mongoose model-ийн төрөлд нийцүүлэхийн тулд Partial<typeof Food> ашиглана
jest.mock('../../../../src/models/food.model', () => ({
  Food: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

describe('updateFood mutation', () => {
  const mockFindById = Food.findById as jest.Mock;
  const mockFindByIdAndUpdate = Food.findByIdAndUpdate as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call findByIdAndUpdate and return updated food', async () => {
    mockFindById.mockResolvedValue(true);
    mockFindByIdAndUpdate.mockResolvedValue({
      id: '123',
      name: 'Burger',
      image: 'burger.png',
      price: 15,
      available: true,
    });

    const args = {
      id: '123',
      name: 'Burger',
      image: 'burger.png',
      price: 15,
      available: true,
    };

    const result = await updateFood({}, args);

    expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
      '123',
      {
        name: 'Burger',
        available: true,
        image: 'burger.png',
        price: 15,
      },
      { new: true }
    );

    expect(result).toEqual({
      id: '123',
      name: 'Burger',
      available: true,
      image: 'burger.png',
      price: 15,
    });
  });

  it('should return undefined if food not found', async () => {
    mockFindById.mockResolvedValue(null);

    const args = {
      id: '999',
      name: 'Pizza',
      image: 'pizza.png',
      price: 20,
      available: true,
    };

    const result = await updateFood({}, args);

    expect(mockFindByIdAndUpdate).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it('should return undefined if id is missing', async () => {
    const result = await updateFood({}, {
      id: '',
      name: 'Test',
      image: '',
      price: 10,
      available: true,
    });

    expect(result).toBeUndefined();
  });

  it('should handle DB error gracefully', async () => {
    mockFindById.mockResolvedValue(true);
    mockFindByIdAndUpdate.mockRejectedValue(new Error('DB error'));

    const result = await updateFood({}, {
      id: '1',
      name: 'Test',
      image: '',
      price: 10,
      available: true,
    });

    expect(result).toBeUndefined();
  });
});
