import { getBooking } from '../../../src/resolvers/queries/get-booking-query';
import { BookingModel } from '../../../src/models/room-booking-model';

jest.mock('../../../src/models/room-booking-model', () => ({
  BookingModel: {
    find: jest.fn(),
  },
}));

describe('getBooking resolver', () => {
  const mockBooking = {
    _id: 'booking123',
    userId: 'user123',
    hotelName: { _id: 'hotel123', hotelName: 'Test Hotel' },
    roomNumber: {
      _id: 'room123',
      roomNumber: '101',
      roomType: 'Deluxe',
      pricePerNight: 100000,
    },
    checkIn: new Date('2025-10-01T00:00:00Z'),
    checkOut: new Date('2025-10-03T00:00:00Z'),
    nights: 2,
    pricePerNight: 100000,
    taxes: 20000,
    totalPrice: 220000,
    email: 'test@gmail.com',

    firstName: 'baabar',
    lastName: 'baabar',

    phoneNumber: '99999999',
    cardNumber: '123456789',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a list of bookings with formatted dates', async () => {
    const mockPopulateRoom = jest.fn().mockResolvedValue([mockBooking]);
    const mockPopulateHotel = jest.fn().mockReturnValue({ populate: mockPopulateRoom });
    (BookingModel.find as jest.Mock).mockReturnValue({ populate: mockPopulateHotel });

    const result = await getBooking();

    expect(BookingModel.find).toHaveBeenCalled();
    expect(mockPopulateHotel).toHaveBeenCalledWith('hotelName');
    expect(mockPopulateRoom).toHaveBeenCalledWith('roomNumber');

    expect(result).toEqual([
      {
        _id: mockBooking._id,
        user: mockBooking.userId,
        hotel: mockBooking.hotelName,
        room: mockBooking.roomNumber,
        checkIn: mockBooking.checkIn.toISOString(),
        checkOut: mockBooking.checkOut.toISOString(),
        nights: mockBooking.nights,
        pricePerNight: mockBooking.pricePerNight,
        taxes: mockBooking.taxes,
        totalPrice: mockBooking.totalPrice,
        email: mockBooking.email,

        firstName: mockBooking.firstName,
        lastName: mockBooking.lastName,

        phoneNumber: mockBooking.phoneNumber,
        cardNumber: mockBooking.cardNumber,
      },
    ]);
  });

  it('should return undefined checkIn/checkOut if missing', async () => {
    const incompleteBooking = {
      ...mockBooking,
      checkIn: undefined,
      checkOut: undefined,
    };

    const mockPopulateRoom = jest.fn().mockResolvedValue([incompleteBooking]);
    const mockPopulateHotel = jest.fn().mockReturnValue({ populate: mockPopulateRoom });
    (BookingModel.find as jest.Mock).mockReturnValue({ populate: mockPopulateHotel });

    const result = await getBooking();

    expect(result[0].checkIn).toBeUndefined();
    expect(result[0].checkOut).toBeUndefined();
  });

  it('should throw error if no bookings are found', async () => {
    const mockPopulateRoom = jest.fn().mockResolvedValue([]);
    const mockPopulateHotel = jest.fn().mockReturnValue({ populate: mockPopulateRoom });
    (BookingModel.find as jest.Mock).mockReturnValue({ populate: mockPopulateHotel });

    await expect(getBooking()).rejects.toThrow('No booking found');
  });
});
