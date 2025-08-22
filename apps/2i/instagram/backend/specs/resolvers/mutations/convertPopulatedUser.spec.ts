import { Types } from "mongoose";
import { convertPopulatedUser } from "../../../src/resolvers/mutations/followers";

describe("convertPopulatedUser", () => {
  it("should convert _id to string id for user and all nested followers, following, followRequests", () => {
    const userId = new Types.ObjectId();
    const followerId = new Types.ObjectId();
    const followingId = new Types.ObjectId();
    const requestId = new Types.ObjectId();

    const mockUser = {
      _id: userId,
      username: "testuser",
      email: "test@example.com",
      isPrivate: false,
      followers: [
        { _id: followerId, username: "follower1", email: "follower1@example.com", isPrivate: false },
      ],
      following: [
        { _id: followingId, username: "following1", email: "following1@example.com", isPrivate: false },
      ],
      followRequests: [
        { _id: requestId, username: "request1", email: "request1@example.com", isPrivate: false },
      ],
    };

    const result = convertPopulatedUser(mockUser as any);

    
    expect(result.id).toBe(userId.toString());

  
    expect(result.followers).toHaveLength(1);
    expect(result.followers[0].id).toBe(followerId.toString());
    expect(result.followers[0]._id).toBeDefined();

 
    expect(result.following).toHaveLength(1);
    expect(result.following[0].id).toBe(followingId.toString());
    expect(result.following[0]._id).toBeDefined();

   
    expect(result.followRequests).toHaveLength(1);
    expect(result.followRequests[0].id).toBe(requestId.toString());
    expect(result.followRequests[0]._id).toBeDefined();

    
    expect(result.username).toBe("testuser");
    expect(result.email).toBe("test@example.com");
    expect(result.isPrivate).toBe(false);
  });

  it("should return empty arrays if followers, following, or followRequests are undefined", () => {
    const mockUser = {
      _id: new Types.ObjectId(),
      username: "testuser2",
      email: "test2@example.com",
      isPrivate: true,
    };

    const result = convertPopulatedUser(mockUser as any);

    expect(result.followers).toEqual([]);
    expect(result.following).toEqual([]);
    expect(result.followRequests).toEqual([]);
  });
});
