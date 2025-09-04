import { HotelModel } from '../../../src/models/hotel-model';
import { getpopularHotels } from '../../../src/resolvers/queries';

jest.mock('../../../src/models/hotel-model', () => ({
  HotelModel: {
    aggregate: jest.fn(),
  },
}));

describe('getpopularHotels', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return top 4 popular hotels when aggregation succeeds', async () => {
    const mockHotels = [
      { _id: 'h1', hotelName: 'Hotel One', avgRating: 5 },
      { _id: 'h2', hotelName: 'Hotel Two', avgRating: 4 },
    ];

    (HotelModel.aggregate as jest.Mock).mockResolvedValue(mockHotels);

    const result = await getpopularHotels();

    expect(HotelModel.aggregate).toHaveBeenCalledWith([
      {
        $addFields: {
          avgRating: { $avg: '$userRating.rating' },
        },
      },
      { $sort: { avgRating: -1 } },
      { $limit: 4 },
    ]);
    expect(result).toEqual(mockHotels);
  });

  it('should return empty array when aggregation fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    (HotelModel.aggregate as jest.Mock).mockRejectedValue(new Error('Aggregation failed'));

    const result = await getpopularHotels();

    expect(result).toEqual([]);
    expect(HotelModel.aggregate).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch popular hotels:', expect.any(Error));

    consoleSpy.mockRestore();
  });
});
