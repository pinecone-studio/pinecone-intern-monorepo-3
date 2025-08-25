import { unfollowUser } from"../../../src/resolvers/mutations/followers"
import { UserModel } from "../../../src/models"
import * as followersModule from "../../../src/resolvers/mutations/followers"

jest.mock("../../../src/models", () => ({
  UserModel: {
    findByIdAndUpdate: jest.fn(),
    findById: jest.fn(),
  },
}));

describe("unfollowUser", () => {
  const currentUserId = "currentUserId";
  const targetUserId = "targetUserId";
  const context = { user: { id: currentUserId } };

  beforeEach(() => {
    jest.spyOn(followersModule, "checkAuthentication").mockImplementation((ctx) => {
      if (!ctx.user || !ctx.user.id) throw new Error("Authentication required");
      return ctx.user.id;
    });

    (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

    (UserModel.findById as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue({
        _id: targetUserId,
        username: "targetUser",
        email: "target@test.com",
        isPrivate: false,
        followers: [],
        following: [],
        followRequests: [],
      }),
    });

    jest.spyOn(followersModule, "convertPopulatedUser").mockImplementation((user) => ({
      ...user,
      id: user._id.toString(),
      followers: [],
      following: [],
      followRequests: [],
    }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it("should unfollow a user successfully", async () => {
    const response = await unfollowUser(null, { userId: targetUserId }, context);

    expect(followersModule.checkAuthentication).toHaveBeenCalledWith(context);
    expect(UserModel.findByIdAndUpdate).toHaveBeenCalledTimes(2);
    expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(currentUserId, { $pull: { following: targetUserId } });
    expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(targetUserId, { $pull: { followers: currentUserId } });
    expect(UserModel.findById).toHaveBeenCalledWith(targetUserId);
    expect(response.message).toBe("User unfollowed successfully");
    expect(response.user?.id).toBe(targetUserId);
  });

  it("should throw error if user tries to unfollow self", async () => {
    await expect(
      unfollowUser(null, { userId: currentUserId }, context)
    ).rejects.toThrow("You cannot unfollow yourself");
  });

  it("should throw error if not authenticated", async () => {
    await expect(
      unfollowUser(null, { userId: targetUserId }, { user: undefined })
    ).rejects.toThrow("Authentication required");
  });

  it("should throw error if target user not found", async () => {
    (UserModel.findById as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(null),
    });

    await expect(unfollowUser(null, { userId: targetUserId }, context)).rejects.toThrow("Target user not found");
  });
});
