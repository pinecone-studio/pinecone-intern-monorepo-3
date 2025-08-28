import { UserModel } from '../../../src/models/user-model';
import { updateProfile } from '../../../src/resolvers/mutations/update-profile';

jest.mock('../../../src/models/user-model', () => {
  return {
    UserModel: {
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
    },
  };
});
afterEach(() => {
  jest.clearAllMocks();
});

describe('updateProfile', () => {
  const mockProfileData = {
    id: '001',
    firstName: 'firstname',
    lastName: 'lastname',
    birthDate: '1990-11-11',
    phoneNumber: '99119911',
    emergencyNumber: {
      phoneNumber: '88118811',
      relation: 'uncle',
    },
  };
  it('should not update if the user does not exist', async () => {
    (UserModel.findById as jest.Mock).mockResolvedValue(null);
    await expect(updateProfile(null, mockProfileData)).rejects.toThrow("User doesn't exist");
    expect(UserModel.findById as jest.Mock).toHaveBeenCalledWith('001');
  });
  it('should update if the user exist', async () => {
    (UserModel.findById as jest.Mock).mockResolvedValue('001');
    (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockProfileData);
    const result = await updateProfile(null, mockProfileData);
    expect(UserModel.findById as jest.Mock).toHaveBeenCalledWith('001');
    expect(result?.message).toBe('Profile sucessfully updated');
  });
  it('should throw a generic error on update failure', async () => {
    (UserModel.findById as jest.Mock).mockResolvedValue('001');
    (UserModel.findByIdAndUpdate as jest.Mock).mockRejectedValue(new Error('DB error'));
    await expect(updateProfile(null, mockProfileData)).rejects.toThrow('Server error Error: DB error');
  });
});
