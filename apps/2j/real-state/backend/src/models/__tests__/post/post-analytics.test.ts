import { createPost, findFeaturedPosts, findRecentPosts, getPostStats } from '../../post';
import { createUser } from '../../user';
import { createPropertyFeature } from '../../property-feature';
import { PropertyStatus } from '../../../types';
import { setupTestDB, teardownTestDB, clearTestDB } from '../setup';
import { createUserData, createPropertyFeatureData, createPostData } from '../factories';

describe('Post Analytics and Statistics', () => {
  let testUser: any;
  let testPropertyFeature: any;

  beforeAll(async () => {
    await setupTestDB();
    testUser = await createUser(createUserData());
    testPropertyFeature = await createPropertyFeature(createPropertyFeatureData(), testUser._id.toString());
  });

  afterAll(teardownTestDB);
  afterEach(clearTestDB);

  it('should increment view count', async () => {
    const postData = createPostData({
      propertyFeature: testPropertyFeature._id.toString()
    });

    const post = await createPost(postData, testUser._id.toString());
    expect(post.viewCount).toBe(0);

    await post.incrementViewCount();
    expect(post.viewCount).toBe(1);
    expect(post.analytics.impressions).toBe(1);
  });

  it('should increment favorite count', async () => {
    const postData = createPostData({
      propertyFeature: testPropertyFeature._id.toString()
    });

    const post = await createPost(postData, testUser._id.toString());
    expect(post.favoriteCount).toBe(0);

    await post.incrementFavoriteCount();
    expect(post.favoriteCount).toBe(1);

    await post.decrementFavoriteCount();
    expect(post.favoriteCount).toBe(0);
  });

  it('should check if post is expired', async () => {
    const postData = createPostData({
      propertyFeature: testPropertyFeature._id.toString(),
      expiresAt: new Date(Date.now() - 1000) // Expired
    });

    const post = await createPost(postData, testUser._id.toString());
    expect(post.isExpired()).toBe(true);

    const futurePostData = createPostData({
      propertyFeature: testPropertyFeature._id.toString(),
      expiresAt: new Date(Date.now() + 86400000) // 1 day from now
    });

    const futurePost = await createPost(futurePostData, testUser._id.toString());
    expect(futurePost.isExpired()).toBe(false);
  });

  it('should check if post is available', async () => {
    const postData = createPostData({
      propertyFeature: testPropertyFeature._id.toString(),
      status: PropertyStatus.APPROVED
    });

    const post = await createPost(postData, testUser._id.toString());
    expect(post.isAvailable()).toBe(true);

    // Test with expired post
    const expiredPostData = createPostData({
      propertyFeature: testPropertyFeature._id.toString(),
      status: PropertyStatus.APPROVED,
      expiresAt: new Date(Date.now() - 1000)
    });

    const expiredPost = await createPost(expiredPostData, testUser._id.toString());
    expect(expiredPost.isAvailable()).toBe(false);
  });

  it('should find featured posts', async () => {
    const postData1 = createPostData({
      propertyFeature: testPropertyFeature._id.toString(),
      featured: true,
      status: PropertyStatus.APPROVED
    });
    const postData2 = createPostData({
      title: { en: 'Second Post', mn: 'Хоёр дахь зар' },
      propertyFeature: testPropertyFeature._id.toString(),
      featured: false,
      status: PropertyStatus.APPROVED
    });

    await createPost(postData1, testUser._id.toString());
    await createPost(postData2, testUser._id.toString());

    const featuredPosts = await findFeaturedPosts(10);
    expect(featuredPosts).toHaveLength(1);
    expect(featuredPosts[0].featured).toBe(true);
  });

  it('should find recent posts', async () => {
    const postData1 = createPostData({
      propertyFeature: testPropertyFeature._id.toString(),
      status: PropertyStatus.APPROVED
    });
    const postData2 = createPostData({
      title: { en: 'Second Post', mn: 'Хоёр дахь зар' },
      propertyFeature: testPropertyFeature._id.toString(),
      status: PropertyStatus.APPROVED
    });

    await createPost(postData1, testUser._id.toString());
    await createPost(postData2, testUser._id.toString());

    const recentPosts = await findRecentPosts(10);
    expect(recentPosts).toHaveLength(2);
  });

  it('should get post statistics', async () => {
    const postData1 = createPostData({
      propertyFeature: testPropertyFeature._id.toString(),
      status: PropertyStatus.APPROVED,
      featured: true
    });
    const postData2 = createPostData({
      title: { en: 'Second Post', mn: 'Хоёр дахь зар' },
      propertyFeature: testPropertyFeature._id.toString(),
      status: PropertyStatus.PENDING
    });

    await createPost(postData1, testUser._id.toString());
    await createPost(postData2, testUser._id.toString());

    const stats = await getPostStats();
    expect(stats.total).toBe(2);
    expect(stats.byStatus[PropertyStatus.APPROVED]).toBe(1);
    expect(stats.byStatus[PropertyStatus.PENDING]).toBe(1);
    expect(stats.featured).toBe(1);
  });
});
