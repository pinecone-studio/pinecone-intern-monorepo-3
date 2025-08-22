
import { UserModel } from '../../../src/models';
import { updatePrivacy } from '../../../src/resolvers/mutations/public-private';

import { Types } from 'mongoose';

jest.mock('../../../src/models', () => ({
  UserModel: {
    findById: jest.fn(),
  },
}));

const mockSave = jest.fn();

describe('updatePrivacy resolver', () => {
  const mockUserId = new Types.ObjectId().toString();
  const context = {
    user: {
      id: mockUserId,
    },
  };

  const input = {
    input: {
      isPrivate: true,
    },
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update privacy setting successfully', async () => {
    const mockUser = {
      _id: mockUserId,
      isPrivate: false,
      save: mockSave,
    };

    (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);
    mockSave.mockResolvedValue(true);

    const result = await updatePrivacy({}, input, context);

    expect(UserModel.findById).toHaveBeenCalledWith(mockUserId);
    expect(mockSave).toHaveBeenCalled();
    expect(result.isPrivate).toBe(true);
  });

  it('should throw authentication error if user not in context', async () => {
    await expect(updatePrivacy({}, input, {})).rejects.toThrow(
      'Authentication required'
    );
  });

  it('should throw error if user not found', async () => {
    (UserModel.findById as jest.Mock).mockResolvedValue(null);

    await expect(updatePrivacy({}, input, context)).rejects.toThrow(
      'User not found'
    );
  });
});
