import { HotelType } from '@/app/admin/_Components/HotelsPage';

// utils/hotel.ts
export const mapHotelData = (data: any): HotelType | null => {
  if (!data?.getHotelById) return null;

  const hotel = data.getHotelById;
  return {
    _id: hotel._id,
    hotelName: hotel.hotelName ?? '',
    description: hotel.description ?? '',
    location: hotel.location ?? '',
    starRating: hotel.starRating ?? '',
    image: hotel.image ?? [],
    userRating:
      hotel.userRating?.map((r: any) => ({
        rating: r?.rating ?? 0,
        comment: r?.comment ?? '',
        hotel: r?.hotel ?? '',
      })) ?? [],
    rooms:
      hotel.rooms?.map((r: any) => ({
        roomType: r?.roomType ?? '',
      })) ?? [],
  };
};
