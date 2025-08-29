import { UserModel } from '../../models/user-model';

export const getUserData = async () => {
  const userData = await UserModel.find().populate('bookingRoom');

  if (!userData) {
    throw new Error('Guest not found');
  }

  return userData;
};
