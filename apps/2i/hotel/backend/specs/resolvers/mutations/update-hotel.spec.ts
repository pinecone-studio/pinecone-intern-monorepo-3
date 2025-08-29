import { HotelModel } from '../../../src/models/hotel-model';
import { updateHotel } from '../../../src/resolvers/mutations/update-hotel';

// HotelModel-ийг mock хийнэ
jest.mock('../../../src/models/hotel-model', () => {
  return {
    HotelModel: {
      findByIdAndUpdate: jest.fn(),
    },
  };
});

describe('updateHotel', () => {
  const mockHotel = {
    _id: '123',
    hotelName: 'Test Hotel',
    description: 'Old description',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update hotel successfully', async () => {
    // Mock буцаах утга
    (HotelModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({
      ...mockHotel,
      description: 'New description',
    });

    const result = await updateHotel(null, {
      id: '123',
      input: { description: 'New description' },
    });

    expect(HotelModel.findByIdAndUpdate).toHaveBeenCalledWith('123', { $set: { description: 'New description' } }, { new: true });

    expect(result.message).toBe('Successfully updated');
  });

  it('should throw error if hotel not found', async () => {
    (HotelModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);
    await expect(updateHotel(null, { id: 'not-exist', input: { hotelName: 'Fail' } })).rejects.toThrow('Hotel not found');
  });
});
