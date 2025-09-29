import { createPost, findPostById, findPostsByOwner } from '../../post';
import { createUser } from '../../user';
import { createPropertyFeature } from '../../property-feature';
import { PropertyStatus, Currency } from '../../../types';
import { setupTestDB, teardownTestDB, clearTestDB } from '../setup';
import { createUserData, createPropertyFeatureData, createPostData } from '../factories';

describe('Post Creation', () => {
  let testUser: { _id: { toString: () => string } };
  let testPropertyFeature: { _id: { toString: () => string } };

  beforeAll(async () => {
    await setupTestDB();
    testUser = await createUser(createUserData());
    testPropertyFeature = await createPropertyFeature(createPropertyFeatureData(), testUser._id.toString());
  });

  afterAll(teardownTestDB);
  afterEach(clearTestDB);

  it('should create a new post with valid data', async () => {
    const postData = createPostData({
      propertyFeature: testPropertyFeature._id.toString()
    });

    const post = await createPost(postData, testUser._id.toString());

    expect(post.title.en).toBe('Beautiful Apartment in Central Ulaanbaatar');
    expect(post.title.mn).toBe('Төв Улаанбаатарт сайхан орон сууц');
    expect(post.price).toBe(150000000);
    expect(post.currency).toBe(Currency.MNT);
    expect(post.status).toBe(PropertyStatus.PENDING);
    expect(post.featured).toBe(false);
    expect(post.owner.toString()).toBe(testUser._id.toString());
    expect(post.propertyFeature.toString()).toBe(testPropertyFeature._id.toString());
  });

  it('should create post with SEO metadata', async () => {
    const postData = createPostData({
      propertyFeature: testPropertyFeature._id.toString()
    });

    const post = await createPost(postData, testUser._id.toString());

    expect(post.seoMetadata).toBeDefined();
    expect(post.seoMetadata?.metaTitle?.en).toBe(post.title.en);
    expect(post.seoMetadata?.metaDescription?.en).toBeDefined();
  });

  it('should create post with status history', async () => {
    const postData = createPostData({
      propertyFeature: testPropertyFeature._id.toString()
    });

    const post = await createPost(postData, testUser._id.toString());

    expect(post.statusHistory).toHaveLength(1);
    expect(post.statusHistory[0].status).toBe(PropertyStatus.PENDING);
    expect(post.statusHistory[0].changedBy).toBe(testUser._id.toString());
  });

  it('should find post by ID', async () => {
    const postData = createPostData({
      propertyFeature: testPropertyFeature._id.toString()
    });

    const createdPost = await createPost(postData, testUser._id.toString());
    const foundPost = await findPostById(createdPost._id.toString());

    expect(foundPost).toBeTruthy();
    expect(foundPost?.title.en).toBe(postData.title.en);
  });

  it('should find posts by owner', async () => {
    const postData1 = createPostData({
      propertyFeature: testPropertyFeature._id.toString()
    });
    const postData2 = createPostData({
      title: { en: 'Second Post', mn: 'Хоёр дахь зар' },
      propertyFeature: testPropertyFeature._id.toString()
    });

    await createPost(postData1, testUser._id.toString());
    await createPost(postData2, testUser._id.toString());

    const userPosts = await findPostsByOwner(testUser._id.toString());
    expect(userPosts).toHaveLength(2);
  });
});
