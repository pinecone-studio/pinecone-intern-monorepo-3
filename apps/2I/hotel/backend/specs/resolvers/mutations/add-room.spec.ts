import { RoomModel } from '../../../src/models/room-model';
import { addRoom } from '../../../src/resolvers/mutations';

jest.mock('../../../src/models/room-model', () => {
  return {
    RoomModel: {
      findOne: jest.fn(),
      create: jest.fn(),
    },
  };
});

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
  it('should add a new room if it does not exist', async () => {
    (RoomModel.findOne as jest.Mock).mockResolvedValue(null);
    (RoomModel.create as jest.Mock).mockResolvedValue({ ...mockRoomData, _id: '1' });
    const result = await addRoom(null, mockRoomData);

    expect(RoomModel.findOne).toHaveBeenCalledWith({ hotelName: 'Test Hotel', roomNumber: '101' });
    expect(RoomModel.create).toHaveBeenCalledWith(mockRoomData);
    expect(result.hotelName).toBe('Test Hotel');
  });

  it('should throw an error if room already exists', async () => {
    (RoomModel.findOne as jest.Mock).mockResolvedValue(mockRoomData);

    await expect(addRoom(null, mockRoomData)).rejects.toThrow('This room already added');
    expect(RoomModel.findOne).toHaveBeenCalledWith({ hotelName: 'Test Hotel', roomNumber: '101' });
  });

  it('should throw a generic error on create failure', async () => {
    (RoomModel.findOne as jest.Mock).mockResolvedValue(null);
    (RoomModel.create as jest.Mock).mockRejectedValue(new Error('DB Error'));

    await expect(addRoom(null, mockRoomData)).rejects.toThrow('Something wrong happen');
  });
});
