import { getAllOrderByUserId } from '../../../../src/resolvers/queries/foodOrder/get-all-order-byuserid';
import { FoodOrder } from '../../../../src/models/food-order.model';

// FoodOrder model-ийг mock-лох
jest.mock('../../../../src/models/food-order.model', () => ({
  FoodOrder: {
    find: jest.fn(),
  },
}));

describe('getAllOrderByUserId', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('userId байхгүй үед хоосон массив буцаах ёстой', async () => {
    const result = await getAllOrderByUserId(null as any, { userId: '' });
    expect(result).toEqual([]);
    expect(FoodOrder.find).not.toHaveBeenCalled();
  });

  it('FoodOrder.find буцаасан өгөгдлийг буцаах ёстой', async () => {
    const mockOrders = [
      { _id: '1', userId: 'abc123', totalPrice: 15000 },
      { _id: '2', userId: 'abc123', totalPrice: 20000 },
    ];

    (FoodOrder.find as jest.Mock).mockResolvedValue(mockOrders);

    const result = await getAllOrderByUserId(null as any, { userId: 'abc123' });

    expect(FoodOrder.find).toHaveBeenCalledWith({ userId: 'abc123' });
    expect(result).toEqual(mockOrders);
  });

  it('FoodOrder.find null буцаавал хоосон массив буцаах ёстой', async () => {
    (FoodOrder.find as jest.Mock).mockResolvedValue(null);

    const result = await getAllOrderByUserId(null as any, { userId: 'xyz789' });

    expect(result).toEqual([]);
  });
});