import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { 
  Post, 
  createPost, 
  findPostById, 
  findPostsByOwner,
  findPostsByStatus,
  findApprovedPosts,
  findFeaturedPosts,
  findPendingPosts,
  updatePost,
  updatePostStatus,
  deletePost,
  searchPosts,
  getPostStats
} from '../Post';
import { User, createUser } from '../User';
import { PropertyFeature, createPropertyFeature } from '../PropertyFeature';
import { PropertyStatus, PropertyType, UserRole, Currency } from '../../types';

describe('Post Model', () => {
  let mongoServer: MongoMemoryServer;
  let testUser: any;
  let testPropertyFeature: any;
  let adminUser: any;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    // Create test user
    testUser = await createUser({
      email: 'post-owner@example.com',
      password: 'password123',
      firstName: 'Баяр',
      lastName: 'Доржийн',
      phone: '99887766',
      role: UserRole.SELLER
    });

    // Create admin user
    adminUser = await createUser({
      email: 'admin@example.com',
      password: 'password123',
      firstName: 'Admin',
      lastName: 'User',
      phone: '88776655',
      role: UserRole.ADMIN
    });

    // Create test property feature
    testPropertyFeature = await createPropertyFeature({
      images: ['https://example.com/image1.jpg'],
      type: PropertyType.APARTMENT,
      size: 85,
      totalRooms: 3,
      bedrooms: 2,
      bathrooms: 1,
      garage: false,
      location: {
        street: 'Энхтайваны өргөн чөлөө 1',
        city: 'Улаанбаатар',
        district: 'Сүхбаатар дүүрэг'
      },
      details: {
        completionDate: new Date('2020-01-01'),
        windowsCount: 6,
        windowType: 'plastic',
        floorMaterial: 'laminate',
        floorNumber: 5,
        totalFloors: 12,
        balcony: true,
        lift: true,
        heating: 'central'
      },
      condition: 'excellent' as const,
      ownership: 'freehold' as const,
      furnished: false
    }, testUser._id.toString());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await Post.deleteMany({});
  });

  describe('Post Creation', () => {
    it('should create a new post with valid data', async () => {
      const postData = {
        title: {
          en: 'Beautiful Apartment in Central UB',
          mn: 'Төвийн бүсэд байрлах сайхан орон сууц'
        },
        description: {
          en: 'A wonderful apartment with great views and modern amenities.',
          mn: 'Гайхалтай үзэмжтэй, орчин үеийн тохижилттой сайхан орон сууц.'
        },
        price: 250000000, // 250 million MNT
        currency: Currency.MNT,
        propertyFeature: testPropertyFeature._id.toString(),
        tags: ['apartment', 'central', 'modern'],
        availableFrom: new Date(),
        availableUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        contactInfo: {
          showPhone: true,
          showEmail: true,
          preferredContactTime: 'afternoon'
        }
      };

      const post = await createPost(postData, testUser._id.toString());
      
      expect(post.title.en).toBe('Beautiful Apartment in Central UB');
      expect(post.title.mn).toBe('Төвийн бүсэд байрлах сайхан орон сууц');
      expect(post.description.en).toContain('wonderful apartment');
      expect(post.description.mn).toContain('Гайхалтай үзэмжтэй');
      expect(post.price).toBe(250000000);
      expect(post.currency).toBe(Currency.MNT);
      expect(post.propertyFeature.toString()).toBe(testPropertyFeature._id.toString());
      expect(post.status).toBe(PropertyStatus.PENDING);
      expect(post.featured).toBe(false);
      expect(post.viewCount).toBe(0);
      expect(post.favoriteCount).toBe(0);
      expect(post.tags).toContain('apartment');
      expect(post.contactInfo?.showPhone).toBe(true);
      expect(post.contactInfo?.preferredContactTime).toBe('afternoon');
      expect(post.slug).toBeDefined();
      expect(post.seoMetadata?.metaTitle?.en).toBeDefined();
      expect(post.seoMetadata?.keywords).toContain('beautiful');
    });

    it('should create post with minimal required data', async () => {
      const postData = {
        title: {
          en: 'Simple House',
          mn: 'Энгийн байшин'
        },
        description: {
          en: 'A simple house for sale.',
          mn: 'Зарагдах энгийн байшин.'
        },
        price: 150000000,
        propertyFeature: testPropertyFeature._id.toString()
      };

      const post = await createPost(postData, testUser._id.toString());
      
      expect(post.title.en).toBe('Simple House');
      expect(post.price).toBe(150000000);
      expect(post.currency).toBe(Currency.MNT); // Default
      expect(post.status).toBe(PropertyStatus.PENDING);
      expect(post.contactInfo?.showPhone).toBe(true); // Default
      expect(post.contactInfo?.showEmail).toBe(true); // Default
      expect(post.contactInfo?.preferredContactTime).toBe('anytime'); // Default
    });
  });

  describe('Post Validation', () => {
    it('should require title', async () => {
      const postData = {
        description: {
          en: 'Description only',
          mn: 'Зөвхөн тайлбар'
        },
        price: 100000000,
        propertyFeature: testPropertyFeature._id.toString()
      };

      await expect(createPost(postData as any, testUser._id.toString())).rejects.toThrow('Title is required');
    });

    it('should require description', async () => {
      const postData = {
        title: {
          en: 'Title only',
          mn: 'Зөвхөн гарчиг'
        },
        price: 100000000,
        propertyFeature: testPropertyFeature._id.toString()
      };

      await expect(createPost(postData as any, testUser._id.toString())).rejects.toThrow('Description is required');
    });

    it('should require positive price', async () => {
      const postData = {
        title: {
          en: 'Test Post',
          mn: 'Тест нийтлэл'
        },
        description: {
          en: 'Test description',
          mn: 'Тест тайлбар'
        },
        price: -100000, // Negative price
        propertyFeature: testPropertyFeature._id.toString()
      };

      await expect(createPost(postData, testUser._id.toString())).rejects.toThrow('Price cannot be negative');
    });

    it('should validate title length', async () => {
      const longTitle = 'A'.repeat(201); // Over 200 characters
      const postData = {
        title: {
          en: longTitle,
          mn: longTitle
        },
        description: {
          en: 'Test description',
          mn: 'Тест тайлбар'
        },
        price: 100000000,
        propertyFeature: testPropertyFeature._id.toString()
      };

      await expect(createPost(postData, testUser._id.toString())).rejects.toThrow('Title cannot be longer than 200 characters');
    });

    it('should validate description length', async () => {
      const longDescription = 'A'.repeat(5001); // Over 5000 characters
      const postData = {
        title: {
          en: 'Test Post',
          mn: 'Тест нийтлэл'
        },
        description: {
          en: longDescription,
          mn: longDescription
        },
        price: 100000000,
        propertyFeature: testPropertyFeature._id.toString()
      };

      await expect(createPost(postData, testUser._id.toString())).rejects.toThrow('Description cannot be longer than 5000 characters');
    });

    it('should validate date logic', async () => {
      const postData = {
        title: {
          en: 'Test Post',
          mn: 'Тест нийтлэл'
        },
        description: {
          en: 'Test description',
          mn: 'Тест тайлбар'
        },
        price: 100000000,
        propertyFeature: testPropertyFeature._id.toString(),
        availableFrom: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        availableUntil: new Date() // Today (before availableFrom)
      };

      await expect(createPost(postData, testUser._id.toString())).rejects.toThrow('Available until date must be after available from date');
    });
  });

  describe('Post Methods', () => {
    let post: any;

    beforeEach(async () => {
      const postData = {
        title: {
          en: 'Test Post for Methods',
          mn: 'Методын тест нийтлэл'
        },
        description: {
          en: 'Test description for methods.',
          mn: 'Методын тест тайлбар.'
        },
        price: 200000000,
        propertyFeature: testPropertyFeature._id.toString()
      };

      post = await createPost(postData, testUser._id.toString());
    });

    it('should calculate price per square meter', async () => {
      const pricePerSqM = await post.calculatePricePerSqM();
      expect(pricePerSqM).toBe(200000000 / 85); // price / property size
    });

    it('should increment view count', async () => {
      const initialViewCount = post.viewCount;
      const initialImpressions = post.analytics.impressions;
      
      await post.incrementViewCount();
      
      expect(post.viewCount).toBe(initialViewCount + 1);
      expect(post.analytics.impressions).toBe(initialImpressions + 1);
    });

    it('should increment favorite count', async () => {
      const initialCount = post.favoriteCount;
      await post.incrementFavoriteCount();
      expect(post.favoriteCount).toBe(initialCount + 1);
    });

    it('should decrement favorite count', async () => {
      await post.incrementFavoriteCount(); // First increment to 1
      await post.decrementFavoriteCount();
      expect(post.favoriteCount).toBe(0);
      
      // Should not go below 0
      await post.decrementFavoriteCount();
      expect(post.favoriteCount).toBe(0);
    });

    it('should check if expired', () => {
      expect(post.isExpired()).toBe(false);
      
      post.expiresAt = new Date(Date.now() - 24 * 60 * 60 * 1000); // Yesterday
      expect(post.isExpired()).toBe(true);
    });

    it('should check if available', () => {
      // Pending post should not be available
      expect(post.isAvailable()).toBe(false);
      
      // Approved post should be available
      post.status = PropertyStatus.APPROVED;
      expect(post.isAvailable()).toBe(true);
      
      // Expired post should not be available
      post.expiresAt = new Date(Date.now() - 24 * 60 * 60 * 1000);
      expect(post.isAvailable()).toBe(false);
    });

    it('should check if can be edited by user', () => {
      expect(post.canBeEditedBy(testUser._id.toString())).toBe(true);
      expect(post.canBeEditedBy('differentuserid')).toBe(false);
      
      // Approved posts cannot be edited
      post.status = PropertyStatus.APPROVED;
      expect(post.canBeEditedBy(testUser._id.toString())).toBe(false);
    });

    it('should generate SEO metadata', () => {
      post.generateSEOMetadata();
      
      expect(post.seoMetadata.metaTitle.en).toBe(post.title.en);
      expect(post.seoMetadata.metaTitle.mn).toBe(post.title.mn);
      expect(post.seoMetadata.metaDescription.en).toContain('Test description');
      expect(post.seoMetadata.keywords).toContain('test');
    });

    it('should approve post', async () => {
      await post.approvePost(adminUser._id.toString(), 'Approved by admin');
      
      expect(post.status).toBe(PropertyStatus.APPROVED);
      expect(post.publishedAt).toBeDefined();
      expect(post.adminNotes).toHaveLength(1);
      expect(post.adminNotes[0].note).toBe('Approved by admin');
      expect(post.statusHistory).toHaveLength(2); // Initial + approved
    });

    it('should decline post', async () => {
      await post.declinePost(adminUser._id.toString(), 'Declined due to policy violation');
      
      expect(post.status).toBe(PropertyStatus.DECLINED);
      expect(post.adminNotes).toHaveLength(1);
      expect(post.adminNotes[0].note).toBe('Declined due to policy violation');
      expect(post.statusHistory).toHaveLength(2); // Initial + declined
    });

    it('should return public JSON without sensitive data', () => {
      post.adminNotes.push({
        admin: adminUser._id,
        note: 'Internal note',
        createdAt: new Date()
      });
      
      const publicData = post.toPublicJSON();
      
      expect(publicData.adminNotes).toBeUndefined();
      expect(publicData.statusHistory).toBeUndefined();
      expect(publicData.title).toBeDefined();
      expect(publicData.price).toBeDefined();
    });
  });

  describe('Virtual Properties', () => {
    let post: any;

    beforeEach(async () => {
      const postData = {
        title: {
          en: 'Virtual Test Post',
          mn: 'Виртуал тест нийтлэл'
        },
        description: {
          en: 'Virtual test description.',
          mn: 'Виртуал тест тайлбар.'
        },
        price: 300000000,
        propertyFeature: testPropertyFeature._id.toString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      };

      post = await createPost(postData, testUser._id.toString());
      
      // Simulate some analytics
      post.viewCount = 100;
      post.favoriteCount = 10;
      post.analytics.inquiries = 5;
    });

    it('should calculate age in days', () => {
      expect(post.ageInDays).toBe(0); // Just created
    });

    it('should calculate days until expiry', () => {
      expect(post.daysUntilExpiry).toBe(7);
    });

    it('should calculate engagement rate', () => {
      const expectedRate = ((10 + 5) / 100) * 100; // 15%
      expect(post.engagementRate).toBe(expectedRate);
    });
  });

  describe('Static Methods', () => {
    beforeEach(async () => {
      // Create test posts with different statuses
      const posts = [
        {
          title: { en: 'Pending Post 1', mn: 'Хүлээгдэж буй нийтлэл 1' },
          description: { en: 'Pending description', mn: 'Хүлээгдэж буй тайлбар' },
          price: 100000000,
          propertyFeature: testPropertyFeature._id.toString(),
          status: PropertyStatus.PENDING
        },
        {
          title: { en: 'Approved Post 1', mn: 'Зөвшөөрөгдсөн нийтлэл 1' },
          description: { en: 'Approved description', mn: 'Зөвшөөрөгдсөн тайлбар' },
          price: 200000000,
          propertyFeature: testPropertyFeature._id.toString(),
          status: PropertyStatus.APPROVED,
          featured: true,
          publishedAt: new Date()
        },
        {
          title: { en: 'Declined Post 1', mn: 'Татгалзсан нийтлэл 1' },
          description: { en: 'Declined description', mn: 'Татгалзсан тайлбар' },
          price: 150000000,
          propertyFeature: testPropertyFeature._id.toString(),
          status: PropertyStatus.DECLINED
        }
      ];

      for (const postData of posts) {
        const post = await createPost(postData, testUser._id.toString());
        if (postData.status !== PropertyStatus.PENDING) {
          post.status = postData.status;
          if (postData.featured) post.featured = true;
          if (postData.publishedAt) post.publishedAt = postData.publishedAt;
          await post.save();
        }
      }
    });

    it('should find posts by owner', async () => {
      const posts = await findPostsByOwner(testUser._id.toString());
      expect(posts).toHaveLength(3);
      expect(posts.every(p => p.owner.toString() === testUser._id.toString())).toBe(true);
      
      const pendingPosts = await findPostsByOwner(testUser._id.toString(), PropertyStatus.PENDING);
      expect(pendingPosts).toHaveLength(1);
      expect(pendingPosts[0].status).toBe(PropertyStatus.PENDING);
    });

    it('should find posts by status', async () => {
      const approvedPosts = await findPostsByStatus(PropertyStatus.APPROVED);
      expect(approvedPosts).toHaveLength(1);
      expect(approvedPosts[0].status).toBe(PropertyStatus.APPROVED);
      
      const pendingPosts = await findPendingPosts();
      expect(pendingPosts).toHaveLength(1);
      expect(pendingPosts[0].status).toBe(PropertyStatus.PENDING);
    });

    it('should find featured posts', async () => {
      const featuredPosts = await findFeaturedPosts();
      expect(featuredPosts).toHaveLength(1);
      expect(featuredPosts[0].featured).toBe(true);
      expect(featuredPosts[0].status).toBe(PropertyStatus.APPROVED);
    });

    it('should find recent approved posts', async () => {
      const recentPosts = await findApprovedPosts();
      expect(recentPosts.length).toBeGreaterThanOrEqual(1);
      expect(recentPosts.every(p => p.status === PropertyStatus.APPROVED)).toBe(true);
    });

    it('should search posts with filters', async () => {
      // Text search
      const textResults = await searchPosts({ searchTerm: 'Approved' });
      expect(textResults).toHaveLength(1);
      expect(textResults[0].title.en).toContain('Approved');
      
      // Price range
      const priceResults = await searchPosts({ priceMin: 150000000, priceMax: 250000000 });
      expect(priceResults.length).toBeGreaterThanOrEqual(1);
      expect(priceResults.every(p => p.price >= 150000000 && p.price <= 250000000)).toBe(true);
      
      // Featured only
      const featuredResults = await searchPosts({ featuredOnly: true });
      expect(featuredResults).toHaveLength(1);
      expect(featuredResults[0].featured).toBe(true);
    });

    it('should update post', async () => {
      const posts = await findPostsByOwner(testUser._id.toString());
      const postToUpdate = posts[0];
      
      const updateData = {
        title: {
          en: 'Updated Title',
          mn: 'Шинэчлэгдсэн гарчиг'
        },
        price: 300000000,
        featured: true
      };
      
      const updatedPost = await updatePost(postToUpdate._id.toString(), updateData);
      expect(updatedPost?.title.en).toBe('Updated Title');
      expect(updatedPost?.price).toBe(300000000);
      expect(updatedPost?.featured).toBe(true);
    });

    it('should update post status', async () => {
      const posts = await findPostsByOwner(testUser._id.toString());
      const pendingPost = posts.find(p => p.status === PropertyStatus.PENDING);
      
      const updatedPost = await updatePostStatus(
        pendingPost!._id.toString(),
        { status: PropertyStatus.APPROVED, adminNote: 'Approved by admin' },
        adminUser._id.toString()
      );
      
      expect(updatedPost?.status).toBe(PropertyStatus.APPROVED);
      expect(updatedPost?.publishedAt).toBeDefined();
    });

    it('should delete post', async () => {
      const posts = await findPostsByOwner(testUser._id.toString());
      const postToDelete = posts[0];
      
      const result = await deletePost(postToDelete._id.toString());
      expect(result).toBe(true);
      
      const deletedPost = await findPostById(postToDelete._id.toString());
      expect(deletedPost).toBeNull();
    });

    it('should get post statistics', async () => {
      const stats = await getPostStats();
      
      expect(stats.total).toBe(3);
      expect(stats.byStatus[PropertyStatus.PENDING]).toBe(1);
      expect(stats.byStatus[PropertyStatus.APPROVED]).toBe(1);
      expect(stats.byStatus[PropertyStatus.DECLINED]).toBe(1);
      expect(stats.featured).toBe(1);
      expect(stats.averagePrice).toBe(Math.round((100000000 + 200000000 + 150000000) / 3));
      expect(stats.priceRange.min).toBe(100000000);
      expect(stats.priceRange.max).toBe(200000000);
    });
  });

  describe('Pre-save Middleware', () => {
    it('should generate unique slug on save', async () => {
      const postData1 = {
        title: {
          en: 'Same Title',
          mn: 'Адилхан гарчиг'
        },
        description: {
          en: 'First description',
          mn: 'Эхний тайлбар'
        },
        price: 100000000,
        propertyFeature: testPropertyFeature._id.toString()
      };
      
      const postData2 = {
        title: {
          en: 'Same Title',
          mn: 'Адилхан гарчиг'
        },
        description: {
          en: 'Second description',
          mn: 'Хоёрдохь тайлбар'
        },
        price: 150000000,
        propertyFeature: testPropertyFeature._id.toString()
      };

      const post1 = await createPost(postData1, testUser._id.toString());
      const post2 = await createPost(postData2, testUser._id.toString());
      
      expect(post1.slug).toBeDefined();
      expect(post2.slug).toBeDefined();
      expect(post1.slug).not.toBe(post2.slug);
      expect(post2.slug).toContain('-1'); // Should have counter
    });

    it('should set published date when approved', async () => {
      const postData = {
        title: {
          en: 'Test Post',
          mn: 'Тест нийтлэл'
        },
        description: {
          en: 'Test description',
          mn: 'Тест тайлбар'
        },
        price: 100000000,
        propertyFeature: testPropertyFeature._id.toString()
      };

      const post = await createPost(postData, testUser._id.toString());
      expect(post.publishedAt).toBeUndefined();
      
      post.status = PropertyStatus.APPROVED;
      await post.save();
      
      expect(post.publishedAt).toBeDefined();
    });

    it('should add status history on status change', async () => {
      const postData = {
        title: {
          en: 'Status Test Post',
          mn: 'Төлөвийн тест нийтлэл'
        },
        description: {
          en: 'Status test description',
          mn: 'Төлөвийн тест тайлбар'
        },
        price: 100000000,
        propertyFeature: testPropertyFeature._id.toString()
      };

      const post = await createPost(postData, testUser._id.toString());
      expect(post.statusHistory).toHaveLength(1); // Initial status
      
      post.status = PropertyStatus.APPROVED;
      await post.save();
      
      expect(post.statusHistory).toHaveLength(2); // Initial + approved
      expect(post.statusHistory[1].status).toBe(PropertyStatus.APPROVED);
    });

    it('should update updatedAt on save', async () => {
      const postData = {
        title: {
          en: 'Update Test Post',
          mn: 'Шинэчлэлийн тест нийтлэл'
        },
        description: {
          en: 'Update test description',
          mn: 'Шинэчлэлийн тест тайлбар'
        },
        price: 100000000,
        propertyFeature: testPropertyFeature._id.toString()
      };

      const post = await createPost(postData, testUser._id.toString());
      const originalUpdatedAt = post.updatedAt;
      
      // Wait a moment and update
      await new Promise(resolve => setTimeout(resolve, 10));
      post.price = 120000000;
      await post.save();
      
      expect(post.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });
});
