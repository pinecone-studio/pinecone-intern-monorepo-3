import { RoomModel } from '../../../src/models/room-model';
import { updateRoom } from '../../../src/resolvers/mutations/update-room';

jest.mock('../../models/room-model', () => ({
  RoomModel: {
    findByIdAndUpdate: jest.fn(),
  },
}));

describe('updateRoom resolver', () => {
  const mockId = '12345';
  const mockInput = { roomNumber: 'Deluxe Room', pricePerNight: 100 };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update and return success message', async () => {
    // Arrange
    (RoomModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({
      _id: mockId,
      ...mockInput,
    });

    // Act
    const result = await updateRoom({}, { id: mockId, input: mockInput });

    // Assert
    expect(RoomModel.findByIdAndUpdate).toHaveBeenCalledWith(mockId, { $set: mockInput }, { new: true });
    expect(result).toEqual({ message: 'Successfully updated' });
  });

  it('should throw error if room not found', async () => {
    (RoomModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

    await expect(updateRoom({}, { id: mockId, input: mockInput })).rejects.toThrow('Room not found');
  });
});
