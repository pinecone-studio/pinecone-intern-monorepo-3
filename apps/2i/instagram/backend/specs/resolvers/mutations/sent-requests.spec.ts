import { sendFollowRequest } from '../../../src/resolvers/mutations/followers';
import * as followersModule from '../../../src/resolvers/mutations/followers';
import * as addfollowerModule from '../../../src/resolvers/mutations/add-followers';
import * as notificationModule from '../../../src/utils/create-notification';
describe('sendFollowRequest', () => {
  const currentUserId = 'currentUserId';
  const targetUserId = 'targetUserId';
  const currentUserName = 'john dow';
  const context = { user: { id: currentUserId } };

  beforeEach(() => {
    jest.spyOn(followersModule, 'checkAuthentication').mockReturnValue(currentUserId);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('should throw error when user tries to follow themselves', async () => {
    await expect(sendFollowRequest(null, { userId: currentUserId }, context)).rejects.toThrow('You cannot follow yourself');
  });

  it('should call addFollowRequest when target user is private', async () => {
    const targetUser = { _id: targetUserId, isPrivate: true } as any;
    const currentUser = { _id: currentUserId, username: currentUserName } as any;
    const addFollowRequestMock = jest.spyOn(followersModule, 'addFollowRequest').mockResolvedValue({
      message: 'Follow request sent',
      user: undefined,
      token: '',
    });
    const createNotificationMock = jest.spyOn(notificationModule, 'createNotification').mockResolvedValue({
      _id: 'notif123',
      userId: targetUser._id,
      fromUserId: currentUser._id,
      message: `john dow sent you a follow request`,
      type: 'FOLLOW',
    });

    const getUserByIdMock = jest
      .spyOn(followersModule, 'getUserById')
      .mockImplementationOnce(async () => targetUser)
      .mockImplementationOnce(async () => currentUser);

    const result = await sendFollowRequest(null, { userId: targetUserId }, context);

    expect(getUserByIdMock).toHaveBeenCalledTimes(2);
    expect(addFollowRequestMock).toHaveBeenCalledWith(targetUser, currentUser._id);
    expect(createNotificationMock).toHaveBeenCalledWith(targetUser._id.toString(), currentUser._id, `john dow sent you a follow request`);
    expect(result.message).toBe('Follow request sent');
  });

  it('should call addFollower when target user is public', async () => {
    const targetUser = { _id: targetUserId, isPrivate: false } as any;
    const currentUser = { _id: currentUserId } as any;
    const addFollowerMock = jest.spyOn(addfollowerModule, 'addFollower').mockResolvedValue({
      message: 'User followed successfully',
      user: undefined,
      token: '',
    });
    const createNotificationMock = jest.spyOn(notificationModule, 'createNotification').mockResolvedValue({
      _id: 'notif123',
      userId: targetUser._id,
      fromUserId: currentUser._id,
      message: `${currentUser.username} sent you a follow request`,
      type: 'FOLLOW',
    });

    const getUserByIdMock = jest
      .spyOn(followersModule, 'getUserById')
      .mockImplementationOnce(async () => targetUser)
      .mockImplementationOnce(async () => currentUser);

    const result = await sendFollowRequest(null, { userId: targetUserId }, context);

    expect(getUserByIdMock).toHaveBeenCalledTimes(2);
    expect(addFollowerMock).toHaveBeenCalledWith(targetUser, currentUser);
    expect(createNotificationMock).toHaveBeenCalledWith(targetUser._id.toString(), currentUser._id, `${currentUser.username} sent you a follow request`);
    expect(result.message).toBe('User followed successfully');
  });
});
