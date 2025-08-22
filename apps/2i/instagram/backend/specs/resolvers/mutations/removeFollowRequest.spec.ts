import { removeFollowRequest } from "../../../src/resolvers/mutations/followers";
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

describe("removeFollowRequest", () => {
  const mockUserId = new Types.ObjectId();
  const anotherUserId = new Types.ObjectId();

  let user: IUser;

  beforeEach(() => {
    user = {
      _id: new Types.ObjectId(),
      username: "testuser",
      email: "test@example.com",
      isPrivate: false,
      followers: [],
      following: [],
      followRequests: [mockUserId],
      save: async () => user,
    };
  });

  it("should remove the follow request when it exists", () => {
    expect(user.followRequests).toContain(mockUserId);

    removeFollowRequest(user, mockUserId.toString());

    expect(user.followRequests).not.toContain(mockUserId);
  });

  it("should throw an error if the follow request does not exist", () => {
    expect(() => {
      removeFollowRequest(user, anotherUserId.toString());
    }).toThrow("No follow request from this user");
  });
});
