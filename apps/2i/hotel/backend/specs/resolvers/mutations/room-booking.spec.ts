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
    email: 'test@gmail.com',
    firstName: 'baabar',
    lastName: 'baabar',
    phoneNumber: '99999999',
    cardNumber: '123456789',
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
    (HotelModel.findById as jest.Mock).mockResolvedValue({ _id: mockArgs.hotelName, hotelName: 'Test Hotel' });
    (RoomModel.findById as jest.Mock).mockResolvedValue({ _id: mockArgs.roomNumber, pricePerNight: 100 });
    (BookingModel.findOne as jest.Mock).mockResolvedValue(null);

    const saveMock = jest.fn().mockResolvedValue(undefined);

    (BookingModel as unknown as jest.Mock).mockImplementation(() => ({
      save: saveMock,
      _id: 'booking-123',
    }));

    const populateMock = jest.fn().mockReturnThis();
    const execMock = jest.fn().mockResolvedValue({
      toObject: jest.fn().mockReturnValue({
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
        email: mockArgs.email,
        firstName: mockArgs.firstName,
        lastName: mockArgs.lastName,
        phoneNumber: mockArgs.phoneNumber,
        cardNumber: mockArgs.cardNumber,
      }),
      userId: {
        _id: mockArgs.userId,
        email: 'user@test.com',
        firstName: 'User',
        lastName: 'Test',
        phoneNumber: '111222333',
      },
      hotelName: {
        _id: mockArgs.hotelName,
        hotelName: 'Test Hotel',
      },
      roomNumber: {
        _id: mockArgs.roomNumber,
        roomNumber: '101',
        roomType: 'Single',
        pricePerNight: 100,
      },
    });

    (BookingModel.findById as jest.Mock).mockReturnValue({
      populate: populateMock,
      exec: execMock,
    });

    const result = await roomBooking(null, mockArgs);

    expect(HotelModel.findById).toHaveBeenCalledWith(mockArgs.hotelName);
    expect(RoomModel.findById).toHaveBeenCalledWith(mockArgs.roomNumber);
    expect(BookingModel.findOne).toHaveBeenCalled();

    expect(saveMock).toHaveBeenCalled();

    expect(BookingModel.findById).toHaveBeenCalledWith('booking-123');
    expect(populateMock).toHaveBeenCalledWith('userId');
    expect(populateMock).toHaveBeenCalledWith('hotelName');
    expect(populateMock).toHaveBeenCalledWith('roomNumber');
    expect(execMock).toHaveBeenCalled();

    expect(result).toEqual({
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
      room: { _id: mockArgs.roomNumber, roomNumber: '101', roomType: 'Single', pricePerNight: 100 },
      hotel: { _id: mockArgs.hotelName, hotelName: 'Test Hotel' },
      user: { _id: mockArgs.userId, email: 'user@test.com', firstName: 'User', lastName: 'Test', phoneNumber: '111222333' },
      email: mockArgs.email,
      firstName: mockArgs.firstName,
      lastName: mockArgs.lastName,
      phoneNumber: mockArgs.phoneNumber,
      cardNumber: mockArgs.cardNumber,
    });
  });
});
