import { Types } from 'mongoose';
import { addFollower } from '../../../src/resolvers/mutations/add-followers';
import { UserModel } from '../../../src/models';
import { IUser, IUserResponse, IPopulatedUser } from '../../../src/resolvers/mutations/followers';

jest.mock('../../../src/models', () => ({
  UserModel: {
    findById: jest.fn(),
  },
}));

describe('addFollower', () => {
  const mockTargetUserSave = jest.fn();
  const mockCurrentUserSave = jest.fn();

  const targetUser: IUser = {
    _id: new Types.ObjectId('64dbf6d3f4e8e58c11a7a65a'),
    username: 'targetUser',
    email: 'target@example.com',
    isPrivate: false,
    followers: [],
    following: [],
    followRequests: [],
    save: mockTargetUserSave,
  };

  const currentUser: IUser = {
    _id: new Types.ObjectId('64dbf6d3f4e8e58c11a7a65b'),
    username: 'currentUser',
    email: 'current@example.com',
    isPrivate: false,
    followers: [],
    following: [],
    followRequests: [],
    save: mockCurrentUserSave,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    targetUser.followers = [];
    currentUser.following = [];
  });

  it("adds current user to target's followers and target to current's following", async () => {
    mockTargetUserSave.mockResolvedValue(targetUser);
    mockCurrentUserSave.mockResolvedValue(currentUser);

    const populatedUser: IPopulatedUser = {
      _id: targetUser._id,
      username: targetUser.username,
      email: targetUser.email,
      isPrivate: targetUser.isPrivate,
      followers: [currentUser],
      following: [],
      followRequests: [],
    };

    (UserModel.findById as jest.Mock).mockReturnValueOnce({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(populatedUser),
    });

    const response: IUserResponse = await addFollower(targetUser, currentUser);

    expect(mockTargetUserSave).toHaveBeenCalledTimes(1);
    expect(mockCurrentUserSave).toHaveBeenCalledTimes(1);

    expect(targetUser.followers).toContainEqual(currentUser._id);
    expect(currentUser.following).toContainEqual(targetUser._id);

    expect(response.message).toBe('User followed successfully');
    expect(response.user?.username).toBe(targetUser.username);
    expect(response.user?.followers.length).toBe(1);
    expect(response.user?.followers[0]._id.toString()).toEqual(currentUser._id.toString());
  });

  it('does not duplicate followers or following if already present', async () => {
    targetUser.followers = [currentUser._id];
    currentUser.following = [targetUser._id];

    mockTargetUserSave.mockResolvedValue(targetUser);
    mockCurrentUserSave.mockResolvedValue(currentUser);

    const populatedUser: IPopulatedUser = {
      _id: targetUser._id,
      username: targetUser.username,
      email: targetUser.email,
      isPrivate: targetUser.isPrivate,
      followers: [currentUser],
      following: [],
      followRequests: [],
    };

    (UserModel.findById as jest.Mock).mockReturnValueOnce({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(populatedUser),
    });

    const response: IUserResponse = await addFollower(targetUser, currentUser);

    expect(mockTargetUserSave).toHaveBeenCalledTimes(1);
    expect(mockCurrentUserSave).toHaveBeenCalledTimes(1);

    expect(targetUser.followers.length).toBe(1);
    expect(currentUser.following.length).toBe(1);

    expect(response.message).toBe('User followed successfully');
  });

  it('throws error if populated target user is not found', async () => {
    mockTargetUserSave.mockResolvedValue(targetUser);
    mockCurrentUserSave.mockResolvedValue(currentUser);

    (UserModel.findById as jest.Mock).mockReturnValueOnce({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(null),
    });

    await expect(addFollower(targetUser, currentUser)).rejects.toThrow('Target user not found');
  });
});
