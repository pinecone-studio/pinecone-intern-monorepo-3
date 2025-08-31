import { UserModel } from '../../models/user-model';

export const getUserData = async () => {
  const userData = await UserModel.find().populate('bookingRoom');
  console.log('User Data:', userData);

  if (!userData) {
    throw new Error('Guest not found');
  }

  return userData;
};
