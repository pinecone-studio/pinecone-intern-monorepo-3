import { BookingModel } from '../../../src/models/room-booking-model';
import { getmostBookedHotels } from '../../../src/resolvers/queries';

jest.mock('../../../src/models/room-booking-model', () => ({
  BookingModel: {
    aggregate: jest.fn(),
  },
}));

describe('getmostBookedHotels', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return most booked hotels when aggregation succeeds', async () => {
    const mockHotels = [
      {
        _id: 'hotel1',
        count: 5,
        hotel: { _id: 'hotel1', hotelName: 'Hotel One', location: 'UB' },
      },
      {
        _id: 'hotel2',
        count: 3,
        hotel: { _id: 'hotel2', hotelName: 'Hotel Two', location: 'NY' },
      },
    ];

    (BookingModel.aggregate as jest.Mock).mockResolvedValue(mockHotels);

    const result = await getmostBookedHotels();

    expect(BookingModel.aggregate).toHaveBeenCalledWith([
      {
        $group: {
          _id: '$hotelName',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'hotels',
          localField: '_id',
          foreignField: '_id',
          as: 'hotel',
        },
      },
      { $unwind: '$hotel' },
    ]);

    // since getmostBookedHotels() maps to b.hotel
    expect(result).toEqual([
      { _id: 'hotel1', hotelName: 'Hotel One', location: 'UB' },
      { _id: 'hotel2', hotelName: 'Hotel Two', location: 'NY' },
    ]);
  });

  it('should return empty array when aggregation fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); // suppress console.error

    (BookingModel.aggregate as jest.Mock).mockRejectedValue(new Error('Aggregation failed'));

    const result = await getmostBookedHotels();

    expect(result).toEqual([]);
    expect(BookingModel.aggregate).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalled(); // хүсвэл шалгаж болно

    consoleSpy.mockRestore();
  });
});
