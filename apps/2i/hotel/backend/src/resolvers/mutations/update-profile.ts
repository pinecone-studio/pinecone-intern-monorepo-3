import { UserModel } from '../../models/user-model';

type ProfileType = {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  phoneNumber: string;
  emergencyNumber: { phoneNumber: string; relation: string };
};

export const updateProfile = async (_: unknown, args: ProfileType) => {
  try {
    const userExisting = await UserModel.findById(args.id);
    if (!userExisting) {
      throw new Error("User doesn't exist");
    }

    await UserModel.findByIdAndUpdate(
      { _id: args.id },
      {
        firstName: args.firstName,
        lastName: args.lastName,
        birthDate: args.birthDate,
        phoneNumber: args.phoneNumber,
        emergencyPhone: { phoneNumber: args.emergencyNumber.phoneNumber, relation: args.emergencyNumber.relation },
      },
      { new: true }
    );

    return { message: 'Profile sucessfully updated' };
  } catch (err) {
    throw new Error(`Server error ${err}`);
  }
};
