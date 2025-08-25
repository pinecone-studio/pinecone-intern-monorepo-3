import mongoose from 'mongoose';
import { createStory,markStorySeen  } from '../../../src/resolvers/mutations/create-story';
import { StoryModel } from '../../../src/models/storymodel';

jest.mock('../../../src/models/storymodel');

const mockUserId = new mongoose.Types.ObjectId().toString();

describe('Story resolvers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createStory', () => {
    it('should create a story with proper fields', async () => {
      const mockStoryData = {
        user: new mongoose.Types.ObjectId(mockUserId),
        mediaUrl: 'https://example.com/story.jpg',
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        viewers: [],
      };

      (StoryModel.create as jest.Mock).mockResolvedValue(mockStoryData);

      const result = await createStory(
        {} as any,
        { input: { mediaUrl: mockStoryData.mediaUrl } },
        { user: { id: mockUserId } }
      );

      expect(StoryModel.create).toHaveBeenCalledWith(expect.objectContaining({
        user: expect.any(mongoose.Types.ObjectId),
        mediaUrl: mockStoryData.mediaUrl,
      }));
      expect(result).toEqual(mockStoryData);
    });
  });

  describe('markStorySeen', () => {
    it('should add user to viewers if not already seen', async () => {
      const mockStory = {
        _id: new mongoose.Types.ObjectId(),
        viewers: [],
        save: jest.fn().mockResolvedValue(true),
      };

      (StoryModel.findById as jest.Mock).mockResolvedValue(mockStory);

      const result = await markStorySeen(
        {} as any,
        { storyId: mockStory._id.toString() },
        { user: { id: mockUserId } }
      );

      expect(mockStory.viewers.length).toBe(1);
      expect(mockStory.save).toHaveBeenCalled();
      expect(result).toBe(mockStory);
    });

    it('should not add user if already seen', async () => {
      const viewerId = new mongoose.Types.ObjectId(mockUserId);
      const mockStory = {
        _id: new mongoose.Types.ObjectId(),
        viewers: [viewerId],
        save: jest.fn(),
      };

      (StoryModel.findById as jest.Mock).mockResolvedValue(mockStory);

      const result = await markStorySeen(
        {} as any,
        { storyId: mockStory._id.toString() },
        { user: { id: mockUserId } }
      );

      expect(mockStory.viewers.length).toBe(1);
      expect(mockStory.save).not.toHaveBeenCalled();
      expect(result).toBe(mockStory);
    });

    it('should throw error if story not found', async () => {
      (StoryModel.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        markStorySeen({} as any, { storyId: 'invalid' }, { user: { id: mockUserId } })
      ).rejects.toThrow('Story not found');
    });
  });
});
