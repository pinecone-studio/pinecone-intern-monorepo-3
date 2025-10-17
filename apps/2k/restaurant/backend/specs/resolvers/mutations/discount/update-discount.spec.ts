import { updateDiscount } from '../../../../src/resolvers/mutations/discount/update-discount';
import { DiscountModel } from '../../../../src/models/discount.model';

jest.mock('../../../../src/models/discount.model');

describe('updateDiscount resolver', () => {
  const mockDiscount = {
    _id: '6710f0b9d0e4a12c34567890',
    discountName: 'Updated Discount',
    discountRate: 20,
    startDate: '2025-10-10',
    endDate: '2025-10-20',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update a discount successfully', async () => {
    // findByIdAndUpdate амжилттай ажиллаж mockDiscount буцаана
    (DiscountModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockDiscount);

    const result = await updateDiscount(null, {
      discountId: mockDiscount._id,
      input: {
        discountName: 'Updated Discount',
        discountRate: 20,
        startDate: '2025-10-10',
        endDate: '2025-10-20',
      },
    });

    expect(DiscountModel.findByIdAndUpdate).toHaveBeenCalledWith(
      mockDiscount._id,
      {
        $set: {
          discountName: 'Updated Discount',
          discountRate: 20,
          startDate: '2025-10-10',
          endDate: '2025-10-20',
        },
      },
      { new: true, runValidators: true }
    );

    expect(result).toEqual(mockDiscount);
  });

  it('should throw an error if discount not found', async () => {
    (DiscountModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

    await expect(
      updateDiscount(null, {
        discountId: 'invalid-id',
        input: {
          discountName: 'Does not exist',
          discountRate: 30,
          startDate: '2025-10-10',
          endDate: '2025-10-20',
        },
      })
    ).rejects.toThrow('Discount with ID invalid-id not found');
  });
});
