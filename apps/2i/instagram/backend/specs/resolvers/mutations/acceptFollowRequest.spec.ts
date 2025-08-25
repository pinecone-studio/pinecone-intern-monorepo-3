import { acceptFollowRequest } from "../../../src/resolvers/mutations/followers"; 
import * as followersModule from "../../../src/resolvers/mutations/followers"; 
import { Types } from "mongoose";

interface IUser {
  _id: Types.ObjectId;
  username: string;
  email: string;
  isPrivate: boolean;
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
  followRequests: Types.ObjectId[];
  save: () => Promise<IUser>;
}

describe("acceptFollowRequest", () => {
  const currentUserId = new Types.ObjectId();
  const requestingUserId = new Types.ObjectId();

  let currentUser: IUser;
  let requestingUser: IUser;

  beforeEach(() => {
    currentUser = {
      _id: currentUserId,
      username: "current",
      email: "current@test.com",
      isPrivate: true,
      followers: [],
      following: [],
      followRequests: [],
      save: async () => currentUser,
    };

    requestingUser = {
      _id: requestingUserId,
      username: "requesting",
      email: "requesting@test.com",
      isPrivate: false,
      followers: [],
      following: [],
      followRequests: [],
      save: jest.fn().mockResolvedValue(requestingUser),
    };


    jest.spyOn(followersModule, "getUserById").mockResolvedValue(requestingUser);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should add requestingUser._id to currentUser.followers if not already present", async () => {
    await acceptFollowRequest(currentUser, requestingUserId.toString());

    expect(currentUser.followers).toContainEqual(requestingUserId);
  });

  it("should add currentUser._id to requestingUser.following if not already present", async () => {
    await acceptFollowRequest(currentUser, requestingUserId.toString());

    expect(requestingUser.following).toContainEqual(currentUserId);
  });

  it("should not add duplicate follower or following", async () => {
    currentUser.followers.push(requestingUserId);
    requestingUser.following.push(currentUserId);

    await acceptFollowRequest(currentUser, requestingUserId.toString());

    
    const followerCount = currentUser.followers.filter(id => id.equals(requestingUserId)).length;
    const followingCount = requestingUser.following.filter(id => id.equals(currentUserId)).length;

    expect(followerCount).toBe(1);
    expect(followingCount).toBe(1);
  });

  it("should call save on requestingUser", async () => {
    await acceptFollowRequest(currentUser, requestingUserId.toString());

    expect(requestingUser.save).toHaveBeenCalled();
  });
});
