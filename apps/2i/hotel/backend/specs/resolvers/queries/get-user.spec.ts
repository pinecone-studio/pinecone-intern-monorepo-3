import { UserModel } from '../../../src/models/user-model';
import { getUserData } from '../../../src/resolvers/queries';

jest.mock('../../../src/models/user-model', () => ({
  UserModel: {
    find: jest.fn(),
  },
}));

describe('getUserData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return guests data when found', async () => {
    const mockPopulate = jest.fn().mockResolvedValue([{ name: 'Guest1' }, { name: 'Guest2' }]);

    (UserModel.find as jest.Mock).mockReturnValue({
      populate: mockPopulate,
    });

    const result = await getUserData();

    expect(UserModel.find).toHaveBeenCalled();
    expect(mockPopulate).toHaveBeenCalledWith('bookingRoom');
    expect(result).toEqual([{ name: 'Guest1' }, { name: 'Guest2' }]);
  });

  it('should throw error if no guests found', async () => {
    const mockPopulate = jest.fn().mockResolvedValue(null);

    (UserModel.find as jest.Mock).mockReturnValue({
      populate: mockPopulate,
    });

    await expect(getUserData()).rejects.toThrow('Guest not found');
  });
});
