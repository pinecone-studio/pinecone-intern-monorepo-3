
import { UserModel } from "../../models";

type updateProfiles = {
    bio:string,
    gender: "male" | "female" | "Prefer not to say",
    profilePicture:string
    fullname:string,
    username:string
}

export const updateProfile = async (
  _: unknown,
  args: { update: updateProfiles },
  context: { user: { id: string } }
) => {
  const { update } = args;

  if (!update) {
    throw new Error("Missing profile input.");
  }

  const { bio, gender, profilePicture, fullname, username } = update;

  const updatedUser = await UserModel.findByIdAndUpdate(
    context.user.id,
    {
      bio,
      gender,
      profilePicture,
      fullname,
      username,
    },
    { new: true }
  );

  if (!updatedUser) throw new Error("User not found");

  return updatedUser;
};
