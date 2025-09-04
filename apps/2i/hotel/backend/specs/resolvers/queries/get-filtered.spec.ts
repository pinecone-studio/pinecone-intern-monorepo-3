import { getFiltered } from '../../../src/resolvers/queries';
import { HotelModel } from '../../../src/models/hotel-model';

jest.mock('../../../src/models/hotel-model');

describe('getFiltered', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockHotels = [
    {
      _id: '001',
      hotelName: 'Test Hotel',
      locations: 'Test Location',
      starRating: '5',
    },
  ];

  it('should return filtered hotels', async () => {
    (HotelModel.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockHotels),
    });

    const args = {
      roomType: 'Deluxe',
      locations: 'Test Location',
      starRating: '5',
    };

    const result = await getFiltered(null, args);

    expect(HotelModel.find).toHaveBeenCalledWith({
      locations: 'Test Location',
      starRating: '5',
    });

    expect(result).toEqual([
      {
        id: '001',
        hotelName: 'Test Hotel',
        locations: 'Test Location',
        starRating: '5',
      },
    ]);
  });
});
