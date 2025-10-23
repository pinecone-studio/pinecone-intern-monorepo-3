import { GetAllOrders } from '../../../../src/resolvers/queries/foodOrder/get-all-order';
import { FoodOrder } from '../../../../src/models/food-order.model';

jest.mock('../../../../src/models/food-order.model', () => ({
  FoodOrder: {
    find: jest.fn(),
  },
}));

describe('GetAllOrders', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all orders with populated foodOrderItems.food', async () => {
    const mockOrders = [
      { _id: '1', totalPrice: 10000, foodOrderItems: [{ food: { name: 'Pizza' } }] },
      { _id: '2', totalPrice: 20000, foodOrderItems: [{ food: { name: 'Burger' } }] },
    ];

    // .find() нь populate-той chain-ээр ажилладаг тул mock-д populate-г mock хийх
    (FoodOrder.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockOrders),
    });

    const result = await GetAllOrders();

    expect(result).toEqual(mockOrders);
    expect(FoodOrder.find).toHaveBeenCalledTimes(1);
  });

  it('should return an empty array when no orders exist', async () => {
    (FoodOrder.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue([]),
    });

    const result = await GetAllOrders();

    expect(result).toEqual([]);
  });

  it('should log errors when find fails', async () => {
    const error = new Error('DB error');
    (FoodOrder.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockRejectedValue(error),
    });
    console.log = jest.fn();

    const result = await GetAllOrders();

    expect(console.log).toHaveBeenCalledWith(error);
    expect(result).toBeUndefined();
  });
});
