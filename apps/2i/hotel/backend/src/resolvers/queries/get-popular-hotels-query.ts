import { HotelModel } from '../../models/hotel-model';

export const getpopularHotels = async () => {
  try {
    const hotels = await HotelModel.aggregate([
      {
        $addFields: {
          avgRating: { $avg: '$userRating.rating' },
        },
      },
      { $sort: { avgRating: -1 } },
      { $limit: 4 },
    ]);

    return hotels || [];
  } catch (error) {
    console.error('Failed to fetch popular hotels:', error);
    return [];
  }
};
