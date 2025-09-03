import { getuser } from '../../../src/resolvers/queries/get-signup';
import { UserModel } from '../../../src/models';

jest.mock('../../../src/models', () => ({
  UserModel: {
    findById: jest.fn(),
  },
}));

describe('getuser resolver', () => {

  
  it('should return user if found', async () => {
   
    const mockUser = {
      id: '123',
      username: 'testuser',
      fullname: 'Test User',
      email: 'test@example.com',
    };

    (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);

    const result = await getuser(null, { id: '123' });

    expect(result).toEqual(mockUser);
    expect(UserModel.findById).toHaveBeenCalledWith('123');
  });

  it('should throw error if user not found', async () => {
    (UserModel.findById as jest.Mock).mockResolvedValue(null);

    await expect(getuser(null, { id: '456' })).rejects.toThrow('User not found');
    expect(UserModel.findById).toHaveBeenCalledWith('456');
  });
});
