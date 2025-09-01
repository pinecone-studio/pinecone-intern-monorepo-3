import { roomBooking } from '../../../src/resolvers/mutations/room-booking-mutation';
import { BookingModel } from '../../../src/models/room-booking-model';
import { RoomModel } from '../../../src/models/room-model';
import { HotelModel } from '../../../src/models/hotel-model';
import { UserModel } from '../../../src/models/user-model';

jest.mock('../../../src/models/user-model');
jest.mock('../../../src/models/hotel-model');
jest.mock('../../../src/models/room-model');
jest.mock('../../../src/models/room-booking-model', () => {
  const mockSave = jest.fn();
  const mockFindOne = jest.fn();
  const mockFindById = jest.fn();

  return {
    BookingModel: Object.assign(
      jest.fn(() => ({
        save: mockSave,
      })),
      {
        findOne: mockFindOne,
        findById: mockFindById,
      }
    ),
  };
});

describe('roomBooking mutation', () => {
  const mockArgs = {
    userId: 'user123',
    hotelName: 'Sample Hotel',
    roomNumber: '101',
    checkIn: '2025-09-01',
    checkOut: '2025-09-03',
  };

  const mockUser = { _id: 'user123' };
  const mockHotel = { _id: 'hotel123', hotelName: 'Sample Hotel' };
  const mockRoom = { _id: 'room123', roomNumber: '101', pricePerNight: 100 };
  const mockFinalBooking = {
    _id: 'booking123',
    userId: mockUser,
    hotelName: mockHotel,
    roomNumber: mockRoom,
  };

  const mockSave = BookingModel.prototype.save as jest.Mock;
  const mockFindOne = BookingModel.findOne as jest.Mock;
  const mockFindById = BookingModel.findById as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);
    (HotelModel.findOne as jest.Mock).mockResolvedValue(mockHotel);
    (RoomModel.findOne as jest.Mock).mockResolvedValue(mockRoom);

    mockFindOne.mockResolvedValue(null);

    const thirdPopulate = jest.fn().mockResolvedValue(mockFinalBooking);
    const secondPopulate = jest.fn().mockReturnValue({ populate: thirdPopulate });
    const firstPopulate = jest.fn().mockReturnValue({ populate: secondPopulate });

    mockFindById.mockReturnValue({ populate: firstPopulate });
  });

  it('should successfully create a booking', async () => {
    const result = await roomBooking(null, mockArgs);

    expect(UserModel.findById).toHaveBeenCalledWith('user123');
    expect(HotelModel.findOne).toHaveBeenCalledWith({ hotelName: 'Sample Hotel' });
    expect(RoomModel.findOne).toHaveBeenCalledWith({ roomNumber: '101' });

    expect(result).toEqual(mockFinalBooking);
  });

  it('should throw an error if there is an overlapping booking', async () => {
    mockFindOne.mockResolvedValue({ _id: 'existingBookingId' });

    await expect(roomBooking(null, mockArgs)).rejects.toThrow('This room is already booked for the selected dates.');

    expect(BookingModel.findOne).toHaveBeenCalledWith({
      roomNumber: mockRoom._id,
      checkIn: { $lt: new Date(mockArgs.checkOut) },
      checkOut: { $gt: new Date(mockArgs.checkIn) },
    });

    // expect(mockSave).not.toHaveBeenCalled();
  });

  it('should throw an error if user is not found', async () => {
    (UserModel.findById as jest.Mock).mockResolvedValue(null);

    await expect(roomBooking(null, mockArgs)).rejects.toThrow('User not found');

    expect(HotelModel.findOne).not.toHaveBeenCalled();
    expect(RoomModel.findOne).not.toHaveBeenCalled();
  });

  it('should throw an error if hotel is not found', async () => {
    (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);
    (HotelModel.findOne as jest.Mock).mockResolvedValue(null);

    await expect(roomBooking(null, mockArgs)).rejects.toThrow('Hotel not found');

    expect(RoomModel.findOne).not.toHaveBeenCalled();
  });

  it('should throw an error if room is not found', async () => {
    (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);
    (HotelModel.findOne as jest.Mock).mockResolvedValue(mockHotel);
    (RoomModel.findOne as jest.Mock).mockResolvedValue(null);

    await expect(roomBooking(null, mockArgs)).rejects.toThrow('Room not found');
  });
});
