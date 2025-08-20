import { RoomModel } from '../../../src/models/room-model';
import { getRoomById } from '../../../src/resolvers/queries';

jest.mock('../../../src/models/room-model', () => {
  return {
    RoomModel: {
      findById: jest.fn(),
    },
  };
});

describe('getRoomById', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return single room by id', async () => {
    const mockRoom = { id: '001', hotelName: 'Test Hotel' };
    (RoomModel.findById as jest.Mock).mockResolvedValue(mockRoom);

    const result = await getRoomById({}, { id: '001' });

    expect(RoomModel.findById).toHaveBeenCalledWith('001');
    expect(result).toEqual(mockRoom);
  });

  it('should return null if room not found', async () => {
    (RoomModel.findById as jest.Mock).mockResolvedValue(null);

    const result = await getRoomById({}, { id: '999' });

    expect(RoomModel.findById).toHaveBeenCalledWith('999');
    expect(result).toBeNull();
  });
});
