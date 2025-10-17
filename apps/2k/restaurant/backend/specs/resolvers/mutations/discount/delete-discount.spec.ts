import { deleteDiscount } from '../../../../src/resolvers/mutations/discount/delete-discount';
import { DiscountModel } from '../../../../src/models/discount.model';

jest.mock('../../../../src/models/discount.model');

describe('deleteDiscount resolver', () => {
  const mockDiscount = {
    _id: '6710f0b9d0e4a12c34567890',
    discountName: 'Summer Sale',
    discountRate: 15,
    startDate: '2025-06-01',
    endDate: '2025-06-30',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a discount successfully', async () => {
    (DiscountModel.findByIdAndDelete as jest.Mock).mockResolvedValue(mockDiscount);

    const result = await deleteDiscount(null, { discountId: mockDiscount._id });

    expect(DiscountModel.findByIdAndDelete).toHaveBeenCalledWith(mockDiscount._id);
    expect(result).toEqual(mockDiscount);
  });

  it('should throw an error if discount not found', async () => {
    (DiscountModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

    await expect(deleteDiscount(null, { discountId: 'invalid-id' }))
      .rejects
      .toThrow('Discount with ID invalid-id not found');
  });
});
