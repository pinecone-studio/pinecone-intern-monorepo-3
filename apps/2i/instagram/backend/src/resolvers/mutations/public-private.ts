import { UserModel } from "../../models";

export const updatePrivacy = async (
  _: unknown,
{ input }: { input: { isPrivate: boolean } },
  context: any
) => {
  if (!context.user) {
    throw new Error("Authentication required");
  }

   const userId = context.user.id; 

  const user = await UserModel.findById(userId);
  if (!user) throw new Error("User not found");

  user.isPrivate = input.isPrivate;
  await user.save();

  return user;
};
