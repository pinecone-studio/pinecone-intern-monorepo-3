import { RoomModel } from '../../../src/models/room-model';
import { uploadRoomImages } from '../../../src/resolvers/mutations/upload-room-images';

jest.mock('../../../src/models/room-model', () => {
  return {
    RoomModel: {
      findById: jest.fn(),
    },
  };
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('uploadRoomImages mutation', () => {
  const mockRoomId = 'room123';
  const mockImages = ['room1.jpg', 'room2.jpg'];

  it('should upload images if room exists', async () => {
    const mockRoom = {
      _id: mockRoomId,
      roomImgs: ['old.jpg'],
      save: jest.fn().mockResolvedValue(true),
    };

    (RoomModel.findById as jest.Mock).mockResolvedValue(mockRoom);

    const result = await uploadRoomImages(null, { roomId: mockRoomId, image: mockImages });

    expect(RoomModel.findById).toHaveBeenCalledWith(mockRoomId);
    expect(mockRoom.roomImgs).toEqual(['old.jpg', ...mockImages]);
    expect(mockRoom.save).toHaveBeenCalled();
    expect(result).toEqual({ message: 'Successfully uploaded images of room' });
  });

  it('should throw an error if room not found', async () => {
    (RoomModel.findById as jest.Mock).mockResolvedValue(null);

    await expect(uploadRoomImages(null, { roomId: mockRoomId, image: mockImages })).rejects.toThrow('Room not found');

    expect(RoomModel.findById).toHaveBeenCalledWith(mockRoomId);
  });

  it('should throw a server error if something goes wrong', async () => {
    (RoomModel.findById as jest.Mock).mockRejectedValue(new Error('DB error'));

    await expect(uploadRoomImages(null, { roomId: mockRoomId, image: mockImages })).rejects.toThrow('Server error Error: DB error');
  });
});
