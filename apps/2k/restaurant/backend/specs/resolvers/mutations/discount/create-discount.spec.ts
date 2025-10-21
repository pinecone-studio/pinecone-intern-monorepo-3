import { createDiscount } from '../../../../src/resolvers/mutations/discount/create-discount';
import { DiscountModel } from '../../../../src/models/discount.model';

jest.mock('../../../../src/models/discount.model'); 

describe('createDiscount resolver', () => {
  const mockInput = {
    discountName: 'Winter Sale',
    discountRate: 25,
    startDate: '2025-12-01',
    endDate: '2025-12-31',
  };

  const mockDiscount = {
    _id: '6710f0b9d0e4a12c34567890',
    ...mockInput,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new discount successfully', async () => {
    (DiscountModel.create as jest.Mock).mockResolvedValue(mockDiscount);

    const result = await createDiscount(null, { input: mockInput });

    expect(DiscountModel.create).toHaveBeenCalledWith(mockInput);
    expect(result).toEqual(mockDiscount);
  });

  it('should throw an error if creation fails', async () => {
    (DiscountModel.create as jest.Mock).mockRejectedValue(new Error('Database error'));

    await expect(createDiscount(null, { input: mockInput }))
      .rejects
      .toThrow('Failed to create discount');
  });
});
