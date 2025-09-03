import { updateProfile } from '../../../src/resolvers/mutations/profile-update';
import { UserModel } from '../../../src/models';

jest.mock('../../../src/models', () => ({
  UserModel: {
    findByIdAndUpdate: jest.fn(),
  },
}));

describe("updateProfile Mutation", () => {
  const input = {
    bio: "qwerty",
    gender: "female" as const,
    profilePicture: "https://example.com/images/profile.jpg",
    fullname: "diiddy",
    username: "pippy",
  };

  const mockContext = {
    user: {
      id: "123",
    },
  };

  it("should successfully update user profile", async () => {
    const mockUpdatedUser = {
      id: '123',
      ...input,
    };

    (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedUser);

    const result = await updateProfile(
      {} as any,
      { update: input },
      mockContext
    );

    expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(
      mockContext.user.id,
      input,
      { new: true }
    );

    expect(result).toEqual(mockUpdatedUser);
  });

  it("should throw error if user not found", async () => {
    (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

    

    await expect(
      updateProfile({} as any, { update: input }, mockContext)
    ).rejects.toThrow("User not found");
  });


  it("should throw error if profile input is missing", async () => {
  const context = {
    user: {
      id: "123",
    },
  };

  await expect(
    updateProfile({} as any, {} as any, context)
  ).rejects.toThrow("Missing profile input.");
});
});
