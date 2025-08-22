import { getAvailableRooms } from '../../../src/resolvers/queries/get-room-calendar';
import { BookingModel } from '../../../src/models/room-booking-model';
import { RoomModel } from '../../../src/models/room-model';

jest.mock('../../../src/models/room-booking-model');
jest.mock('../../../src/models/room-model');

describe('getAvailableRooms', () => {
  const mockHotelId = 'hotel123';
  const mockCheckIn = new Date('2025-09-05');
  const mockCheckOut = new Date('2025-09-10');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return available rooms excluding booked rooms', async () => {
    (BookingModel.find as jest.Mock).mockReturnValue({
      distinct: jest.fn().mockResolvedValue(['room1', 'room2']),
    });

    const availableRoomsMock = [
      { _id: 'room3', roomNumber: '103', hotelName: mockHotelId },
      { _id: 'room4', roomNumber: '104', hotelName: mockHotelId },
    ];
    (RoomModel.find as jest.Mock).mockResolvedValue(availableRoomsMock);

    const result = await getAvailableRooms(
      {},
      {
        hotelId: mockHotelId,
        checkIn: mockCheckIn,
        checkOut: mockCheckOut,
      }
    );

    expect(BookingModel.find).toHaveBeenCalledWith({
      hotelName: mockHotelId,
      checkIn: { $lt: mockCheckOut },
      checkOut: { $gt: mockCheckIn },
    });

    const distinctMock = (BookingModel.find as jest.Mock).mock.results[0].value.distinct;
    expect(distinctMock).toHaveBeenCalledWith('roomNumber');

    // Check RoomModel.find called with correct filter
    expect(RoomModel.find).toHaveBeenCalledWith({
      hotelName: mockHotelId,
      _id: { $nin: ['room1', 'room2'] },
    });

    // Result should be the mocked available rooms
    expect(result).toEqual(availableRoomsMock);
  });

  it('should throw an error if database query fails', async () => {
    (BookingModel.find as jest.Mock).mockImplementation(() => {
      throw new Error('DB error');
    });

    await expect(
      getAvailableRooms(
        {},
        {
          hotelId: mockHotelId,
          checkIn: mockCheckIn,
          checkOut: mockCheckOut,
        }
      )
    ).rejects.toThrow('DB error');
  });

  it('should throw an error if no rooms are available', async () => {
    (BookingModel.find as jest.Mock).mockReturnValue({
      distinct: jest.fn().mockResolvedValue(['room1']),
    });

    (RoomModel.find as jest.Mock).mockResolvedValue([]);

    await expect(
      getAvailableRooms(
        {},
        {
          hotelId: mockHotelId,
          checkIn: mockCheckIn,
          checkOut: mockCheckOut,
        }
      )
    ).rejects.toThrow('No rooms available for the selected dates');
  });
});
