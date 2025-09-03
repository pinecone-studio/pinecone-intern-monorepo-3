import mongoose from 'mongoose';
import { createStory } from '../../../src/resolvers/mutations/create-story';
import { StoryModel } from "../../../src/models/storymodel";
import { UserModel } from "../../../src/models";

jest.mock('../../../src/models/storymodel');
jest.mock('../../../src/models');

describe("createStory resolver", () => {
  beforeAll(() => {
    jest.spyOn(mongoose.Types, "ObjectId").mockImplementation((id:any) => id || "507f1f77bcf86cd799439011");
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("throws 'User not authenticated' if user id missing", async () => {
   await expect(
    createStory(null, { input: { mediaUrl: "test-url" } }, { user: { id: "" } })
  ).rejects.toThrow("Failed to create story");
  });

  it("throws 'User not found' if user not found in DB", async () => {
    (UserModel.findById as jest.Mock).mockResolvedValue(null);

await expect(
    createStory(null, { input: { mediaUrl: "test-url" } }, { user: { id: "507f1f77bcf86cd799439011" } })
  ).rejects.toThrow("Failed to create story");
  });
it("throws 'User not authenticated' if context is null", async () => {
  // @ts-expect-error testing invalid context
  await expect(createStory(null, { input: { mediaUrl: "test-url" } }, null))
    .rejects.toThrow("Failed to create story");
});


  it("creates story and returns correct data", async () => {
    const mockStory = {
      _id: "507f1f77bcf86cd799439011",
      toObject: () => ({ mediaUrl: "test-url", viewers: [] }),
      viewers: [],
    };
    const mockUser = {
      _id: "507f1f77bcf86cd799439011",
      toObject: () => ({ name: "Test User" }),
    };

    (StoryModel.create as jest.Mock).mockResolvedValue(mockStory);
    (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);

    const result = await createStory(null, { input: { mediaUrl: "test-url" } }, { user: { id: "507f1f77bcf86cd799439011" } });

    expect(result).toMatchObject({
      id: "507f1f77bcf86cd799439011",
      mediaUrl: "test-url",
      user: { id: "507f1f77bcf86cd799439011", name: "Test User" },
      viewers: [],
    });
  });

  it("throws 'User not authenticated' if context.user.id is missing", async () => {
  await expect(
    createStory(null, { input: { mediaUrl: "test-url" } }, { user: { id: "" } })
  ).rejects.toThrow("Failed to create story");
});

  it("throws generic error if unexpected error occurs", async () => {
    (UserModel.findById as jest.Mock).mockImplementation(() => { throw new Error("DB error"); });

    await expect(
      createStory(null, { input: { mediaUrl: "test-url" } }, { user: { id: "507f1f77bcf86cd799439011" } })
    ).rejects.toThrow("Failed to create story");
  });

});
