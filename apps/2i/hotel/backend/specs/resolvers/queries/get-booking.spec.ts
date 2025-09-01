import { getBooking } from '../../../src/resolvers/queries/get-booking-query';
import { BookingModel } from '../../../src/models/room-booking-model';
import mongoose from 'mongoose';

jest.mock('../../../src/models/room-booking-model');

describe('getBooking resolver', () => {
  const mockArgs = {
    userId: '68a6b9cfc9c7f7af314ae116',
    hotelName: '68b320ba9e01907e03193439',
    roomNumber: '68ac283284d8875c677cf288',
    checkIn: '2025-09-09',
    checkOut: '2025-09-12',
  };

  const mockBooking = {
    _id: 'booking123',
    userId: 'user123',
    hotelName: { _id: 'hotel123', hotelName: 'Mock Hotel' },
    roomNumber: { _id: 'room123', roomType: 'Deluxe' },
    checkIn: new Date('2025-09-09'),
    checkOut: new Date('2025-09-12'),
    nights: 3,
    pricePerNight: 100,
    taxes: 30,
    totalPrice: 330,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return booking if it exists', async () => {
    const secondPopulate = jest.fn().mockResolvedValue(mockBooking);
    const firstPopulate = jest.fn().mockReturnValue({ populate: secondPopulate });

    (BookingModel.findOne as jest.Mock).mockReturnValue({ populate: firstPopulate });

    const result = await getBooking(null, mockArgs);

    expect(BookingModel.findOne).toHaveBeenCalledWith({
      userId: new mongoose.Types.ObjectId(mockArgs.userId),
      hotelName: new mongoose.Types.ObjectId(mockArgs.hotelName),
      roomNumber: new mongoose.Types.ObjectId(mockArgs.roomNumber),
      checkIn: {
        $gte: new Date(new Date(mockArgs.checkIn).setHours(0, 0, 0, 0)),
        $lte: new Date(new Date(mockArgs.checkIn).setHours(23, 59, 59, 999)),
      },
      checkOut: {
        $gte: new Date(new Date(mockArgs.checkOut).setHours(0, 0, 0, 0)),
        $lte: new Date(new Date(mockArgs.checkOut).setHours(23, 59, 59, 999)),
      },
    });

    expect(firstPopulate).toHaveBeenCalledWith('hotelName');
    expect(secondPopulate).toHaveBeenCalledWith('roomNumber');
    expect(result).toEqual(mockBooking);
  });

  it('should throw error if no booking is found', async () => {
    const secondPopulate = jest.fn().mockResolvedValue(null);
    const firstPopulate = jest.fn().mockReturnValue({ populate: secondPopulate });

    (BookingModel.findOne as jest.Mock).mockReturnValue({ populate: firstPopulate });

    await expect(getBooking(null, mockArgs)).rejects.toThrow('No booking found');

    expect(firstPopulate).toHaveBeenCalledWith('hotelName');
    expect(secondPopulate).toHaveBeenCalledWith('roomNumber');
  });
});
