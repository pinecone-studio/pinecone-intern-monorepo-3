import { UserModel } from '../../../src/models';
import { getSearchResults } from '../../../src/resolvers/queries/get-search-result';

jest.mock('../../../src/models', () => ({
  UserModel: {
    find: jest.fn(),
  },
}));

describe('getSearchResults resolver', () => {
  it('should return all users', async () => {
    const mockUsers = [
      { username: 'user1', fullname: 'User One' },
      { username: 'user2', fullname: 'User Two' },
    ];

    (UserModel.find as jest.Mock).mockResolvedValue(mockUsers);

    const allUsers = await getSearchResults({});
    console.log(allUsers, 'allUsers');
    expect(allUsers).toEqual(mockUsers);
    expect(UserModel.find).toHaveBeenCalled();
  });
});
it('should return empty array if no users found', async () => {
  (UserModel.find as jest.Mock).mockResolvedValue([]);
});
