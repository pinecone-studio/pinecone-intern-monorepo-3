import { RoomModel } from '../../models/room-model';
import { BookingModel } from '../../models/room-booking-model';

export const getAvailableRooms = async (
  _: unknown,
  args: {
    hotelId: string;
    checkIn: Date;
    checkOut: Date;
  }
) => {
  const { hotelId, checkIn, checkOut } = args;

  const bookedRoomIds = await BookingModel.find({
    hotelName: hotelId,

    checkIn: { $lt: checkOut },
    checkOut: { $gt: checkIn },
  }).distinct('roomNumber');

  const availableRooms = await RoomModel.find({
    hotelName: hotelId,
    _id: { $nin: bookedRoomIds },
  });

  if (availableRooms.length === 0) {
    throw new Error('No rooms available for the selected dates');
  }

  return availableRooms;
};
