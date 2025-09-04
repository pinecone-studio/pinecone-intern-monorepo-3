import { BookingModel } from '../../models/room-booking-model';

export const getmostBookedHotels = async () => {
  try {
    const bookings = await BookingModel.aggregate([
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

    return bookings?.map((b) => b.hotel) || [];
  } catch (error) {
    console.error('Failed to fetch most booked hotels:', error);
    return [];
  }
};
