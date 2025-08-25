import { HotelModel } from '../../../src/models/hotel-model';
import { updateHotel } from '../../../src/resolvers/mutations';

jest.mock('../../../src/models/hotel-model', () => ({
  HotelModel: {
    findOneAndUpdate: jest.fn(),
  },
}));

describe('updateHotel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if no ID is provided', async () => {
    await expect(updateHotel(undefined, { hotelName: 'Test', location: 'UB' } as any)).rejects.toThrow('No ID provided');
  });

  it('should throw an error if hotel is not found', async () => {
    (HotelModel.findOneAndUpdate as jest.Mock).mockResolvedValueOnce(null);

    await expect(updateHotel(undefined, { id: '999', hotelName: 'Test Hotel' })).rejects.toThrow('Hotel not found');
  });

  it('should throw an error if no fields to update are provided', async () => {
    await expect(updateHotel(undefined, { id: 'some-id' })).rejects.toThrow('No fields to update');
  });

  it('should update and result should be returned', async () => {
    (HotelModel.findOneAndUpdate as jest.Mock).mockResolvedValueOnce({
      id: '003',
      hotelName: 'updated name',
      description: 'updated description',
      location: 'updated location',
      starRating: 'updated rating',
    });

    const result = await updateHotel(undefined, {
      id: '003',
      hotelName: 'updated name',
      description: 'updated description',
      location: 'updated location',
      starRating: 'updated rating',
    });

    expect(result).toEqual({
      id: '003',
      hotelName: 'updated name',
      description: 'updated description',
      location: 'updated location',
      starRating: 'updated rating',
    });

    expect(HotelModel.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: '003' },
      {
        hotelName: 'updated name',
        description: 'updated description',
        location: 'updated location',
        starRating: 'updated rating',
      },
      { new: true }
    );
  });
});
