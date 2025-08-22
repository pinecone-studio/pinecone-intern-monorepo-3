import { Types } from "mongoose";
import { sendFollowRequest, respondFollowRequest, unfollowUser } from "../../../src/resolvers/mutations/followers";
import { UserModel } from "../../../src/models";
jest.mock("../../../src/models");

describe("Followers Mutations", () => {
  const currentUserId = new Types.ObjectId().toString();
  const otherUserId = new Types.ObjectId().toString();

  let mockCurrentUser: any;
  let mockOtherUser: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockCurrentUser = {
      _id: new Types.ObjectId(currentUserId),
      following: [],
      followers: [],
      followRequests: [],
      save: jest.fn().mockResolvedValue(true),
    };

    mockOtherUser = {
      _id: new Types.ObjectId(otherUserId),
      followers: [],
      followRequests: [],
      following: [],
      isPrivate: false,
      save: jest.fn().mockResolvedValue(true),
    };

    (UserModel.findById as jest.Mock).mockImplementation((id: string) => {
      if (id === currentUserId) return Promise.resolve(mockCurrentUser);
      if (id === otherUserId) return Promise.resolve(mockOtherUser);
      return Promise.resolve(null);
    });
  });
  describe("sendFollowRequest", () => {
    it("should throw if user not authenticated", async () => {
      await expect(sendFollowRequest({}, { userId: otherUserId }, {} as any)).rejects.toThrow("Authentication required");
    });

    it("should throw if context.user.id is missing", async () => {
      await expect(sendFollowRequest({}, { userId: otherUserId }, { user: {} as any })).rejects.toThrow("Authentication required");
    });

    it("should throw if user tries to follow self", async () => {
      await expect(sendFollowRequest({}, { userId: currentUserId }, { user: { id: currentUserId } })).rejects.toThrow("You cannot follow yourself");
    });

    it("should throw if target user is not found", async () => {
      (UserModel.findById as jest.Mock).mockResolvedValueOnce(null);
      await expect(sendFollowRequest({}, { userId: otherUserId }, { user: { id: currentUserId } })).rejects.toThrow("User not found");
    });
   it("should throw if current user is not found", async () => {
  (UserModel.findById as jest.Mock).mockImplementation((id: string) => {
    if (id === otherUserId) return Promise.resolve(mockOtherUser);
    if (id === currentUserId) return Promise.resolve(null);
    return Promise.resolve(null);
  });
  await expect(sendFollowRequest({}, { userId: otherUserId }, { user: { id: currentUserId } })).rejects.toThrow("User not found");
});
    it("should follow directly if user is public", async () => {
      mockOtherUser.isPrivate = false;
      const result = await sendFollowRequest({}, { userId: otherUserId }, { user: { id: currentUserId } });
      expect(result.message).toBe("User followed successfully");
      expect(mockOtherUser.followers).toContainEqual(mockCurrentUser._id);
      expect(mockCurrentUser.following).toContainEqual(mockOtherUser._id);
      expect(mockOtherUser.save).toHaveBeenCalled();
      expect(mockCurrentUser.save).toHaveBeenCalled();
    });
    it("should send follow request if user is private", async () => {
      mockOtherUser.isPrivate = true;
      mockOtherUser.followRequests = [];
      const result = await sendFollowRequest({}, { userId: otherUserId }, { user: { id: currentUserId } });
      expect(result.message).toBe("Follow request sent");
      expect(mockOtherUser.followRequests).toContainEqual(mockCurrentUser._id);
      expect(mockOtherUser.save).toHaveBeenCalled();
    });
    it("should not send duplicate follow request", async () => {
      mockOtherUser.isPrivate = true;
      mockOtherUser.followRequests = [mockCurrentUser._id];
      await expect(sendFollowRequest({}, { userId: otherUserId }, { user: { id: currentUserId } })).rejects.toThrow("Follow request already sent");
    });
    it("should not duplicate followers", async () => {
      mockOtherUser.isPrivate = false;
      mockOtherUser.followers = [mockCurrentUser._id];
      mockCurrentUser.following = [mockOtherUser._id];
      const result = await sendFollowRequest({}, { userId: otherUserId }, { user: { id: currentUserId } });
      expect(result.message).toBe("User followed successfully");
      expect(mockOtherUser.followers.length).toBe(1);
      expect(mockCurrentUser.following.length).toBe(1);
    });
  });
  describe("respondFollowRequest", () => {
    it("should throw if unauthenticated", async () => {
      await expect(respondFollowRequest({}, { userId: otherUserId, accept: true }, {} as any)).rejects.toThrow("Authentication required");
    });
    it("should throw if no follow request exists", async () => {
      mockCurrentUser.followRequests = [];
      await expect(respondFollowRequest({}, { userId: otherUserId, accept: true }, { user: { id: currentUserId } })).rejects.toThrow("No follow request from this user");
    });
    it("should accept follow request and add follower", async () => {
      mockCurrentUser.followRequests = [mockOtherUser._id];
      mockCurrentUser.followers = [];
      mockOtherUser.following = [];
      const result = await respondFollowRequest({}, { userId: otherUserId, accept: true }, { user: { id: currentUserId } });
      expect(result.message).toBe("Follow request accepted");
      expect(mockCurrentUser.followers).toContainEqual(mockOtherUser._id);
      expect(mockOtherUser.following).toContainEqual(mockCurrentUser._id);
      expect(mockCurrentUser.save).toHaveBeenCalled();
      expect(mockOtherUser.save).toHaveBeenCalled();
    });
    it("should avoid duplicate on accept", async () => {
      mockCurrentUser.followRequests = [mockOtherUser._id];
      mockCurrentUser.followers = [mockOtherUser._id];
      mockOtherUser.following = [mockCurrentUser._id];
      const result = await respondFollowRequest({}, { userId: otherUserId, accept: true }, { user: { id: currentUserId } });
      expect(result.message).toBe("Follow request accepted");
      expect(mockCurrentUser.followers.length).toBe(1);
      expect(mockOtherUser.following.length).toBe(1);
    });
    it("should decline follow request", async () => {
      mockCurrentUser.followRequests = [mockOtherUser._id];
      const result = await respondFollowRequest({}, { userId: otherUserId, accept: false }, { user: { id: currentUserId } });
      expect(result.message).toBe("Follow request declined");
      expect(mockCurrentUser.followRequests).not.toContainEqual(mockOtherUser._id);
      expect(mockCurrentUser.save).toHaveBeenCalled();
    });
  });
  describe("unfollowUser", () => {
    it("should throw if unauthenticated", async () => {
      await expect(unfollowUser({}, { userId: otherUserId }, {} as any)).rejects.toThrow("Authentication required");
    });
    it("should throw if unfollowing self", async () => {
      await expect(unfollowUser({}, { userId: currentUserId }, { user: { id: currentUserId } })).rejects.toThrow("You cannot unfollow yourself");
    })
    it("should unfollow user", async () => {
      mockCurrentUser.following = [mockOtherUser._id];
      mockOtherUser.followers = [mockCurrentUser._id];
      const result = await unfollowUser({}, { userId: otherUserId }, { user: { id: currentUserId } });
      expect(result.message).toBe("User unfollowed successfully");
      expect(mockCurrentUser.following).not.toContainEqual(mockOtherUser._id);
      expect(mockOtherUser.followers).not.toContainEqual(mockCurrentUser._id);
      expect(mockCurrentUser.save).toHaveBeenCalled();
      expect(mockOtherUser.save).toHaveBeenCalled();
    });
    it("should succeed even if not following", async () => {
      mockCurrentUser.following = [];
      mockOtherUser.followers = [];
      const result = await unfollowUser({}, { userId: otherUserId }, { user: { id: currentUserId } });
      expect(result.message).toBe("User unfollowed successfully");
      expect(mockCurrentUser.save).toHaveBeenCalled();
      expect(mockOtherUser.save).toHaveBeenCalled();
    });
  });
});
