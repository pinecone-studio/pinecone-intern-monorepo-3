import { createPost, updatePostStatus, findPostsByStatus } from '../../post';
import { createUser } from '../../user';
import { createPropertyFeature } from '../../property-feature';
import { PropertyStatus } from '../../../types';
import { setupTestDB, teardownTestDB, clearTestDB } from '../setup';
import { createUserData, createPropertyFeatureData, createPostData, createAdminUser } from '../factories';

describe('Post Status Management', () => {
  let testUser: any;
  let adminUser: any;
  let testPropertyFeature: any;

  beforeAll(async () => {
    await setupTestDB();
    testUser = await createUser(createUserData());
    adminUser = await createUser(createAdminUser());
    testPropertyFeature = await createPropertyFeature(createPropertyFeatureData(), testUser._id.toString());
  });

  afterAll(teardownTestDB);
  afterEach(clearTestDB);

  it('should approve post', async () => {
    const postData = createPostData({
      propertyFeature: testPropertyFeature._id.toString()
    });

    const post = await createPost(postData, testUser._id.toString());
    expect(post.status).toBe(PropertyStatus.PENDING);

    await updatePostStatus(post._id.toString(), {
      status: PropertyStatus.APPROVED,
      note: 'Approved by admin'
    }, adminUser._id.toString());

    const updatedPost = await findPostById(post._id.toString());
    expect(updatedPost?.status).toBe(PropertyStatus.APPROVED);
    expect(updatedPost?.statusHistory).toHaveLength(2);
    expect(updatedPost?.adminNotes).toHaveLength(1);
  });

  it('should decline post', async () => {
    const postData = createPostData({
      propertyFeature: testPropertyFeature._id.toString()
    });

    const post = await createPost(postData, testUser._id.toString());
    expect(post.status).toBe(PropertyStatus.PENDING);

    await updatePostStatus(post._id.toString(), {
      status: PropertyStatus.DECLINED,
      note: 'Incomplete information'
    }, adminUser._id.toString());

    const updatedPost = await findPostById(post._id.toString());
    expect(updatedPost?.status).toBe(PropertyStatus.DECLINED);
    expect(updatedPost?.statusHistory).toHaveLength(2);
    expect(updatedPost?.adminNotes).toHaveLength(1);
  });

  it('should find posts by status', async () => {
    const postData1 = createPostData({
      propertyFeature: testPropertyFeature._id.toString()
    });
    const postData2 = createPostData({
      title: { en: 'Second Post', mn: 'Хоёр дахь зар' },
      propertyFeature: testPropertyFeature._id.toString()
    });

    const post1 = await createPost(postData1, testUser._id.toString());
    await createPost(postData2, testUser._id.toString());

    // Approve one post
    await updatePostStatus(post1._id.toString(), {
      status: PropertyStatus.APPROVED
    }, adminUser._id.toString());

    const pendingPosts = await findPostsByStatus(PropertyStatus.PENDING);
    const approvedPosts = await findPostsByStatus(PropertyStatus.APPROVED);

    expect(pendingPosts).toHaveLength(1);
    expect(approvedPosts).toHaveLength(1);
  });

  it('should track status history', async () => {
    const postData = createPostData({
      propertyFeature: testPropertyFeature._id.toString()
    });

    const post = await createPost(postData, testUser._id.toString());
    expect(post.statusHistory).toHaveLength(1);

    // Approve
    await updatePostStatus(post._id.toString(), {
      status: PropertyStatus.APPROVED,
      note: 'First approval'
    }, adminUser._id.toString());

    // Decline
    await updatePostStatus(post._id.toString(), {
      status: PropertyStatus.DECLINED,
      note: 'Found issues'
    }, adminUser._id.toString());

    const updatedPost = await findPostById(post._id.toString());
    expect(updatedPost?.statusHistory).toHaveLength(3);
    expect(updatedPost?.adminNotes).toHaveLength(2);
  });
});
