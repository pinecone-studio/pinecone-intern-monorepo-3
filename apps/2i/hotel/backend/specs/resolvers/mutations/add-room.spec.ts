import { RoomModel } from '../../../src/models/room-model';
import { addRoom } from '../../../src/resolvers/mutations';
import { HotelModel } from '../../../src/models/hotel-model';

jest.mock('../../../src/models/room-model', () => {
  return {
    RoomModel: {
      findOne: jest.fn(),
      create: jest.fn(),
    },
  };
});

jest.mock('../../../src/models/hotel-model', () => ({
  HotelModel: {
    findOneAndUpdate: jest.fn(),
  },
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('addRoom mutation', () => {
  const mockRoomData = {
    hotelName: 'Test Hotel',
    roomNumber: '101',
    roomType: 'Deluxe',
    pricePerNight: 100,
    roomImgs: ['img1.jpg', 'img2.jpg'],
    roomInfos: ['info1', 'info2'],
    amenities: {
      bathroom: ['shower'],
      foodAndDrink: ['coffee'],
      technology: ['TV'],
      accessibility: ['wheelchair'],
      bedroom: ['king bed'],
      more: ['balcony'],
    },
  };

  it('should throw an error if room already exists', async () => {
    (RoomModel.findOne as jest.Mock).mockResolvedValue(mockRoomData);

    await expect(addRoom(null, mockRoomData)).rejects.toThrow('This room already added');
    expect(RoomModel.findOne).toHaveBeenCalledWith({ hotelName: 'Test Hotel', roomNumber: '101' });
  });

  it('should add a new room if it does not exist', async () => {
    (RoomModel.findOne as jest.Mock).mockResolvedValue(null);
    (RoomModel.create as jest.Mock).mockResolvedValue({ ...mockRoomData, _id: '1' });
    (HotelModel.findOneAndUpdate as jest.Mock).mockResolvedValue(true);
    const result = await addRoom(null, mockRoomData);

    expect(RoomModel.findOne).toHaveBeenCalledWith({ hotelName: 'Test Hotel', roomNumber: '101' });
    expect(RoomModel.create).toHaveBeenCalledWith(mockRoomData);
    expect(result?.message).toBe('Succesfully added room in this hotel');
  });

  it('should throw a generic error on create failure', async () => {
    (RoomModel.findOne as jest.Mock).mockResolvedValue(null);
    (RoomModel.create as jest.Mock).mockRejectedValue({});

    await expect(addRoom(null, mockRoomData)).rejects.toThrow('Something wrong happen');
  });
});
