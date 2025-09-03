import { bookingUpdate } from '../../../src/resolvers/mutations/booking-update-mutation';
import { BookingModel } from '../../../src/models/room-booking-model';

jest.mock('../../../src/models/room-booking-model', () => ({
  BookingModel: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

describe('bookingUpdate', () => {
  const args = {
    userId: 'user123',
    hotelName: 'hotelABC',
    roomNumber: '101',
    checkIn: new Date('2025-09-01'),
    checkOut: new Date('2025-09-05'),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update existing booking if found', async () => {
    const saveMock = jest.fn();
    const existingBooking = {
      ...args,
      save: saveMock,
    };

    (BookingModel.findOne as jest.Mock).mockResolvedValue(existingBooking);

    const result = await bookingUpdate({}, args);

    expect(BookingModel.findOne).toHaveBeenCalledWith({
      roomNumber: args.roomNumber,
      userId: args.userId,
    });

    expect(existingBooking.checkIn).toEqual(args.checkIn);
    expect(existingBooking.checkOut).toEqual(args.checkOut);
    expect(existingBooking.hotelName).toEqual(args.hotelName);

    expect(saveMock).toHaveBeenCalledTimes(1);
    expect(result).toBe(existingBooking);
  });

  it('should create new booking if not found', async () => {
    (BookingModel.findOne as jest.Mock).mockResolvedValue(null);

    const saveMock = jest.fn();
    const newBooking = {
      ...args,
      save: saveMock,
    };

    (BookingModel.create as jest.Mock).mockResolvedValue(newBooking);

    const result = await bookingUpdate({}, args);

    expect(BookingModel.findOne).toHaveBeenCalledWith({
      roomNumber: args.roomNumber,
      userId: args.userId,
    });

    expect(BookingModel.create).toHaveBeenCalledWith(args);
    expect(saveMock).toHaveBeenCalledTimes(1);
    expect(result).toBe(newBooking);
  });
});
