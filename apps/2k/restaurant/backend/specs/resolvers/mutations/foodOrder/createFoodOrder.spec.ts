import { FoodOrderInput, FoodOrderStatus, FoodServeType } from '../../../../src/generated';
import { createOrder } from '../../../../src/resolvers/mutations/foodOrder/create-food-order';
import { FoodOrder } from '../../../../src/models/food-order.model';

jest.mock('apps/2k/restaurant/backend/src/models/food-order.model', () => ({
  FoodOrder: {
    create: jest.fn(),
  },
}));

describe('createOrder', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create and return a new food order', async () => {
    const mockInput: FoodOrderInput = {
      totalPrice: 5000,
      status: FoodOrderStatus.Pending,
      serveType: FoodServeType.In, // <-- enum ашигласан
      foodOrderItems: [{ food: 'food1', quantity: 2 }],
    };

    const mockCreatedOrder = {
      _id: 'order1',
      ...mockInput,
      userId: 'user1',
      tableId: 'table1',
      orderNumber: 12345,
    };

    (FoodOrder.create as jest.Mock).mockResolvedValue(mockCreatedOrder);

    const result = await createOrder(null, {
      userId: 'user1',
      tableId: 'table1',
      input: mockInput,
    });

    expect(result).toEqual(mockCreatedOrder);
    expect(FoodOrder.create).toHaveBeenCalledWith(
      expect.objectContaining({
        ...mockInput,
        userId: 'user1',
        tableId: 'table1',
        orderNumber: expect.any(Number),
      })
    );
  });

  it('should return null if userId, tableId or input is missing', async () => {
    const result1 = await createOrder(null, { userId: '', tableId: 'table1', input: {} as FoodOrderInput });
    const result2 = await createOrder(null, { userId: 'user1', tableId: '', input: {} as FoodOrderInput });
    const result3 = await createOrder(null, { userId: 'user1', tableId: 'table1', input: null as any });

    expect(result1).toBeNull();
    expect(result2).toBeNull();
    expect(result3).toBeNull();
  });
});
