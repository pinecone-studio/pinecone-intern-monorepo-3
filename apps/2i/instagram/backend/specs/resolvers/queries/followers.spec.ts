import { followers } from '../../../src/resolvers/queries/get-followers';
import { UserModel } from '../../../src/models';

jest.mock('../../../src/models');

describe('followers resolver', () => {
  const mockFindById = UserModel.findById as jest.Mock;
  const mockFind = UserModel.find as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return follower users', async () => {
   
    const mockUser = {
      _id: 'user1',
      followers: ['follower1', 'follower2'],
    };


    mockFindById.mockResolvedValue(mockUser);

   
    const mockFollowerUsers = [
      { _id: 'follower1', name: 'Alice' },
      { _id: 'follower2', name: 'Bob' },
    ];
    mockFind.mockResolvedValue(mockFollowerUsers);

    const result = await followers(null, { id: 'user1' });

    expect(mockFindById).toHaveBeenCalledWith('user1');
    expect(mockFind).toHaveBeenCalledWith({ _id: { $in: mockUser.followers } });
    expect(result).toEqual(mockFollowerUsers);
  });

  it('should throw error if user not found', async () => {
    mockFindById.mockResolvedValue(null);

    await expect(followers(null, { id: 'user999' })).rejects.toThrow('User not found');
    expect(mockFindById).toHaveBeenCalledWith('user999');
  });
});
