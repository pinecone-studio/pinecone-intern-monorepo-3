import { Types } from "mongoose";
import { addFollowRequest } from "../../../src/resolvers/mutations/followers";
import { UserModel } from "../../../src/models";
import { IUser, IUserResponse, IPopulatedUser} from "../../../src/resolvers/mutations/followers"

jest.mock("../../../src/models", () => ({
  UserModel: {
    findById: jest.fn(),
  },
}));

describe("addFollowRequest", () => {
  const mockSave = jest.fn();

  const targetUser: IUser = {
    _id: new Types.ObjectId("64dbf6d3f4e8e58c11a7a65a"),
    username: "targetUser",
    email: "target@example.com",
    isPrivate: true,
    followers: [],
    following: [],
    followRequests: [],
    save: mockSave,
  };

  const currentUserId = new Types.ObjectId("64dbf6d3f4e8e58c11a7a65b");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("throws error if follow request already sent", async () => {
    targetUser.followRequests = [currentUserId];

    await expect(addFollowRequest(targetUser, currentUserId)).rejects.toThrow("Follow request already sent");
  });

  it("adds follow request and returns user response", async () => {
    targetUser.followRequests = [];

    
    mockSave.mockResolvedValue(targetUser);

   
    const populatedUser: IPopulatedUser = {
      _id: targetUser._id,
      username: targetUser.username,
      email: targetUser.email,
      isPrivate: targetUser.isPrivate,
      followers: [],
      following: [],
      followRequests: [targetUser],
    };

    (UserModel.findById as jest.Mock).mockReturnValueOnce({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(populatedUser),
    });

    const result: IUserResponse = await addFollowRequest(targetUser, currentUserId);

    expect(mockSave).toHaveBeenCalledTimes(1);
    expect(result.message).toBe("Follow request sent");
    expect(result.user?.username).toBe(targetUser.username);
    expect(result.user?.followRequests.length).toBe(1);
    expect(result.user?.followRequests[0]._id.toString()).toEqual(targetUser._id.toString());
  });

  it("throws error if populated target user not found", async () => {
    targetUser.followRequests = [];

    mockSave.mockResolvedValue(targetUser);

    (UserModel.findById as jest.Mock).mockReturnValueOnce({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(null),
    });

    await expect(addFollowRequest(targetUser, currentUserId)).rejects.toThrow("Target user not found");
  });
});
