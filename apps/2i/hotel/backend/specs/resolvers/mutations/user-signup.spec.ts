import { UserModel } from '../../../src/models/user-model';
import { userSignUp } from '../../../src/resolvers/mutations';

jest.mock('../../../src/models/user-model', () => {
  return {
    UserModel: {
      findOne: jest.fn(),
      create: jest.fn(),
    },
  };
});

jest.mock('bcrypt', () => ({
  hash: jest.fn(() => Promise.resolve('hashedMockPassword')),
}));
beforeAll(() => {
  jest.clearAllMocks();
});
describe('userSignUp', () => {
  const mockData = {
    email: 'mock@email.com',
    password: 'mockpassword',
  };
  it('should add a new user if it does not exist', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(null);
    (UserModel.create as jest.Mock).mockResolvedValue({ ...mockData, password: 'hashedMockPassword' });
    const result = await userSignUp(null, mockData);
    expect(UserModel.findOne).toHaveBeenCalledWith({ email: 'mock@email.com' });
    expect(UserModel.create).toHaveBeenCalledWith({ ...mockData, password: 'hashedMockPassword' });
    expect(result?.message).toBe('User successfully created');
  });

  it('should throw an error if user already exists', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(mockData);
    const result = await userSignUp({}, mockData);

    expect(UserModel.findOne).toHaveBeenCalledWith({ email: mockData.email });
    expect(result?.message).toBe('Something went wrong Error: User already registered please log in');
  });

  it('should throw a generic error on create failure', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(null);
    (UserModel.create as jest.Mock).mockRejectedValue(new Error('DB Error'));
    const result = await userSignUp({}, mockData);
    expect(result?.message).toBe('Something went wrong Error: DB Error');
  });
});
