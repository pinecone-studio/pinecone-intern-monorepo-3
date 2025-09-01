import { getBooking } from '../../../src/resolvers/queries/get-booking-query';
import { BookingModel } from '../../../src/models/room-booking-model';

jest.mock('../../../src/models/room-booking-model');

const mockArgs = {
  userId: 'user123',
  hotelName: 'hotel123',
  roomNumber: 'room123',
  checkIn: new Date('2025-09-09'),
  checkOut: new Date('2025-09-12'),
  nights: 3,
  pricePerNight: 100,
  taxes: 30,
  totalPrice: 330,
};

const mockBooking = {
  _id: 'booking123',
  ...mockArgs,
  hotel: { _id: 'hotel123', hotelName: 'Mock Hotel' },
  room: { _id: 'room123', roomType: 'Deluxe' },
};

describe('getBooking resolver', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return booking if it exists', async () => {
    const secondPopulate = jest.fn().mockResolvedValue(mockBooking);
    const firstPopulate = jest.fn().mockReturnValue({ populate: secondPopulate });

    (BookingModel.findOne as jest.Mock).mockReturnValue({ populate: firstPopulate });

    const result = await getBooking(null, mockArgs);

    expect(BookingModel.findOne).toHaveBeenCalledWith({
      userId: mockArgs.userId,
      hotelName: mockArgs.hotelName,
      roomNumber: mockArgs.roomNumber,
      checkIn: mockArgs.checkIn,
      checkOut: mockArgs.checkOut,
    });

    expect(firstPopulate).toHaveBeenCalledWith('hotel');
    expect(secondPopulate).toHaveBeenCalledWith('room');
    expect(result).toEqual(mockBooking);
  });

  it('should throw error if no booking is found', async () => {
    const secondPopulate = jest.fn().mockResolvedValue(null);
    const firstPopulate = jest.fn().mockReturnValue({ populate: secondPopulate });

    (BookingModel.findOne as jest.Mock).mockReturnValue({ populate: firstPopulate });

    await expect(getBooking(null, mockArgs)).rejects.toThrow('No booking found');

    expect(BookingModel.findOne).toHaveBeenCalledWith({
      userId: mockArgs.userId,
      hotelName: mockArgs.hotelName,
      roomNumber: mockArgs.roomNumber,
      checkIn: mockArgs.checkIn,
      checkOut: mockArgs.checkOut,
    });

    expect(firstPopulate).toHaveBeenCalledWith('hotel');
    expect(secondPopulate).toHaveBeenCalledWith('room');
  });
});
