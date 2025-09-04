import { BookingModel } from '../../models/room-booking-model';

export const getmostBookedHotels = async () => {
  try {
    const mostBookedHotels = await BookingModel.aggregate([
      {
        $group: {
          _id: '$hotel',
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
    return mostBookedHotels.map((b) => b.hotel);
  } catch (err) {
    console.error(err);
    return [];
  }
};
