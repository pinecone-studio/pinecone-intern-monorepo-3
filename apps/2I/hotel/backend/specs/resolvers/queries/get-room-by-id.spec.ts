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
    (RoomModel.findById as jest.Mock).mockResolvedValue({ id: '001' });
    // const result = await getRoomById();
  });
});
