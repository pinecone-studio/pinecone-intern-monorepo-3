import { roomBooking } from '../../../src/resolvers/mutations/room-booking-mutation';
import { RoomModel } from '../../../src/models/room-model';
import { BookingModel } from '../../../src/models/room-booking-model';
import { HotelModel } from '../../../src/models/hotel-model';

jest.mock('../../../src/models/room-model');
jest.mock('../../../src/models/hotel-model');
jest.mock('../../../src/models/room-booking-model');

afterEach(() => {
  jest.clearAllMocks();
});

describe('roomBooking mutation', () => {
  const mockArgs = {
    userId: 'user-123',
    hotelName: 'hotel-456',
    roomNumber: 'room-789',
    checkIn: '2025-09-09',
    checkOut: '2025-09-12',
  };

  it('should create a new booking when hotel and room exist', async () => {
    (HotelModel.findById as jest.Mock).mockResolvedValue({ _id: mockArgs.hotelName });
    (RoomModel.findById as jest.Mock).mockResolvedValue({ _id: mockArgs.roomNumber, pricePerNight: 100 });
    (BookingModel.findOne as jest.Mock).mockResolvedValue(null); 

    const saveMock = jest.fn().mockResolvedValue({ _id: 'booking-123', ...mockArgs });
    (BookingModel as unknown as jest.Mock).mockImplementation(() => ({ save: saveMock }));

    const result = await roomBooking(null, mockArgs);

    expect(HotelModel.findById).toHaveBeenCalledWith(mockArgs.hotelName);
    expect(RoomModel.findById).toHaveBeenCalledWith(mockArgs.roomNumber);
    expect(BookingModel).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: mockArgs.userId,
        hotelName: mockArgs.hotelName,
        roomNumber: mockArgs.roomNumber,
        checkIn: mockArgs.checkIn,
        checkOut: mockArgs.checkOut,
      })
    );
    expect(saveMock).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  it('should throw error if room not found', async () => {
    (HotelModel.findById as jest.Mock).mockResolvedValue({ _id: mockArgs.hotelName });
    (RoomModel.findById as jest.Mock).mockResolvedValue(null);

    await expect(roomBooking(null, mockArgs)).rejects.toThrow('Room not found');
  });

  it('should throw error if hotel not found', async () => {
    (HotelModel.findById as jest.Mock).mockResolvedValue(null);

    await expect(roomBooking(null, mockArgs)).rejects.toThrow('Hotel not found');
  });

  it('should throw error if overlapping booking exists', async () => {
    (HotelModel.findById as jest.Mock).mockResolvedValue({ _id: mockArgs.hotelName });
    (RoomModel.findById as jest.Mock).mockResolvedValue({ _id: mockArgs.roomNumber, pricePerNight: 100 });
    (BookingModel.findOne as jest.Mock).mockResolvedValue({ _id: 'existing-booking' });

    await expect(roomBooking(null, mockArgs)).rejects.toThrow('This room is already booked for the selected dates.');
  });
});
