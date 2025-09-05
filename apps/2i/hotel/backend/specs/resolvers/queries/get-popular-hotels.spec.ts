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
      { _id: 'h1', hotelName: 'Hotel One', userRating: [{ rating: 5 }], avgRating: 5 },
      { _id: 'h2', hotelName: 'Hotel Two', userRating: [{ rating: 4 }], avgRating: 4 },
      { _id: 'h3', hotelName: 'Hotel Three', userRating: [{ rating: 3 }], avgRating: 3 },
      { _id: 'h4', hotelName: 'Hotel Four', userRating: [{ rating: 2 }], avgRating: 2 },
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

  it('should return an empty array when aggregation returns null', async () => {
    (HotelModel.aggregate as jest.Mock).mockResolvedValue(null);

    const result = await getpopularHotels();

    expect(HotelModel.aggregate).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('should throw error when aggregation fails', async () => {
    (HotelModel.aggregate as jest.Mock).mockRejectedValue(new Error('Aggregation failed'));

    await expect(getpopularHotels()).rejects.toThrow('Failed to fetch popular hotels');
    expect(HotelModel.aggregate).toHaveBeenCalled();
  });
});
