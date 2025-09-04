import { RoomModel } from '../../../src/models/room-model';
import { updateRoom } from '../../../src/resolvers/mutations/update-room';

// Mock RoomModel
jest.mock('../../../src/models/room-model', () => ({
  RoomModel: {
    findByIdAndUpdate: jest.fn(),
  },
}));

describe('updateRoom resolver', () => {
  const mockId = '12345';
  const mockInput = { name: 'Deluxe Room', price: 100 };

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
    const result = await updateRoom({}, { id: mockId, input: { roomNumber: mockInput.name, pricePerNight: mockInput.price } });

    // Assert
    expect(RoomModel.findByIdAndUpdate).toHaveBeenCalledWith(mockId, { $set: mockInput }, { new: true });
    expect(result).toEqual({ message: 'Successfully updated' });
  });

  it('should throw error if room not found', async () => {
    // Arrange
    (RoomModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

    // Act & Assert
    await expect(updateRoom({}, { id: mockId, input: { roomNumber: mockInput.name, pricePerNight: mockInput.price } })).rejects.toThrow('Room not found');
  });
});
