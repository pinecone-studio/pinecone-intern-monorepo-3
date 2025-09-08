import { roomBooking } from '../../../src/resolvers/mutations/room-booking-mutation';
import { RoomModel } from '../../../src/models/room-model';
import { BookingModel } from '../../../src/models/room-booking-model';
import { HotelModel } from '../../../src/models/hotel-model';

jest.mock('../../../src/models/room-model');
jest.mock('../../../src/models/hotel-model');
jest.mock('../../../src/models/room-booking-model');

describe('roomBooking mutation', () => {
  const mockArgs = {
    userId: 'user-123',
    hotelName: 'hotel-456',
    roomNumber: 'room-789',
    checkIn: '2025-09-09',
    checkOut: '2025-09-12',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if hotel is not found', async () => {
    (HotelModel.findById as jest.Mock).mockResolvedValue(null);

    await expect(roomBooking(null, mockArgs)).rejects.toThrow('Hotel not found');

    expect(HotelModel.findById).toHaveBeenCalledWith(mockArgs.hotelName);
  });

  it('should throw an error if room is not found', async () => {
    (HotelModel.findById as jest.Mock).mockResolvedValue({ _id: mockArgs.hotelName });
    (RoomModel.findById as jest.Mock).mockResolvedValue(null);

    await expect(roomBooking(null, mockArgs)).rejects.toThrow('Room not found');

    expect(HotelModel.findById).toHaveBeenCalledWith(mockArgs.hotelName);
    expect(RoomModel.findById).toHaveBeenCalledWith(mockArgs.roomNumber);
  });

  it('should throw an error if there is an overlapping booking', async () => {
    (HotelModel.findById as jest.Mock).mockResolvedValue({ _id: mockArgs.hotelName });
    (RoomModel.findById as jest.Mock).mockResolvedValue({ _id: mockArgs.roomNumber, pricePerNight: 100 });
    (BookingModel.findOne as jest.Mock).mockResolvedValue({ _id: 'existing-booking' });

    await expect(roomBooking(null, mockArgs)).rejects.toThrow('This room is already booked for the selected dates.');

    expect(BookingModel.findOne).toHaveBeenCalledWith({
      roomNumber: mockArgs.roomNumber,
      $or: [
        {
          checkIn: { $lt: new Date(mockArgs.checkOut) },
          checkOut: { $gt: new Date(mockArgs.checkIn) },
        },
      ],
    });
  });

  it('should create a new booking successfully', async () => {
    (HotelModel.findById as jest.Mock).mockResolvedValue({ _id: mockArgs.hotelName, name: 'Test Hotel' });
    (RoomModel.findById as jest.Mock).mockResolvedValue({ _id: mockArgs.roomNumber, pricePerNight: 100 });

    (BookingModel.findOne as jest.Mock).mockResolvedValue(null);

    const saveMock = jest.fn().mockResolvedValue(undefined);
    const toObjectMock = jest.fn().mockReturnValue({
      _id: 'booking-123',
      userId: mockArgs.userId,
      hotelName: mockArgs.hotelName,
      roomNumber: mockArgs.roomNumber,
      checkIn: new Date(mockArgs.checkIn),
      checkOut: new Date(mockArgs.checkOut),
      nights: 3,
      pricePerNight: 100,
      taxes: 30,
      totalPrice: 330,
    });

    (BookingModel as unknown as jest.Mock).mockImplementation(() => ({
      save: saveMock,
      toObject: toObjectMock,
    }));

    const result = await roomBooking(null, mockArgs);

    expect(HotelModel.findById).toHaveBeenCalledWith(mockArgs.hotelName);
    expect(RoomModel.findById).toHaveBeenCalledWith(mockArgs.roomNumber);
    expect(BookingModel.findOne).toHaveBeenCalled();

    expect(saveMock).toHaveBeenCalled();

    expect(result).toEqual({
      _id: 'booking-123',
      userId: mockArgs.userId,
      hotelName: mockArgs.hotelName,
      roomNumber: mockArgs.roomNumber,
      checkIn: new Date(mockArgs.checkIn).toISOString(),
      checkOut: new Date(mockArgs.checkOut).toISOString(),
      nights: 3,
      pricePerNight: 100,
      taxes: 30,
      totalPrice: 330,
      room: { _id: mockArgs.roomNumber, pricePerNight: 100 },
      hotel: { _id: mockArgs.hotelName, name: 'Test Hotel' },
      user: mockArgs.userId,
    });
  });
});
