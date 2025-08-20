import { RoomModel } from '../../../src/models/room-model';
import { getRooms } from '../../../src/resolvers/queries';

jest.mock('../../../src/models/room-model', () => {
  return {
    RoomModel: {
      find: jest.fn(),
    },
  };
});

describe('getRooms', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockRooms = [
    { hotelName: 'Hotel One', roomNumber: '101' },
    { hotelName: 'Hotel Two', roomNumber: '202' },
  ];

  it('should return all room data', async () => {
    (RoomModel.find as jest.Mock).mockResolvedValue(mockRooms);
    const result = await getRooms();
    expect(RoomModel.find).toHaveBeenCalled();
    expect(result).toEqual(mockRooms);
  });
  it('should throw an error when RoomModel.find fails', async () => {
    (RoomModel.find as jest.Mock).mockRejectedValue(new Error('DB error'));

    await expect(getRooms()).rejects.toThrow('Something went wrong');
    expect(RoomModel.find).toHaveBeenCalled();
  });
});
