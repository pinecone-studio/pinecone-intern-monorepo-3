import { updatePassword } from '../../../src/resolvers/mutations/up-password';
import { UserModel } from "../../../src/models";
import bcrypt from 'bcryptjs';

jest.mock("../../../src/models");
jest.mock('bcryptjs');

describe("updatePassword", () => {
  const mockUser = {
    _id: "123",
    email: "test@example.com",
    password: "oldHashedPassword"
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error if user not found", async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(null);

    const input = {
      input: {
        email: "notfound@example.com",
        password: "newpassword123"
      }
    };

    await expect(updatePassword(undefined, input)).rejects.toThrow("User not found");
  });

  it("should update the password successfully", async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedNewPassword");
    (UserModel.findOneAndUpdate as jest.Mock).mockResolvedValue({});

    const input = {
      input: {
        email: "test@example.com",
        password: "newpassword123"
      }
    };

    const result = await updatePassword(undefined, input);

    expect(bcrypt.hash).toHaveBeenCalledWith("newpassword123", 10);
    expect(UserModel.findOneAndUpdate).toHaveBeenCalledWith(
      { email: "test@example.com" },
      { password: "hashedNewPassword" }
    );
    expect(result).toEqual({
      message: "Password updated successfully"
    });
  });
});
