import { roomBooking } from '../../../src/resolvers/mutations/room-booking-mutation';
import { RoomModel } from '../../../src/models/room-model';
import { BookingModel } from '../../../src/models/room-booking-model';
import { HotelModel } from '../../../src/models/hotel-model';

jest.mock('../../../src/models/room-model', () => ({
  RoomModel: {
    findById: jest.fn(),
  },
}));

jest.mock('../../../src/models/hotel-model', () => ({
  HotelModel: {
    findById: jest.fn(),
  },
}));

jest.mock('../../../src/models/room-booking-model', () => ({
  BookingModel: jest.fn(),
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('roomBooking mutation', () => {
  const mockArgs = {
    userId: '60f7fe5f1f4e5c001c9d4f5d',
    hotelName: '60f7fe5f1f4e5c001c9d4f99',
    roomNumber: '60f7fe5f1f4e5c001c9d4f77',
    checkIn: '2025-09-09',
    checkOut: '2025-09-12',
  };

  it('should create a new booking when hotel and room exist', async () => {
    (HotelModel.findById as jest.Mock).mockResolvedValue(mockArgs.hotelName);
    (RoomModel.findById as jest.Mock).mockResolvedValue(mockArgs.roomNumber);

    const saveMock = jest.fn().mockResolvedValue({
      ...mockArgs,
      userid: 'fake-booking-id',
    });

    (BookingModel as unknown as jest.Mock).mockImplementation(() => ({
      save: saveMock,
    }));

    const result = await roomBooking(null, mockArgs);

    expect(HotelModel.findById).toHaveBeenCalledWith(mockArgs.hotelName);
    expect(RoomModel.findById).toHaveBeenCalledWith(mockArgs.roomNumber);
    expect(BookingModel).toHaveBeenCalledWith({
      userId: mockArgs.userId,
      hotelName: mockArgs.hotelName,
      roomNumber: mockArgs.roomNumber,
      checkIn: mockArgs.checkIn,
      checkOut: mockArgs.checkOut,
    });
    expect(saveMock).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  it('should throw error if room not found', async () => {
    (HotelModel.findById as jest.Mock).mockResolvedValue(mockArgs.hotelName);
    (RoomModel.findById as jest.Mock).mockResolvedValue(null);

    await expect(roomBooking(null, mockArgs)).rejects.toThrow('Room not found');
  });

  it('should throw error if hotel not found', async () => {
    (HotelModel.findById as jest.Mock).mockResolvedValue(null);
    (RoomModel.findById as jest.Mock).mockRejectedValue(null);

    await expect(roomBooking(null, mockArgs)).rejects.toThrow('Hotel not found');
  });
});
