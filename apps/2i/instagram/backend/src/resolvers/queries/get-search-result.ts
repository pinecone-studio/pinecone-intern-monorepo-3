import { UserModel } from '../../models';

export const getSearchResults = async (_: unknown) => {
  const allUsers = await UserModel.find();
  return allUsers;
};
