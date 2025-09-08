import { RoomModel } from '../../../src/models/room-model';
import { updateRoom } from '../../../src/resolvers/mutations/update-room';

jest.mock('../../../src/models/room-model', () => {
  return {
    RoomModel: {
      findByIdAndUpdate: jest.fn(),
    },
  };
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('updateRoom mutation', () => {
  const mockRoomId = '12345';
  const mockInput = { roomNumber: '202', pricePerNight: 150 };

  it('should update a room and return success message', async () => {
    (RoomModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({
      _id: mockRoomId,
      ...mockInput,
    });

    const result = await updateRoom(null, { roomId: mockRoomId, input: mockInput });

    expect(RoomModel.findByIdAndUpdate).toHaveBeenCalledWith(mockRoomId, { $set: mockInput }, { new: true });
    expect(result).toEqual({ message: 'Successfully updated' });
  });

  it('should throw an error if room is not found', async () => {
    (RoomModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

    await expect(updateRoom(null, { roomId: mockRoomId, input: mockInput })).rejects.toThrow('Room not found');
  });

  it('should propagate unexpected errors', async () => {
    (RoomModel.findByIdAndUpdate as jest.Mock).mockRejectedValue(new Error('DB error'));

    await expect(updateRoom(null, { roomId: mockRoomId, input: mockInput })).rejects.toThrow('DB error');
  });
});
