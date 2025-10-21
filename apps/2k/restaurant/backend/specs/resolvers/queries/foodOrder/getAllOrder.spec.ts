import { GetAllOrders } from '../../../../src/resolvers/queries/foodOrder/get-all-order';
import { FoodOrder } from '../../../../src/models/food-order.model';

jest.mock('apps/2k/restaurant/backend/src/models/food-order.model', () => ({
  FoodOrder: {
    find: jest.fn(),
  },
}));

describe('GetAllOrders', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all orders when data exists', async () => {
    const mockOrders = [
      { _id: '1', totalPrice: 10000 },
      { _id: '2', totalPrice: 20000 },
    ];

    (FoodOrder.find as jest.Mock).mockResolvedValue(mockOrders);

    const result = await GetAllOrders();

    expect(result).toEqual(mockOrders);
    expect(FoodOrder.find).toHaveBeenCalledTimes(1);
  });

  it('should return an empty array when no orders exist', async () => {
    (FoodOrder.find as jest.Mock).mockResolvedValue([]);

    const result = await GetAllOrders();

    expect(result).toEqual([]);
    expect(FoodOrder.find).toHaveBeenCalledTimes(1);
  });

  it('should log and handle errors', async () => {
    const error = new Error('DB error');
    (FoodOrder.find as jest.Mock).mockRejectedValue(error);
    console.log = jest.fn();

    const result = await GetAllOrders();

    expect(console.log).toHaveBeenCalledWith(error);
    expect(result).toBeUndefined();
  });
});
