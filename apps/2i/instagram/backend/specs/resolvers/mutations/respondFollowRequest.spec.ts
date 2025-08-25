import { respondFollowRequest } from "../../../src/resolvers/mutations/followers" 
import * as followersModule from "../../../src/resolvers/mutations/followers"
import { Types } from "mongoose";
import { UserModel } from "../../../src/models";

jest.mock("../../../src/models", () => ({
  UserModel: {
    findById: jest.fn(),
  },
}));

describe("respondFollowRequest", () => {
  const currentUserId = new Types.ObjectId();
  const requestingUserId = new Types.ObjectId();
  let context: { user?: { id: string } };

  let currentUser: any;

  beforeEach(() => {
    context = { user: { id: currentUserId.toString() } };

    currentUser = {
      _id: currentUserId,
      username: "currentUser",
      email: "current@test.com",
      isPrivate: false,
      followers: [],
      following: [],
      followRequests: [requestingUserId],
      save: jest.fn().mockResolvedValue(true),
    };

    jest.spyOn(followersModule, "checkAuthentication").mockImplementation((ctx) => {
      if (!ctx.user || !ctx.user.id) throw new Error("Authentication required");
      return ctx.user.id;
    });

    jest.spyOn(followersModule, "getUserById").mockResolvedValue(currentUser);

    jest.spyOn(followersModule, "removeFollowRequest").mockImplementation((user, userId) => {
      const idx = user.followRequests.findIndex((id: Types.ObjectId) => id.toString() === userId);
      if (idx === -1) throw new Error("No follow request from this user");
      user.followRequests.splice(idx, 1);
    });

    jest.spyOn(followersModule, "acceptFollowRequest").mockResolvedValue();

    (UserModel.findById as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue({
        _id: currentUserId,
        username: currentUser.username,
        email: currentUser.email,
        isPrivate: currentUser.isPrivate,
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
  });

  it("should decline a follow request correctly", async () => {
    const response = await respondFollowRequest(
      null,
      { userId: requestingUserId.toString(), accept: false },
      context
    );

    expect(followersModule.checkAuthentication).toHaveBeenCalledWith(context);
    expect(followersModule.getUserById).toHaveBeenCalledWith(currentUserId.toString());
    expect(followersModule.removeFollowRequest).toHaveBeenCalledWith(currentUser, requestingUserId.toString());
    expect(followersModule.acceptFollowRequest).not.toHaveBeenCalled();
    expect(currentUser.save).toHaveBeenCalled();
    expect(response.message).toBe("Follow request declined");
    expect(response.user?.id).toBe(currentUserId.toString());
  });

  it("should accept a follow request correctly", async () => {
    const response = await respondFollowRequest(
      null,
      { userId: requestingUserId.toString(), accept: true },
      context
    );

    expect(followersModule.removeFollowRequest).toHaveBeenCalledWith(currentUser, requestingUserId.toString());
    expect(followersModule.acceptFollowRequest).toHaveBeenCalledWith(currentUser, requestingUserId.toString());
    expect(currentUser.save).toHaveBeenCalled();
    expect(response.message).toBe("Follow request accepted");
    expect(response.user?.id).toBe(currentUserId.toString());
  });

  it("should throw error if not authenticated", async () => {
    await expect(
      respondFollowRequest(null, { userId: requestingUserId.toString(), accept: true }, { user: undefined })
    ).rejects.toThrow("Authentication required");
  });
});
