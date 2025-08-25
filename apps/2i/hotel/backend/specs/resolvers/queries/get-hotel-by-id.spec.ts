import { HotelModel } from '../../../src/models/hotel-model';
import { getHotelById } from '../../../src/resolvers/queries';

jest.mock('../../../src/models/hotel-model');

describe('getHotelById', () => {
  const mockHotel = {
    _id: '001',
    hotelName: 'Test Hotel',
    location: 'UB',
    description: 'Test description',
    starRating: '5 star',
    userRating: [],
    image: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return hotel if found', async () => {
    const mockPopulate = jest.fn().mockResolvedValue(mockHotel);

    (HotelModel.findById as jest.Mock).mockReturnValue({ populate: mockPopulate });

    const result = await getHotelById({}, { id: '001' });

    expect(HotelModel.findById).toHaveBeenCalledWith('001');
    expect(mockPopulate).toHaveBeenCalledWith('rooms');
    expect(result).toEqual(mockHotel);
  });

  it('should throw server error on exception', async () => {
    const mockPopulate = jest.fn().mockRejectedValue(new Error('Some DB error'));

    (HotelModel.findById as jest.Mock).mockReturnValue({ populate: mockPopulate });

    await expect(getHotelById({}, { id: '001' })).rejects.toThrow('Server error');

    expect(HotelModel.findById).toHaveBeenCalledWith('001');
    expect(mockPopulate).toHaveBeenCalledWith('rooms');
  });
});
