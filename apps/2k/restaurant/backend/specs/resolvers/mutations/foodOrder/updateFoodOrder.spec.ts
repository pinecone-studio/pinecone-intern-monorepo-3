// __tests__/updateOrder.test.ts
import { UpdateOrder } from '../../../../src/resolvers/mutations/foodOrder/update-food-order'
import { FoodOrder } from '../../../../src/models/food-order.model';
import { FoodOrderStatus, UpdateOrderStatusInput } from '../../../../src/generated';
// import { UpdateOrderStatusInput } from '../../../src/generated';

jest.mock('../../../../src/models/food-order.model', () => ({
  FoodOrder: {
    findByIdAndUpdate: jest.fn(),
  },
}));


describe('UpdateOrder Resolver', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockOrder = {
    _id: 'order_123',
    user: 'user_123',
    status: 'PENDING',
    foodOrderItems: [{ food: { name: 'Pizza', price: 2000 }, quantity: 2 }],
    tableId: 'table_1',
    totalPrice: 4000,
    orderNumber: 10,
    serveType: 'DINE_IN',
    createdAt: new Date('2025-10-23T12:00:00Z'),
    updatedAt: new Date('2025-10-23T12:00:00Z'),
  };

  it('should update order status and return updated order', async () => {
    (FoodOrder.findByIdAndUpdate as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue({ ...mockOrder, status: 'COMPLETED' }),
    });

    const input: UpdateOrderStatusInput = {
      order: 'order_123',
      status: FoodOrderStatus.Completed,
    };

    const result = await UpdateOrder(null, { input });

    expect(FoodOrder.findByIdAndUpdate).toHaveBeenCalledWith(
      'order_123',
      { status: 'COMPLETED' },
      { new: true }
    );

    expect(result).toEqual({
      id: 'order_123',
      user: 'user_123',
      status: 'COMPLETED',
      foodOrderItems: mockOrder.foodOrderItems,
      tableId: 'table_1',
      totalPrice: 4000,
      orderNumber: 10,
      serveType: 'DINE_IN',
      createdAt: mockOrder.createdAt,
      updatedAt: mockOrder.updatedAt,
    });
  });

  it('should throw an error if order not found', async () => {
    (FoodOrder.findByIdAndUpdate as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(null),
    });

    const input: UpdateOrderStatusInput = {
      order: 'non_existing_order',
      status: FoodOrderStatus.Completed,
    };

    await expect(UpdateOrder(null, { input })).rejects.toThrow('Order not found');
  });

  it('should call populate with correct path', async () => {
    const populateMock = jest.fn().mockResolvedValue({ ...mockOrder, status: 'COMPLETED' });
    (FoodOrder.findByIdAndUpdate as jest.Mock).mockReturnValue({ populate: populateMock });

    const input: UpdateOrderStatusInput = {
      order: 'order_123',
      status: FoodOrderStatus.Completed,
    };

    await UpdateOrder(null, { input });

    expect(populateMock).toHaveBeenCalledWith({ path: 'foodOrderItems.food' });
  });
});
