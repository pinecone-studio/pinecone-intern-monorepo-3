import { getUserById, checkAuthentication } from "../../../src/resolvers/mutations/followers";
import { UserModel } from "../../../src/models";

jest.mock("../../../src/models", () => ({
  UserModel: {
    findById: jest.fn(),
  },
}));

describe("checkAuthentication", () => {
  it("throws error if no user in context", () => {
    expect(() => checkAuthentication({})).toThrow("Authentication required");
  });
  it("returns user id if present", () => {
    expect(checkAuthentication({ user: { id: "123" } })).toBe("123");
  });
});

describe("getUserById", () => {
  it("throws error if user not found", async () => {
    (UserModel.findById as jest.Mock).mockResolvedValue(null);
    await expect(getUserById("abc")).rejects.toThrow("User not found");
  });
  it("returns user if found", async () => {
    const user = { _id: "abc" };
    (UserModel.findById as jest.Mock).mockResolvedValue(user);
    await expect(getUserById("abc")).resolves.toEqual(user);
  });



});
