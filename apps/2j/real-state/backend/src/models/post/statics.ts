import { IPostDocument, IPostModel, PostSearchFilters, PostStats } from './interfaces';
import { CreatePostInput, UpdatePostInput, UpdatePostStatusInput, PropertyStatus } from '../../types';

// Static methods for Post model
export const postStatics = {
  // Find posts by owner
  async findByOwner(this: IPostModel, _ownerId: string, _status?: PropertyStatus): Promise<IPostDocument[]> {
    const query: any = { owner: _ownerId };
    if (_status) {
      query.status = _status;
    }
    return this.find(query).sort({ createdAt: -1 });
  },

  // Find posts by status
  async findByStatus(this: IPostModel, _status: PropertyStatus): Promise<IPostDocument[]> {
    return this.find({ status: _status }).sort({ createdAt: -1 });
  },

  // Find featured posts
  async findFeaturedPosts(this: IPostModel, _limit: number = 10): Promise<IPostDocument[]> {
    return this.find({ 
      featured: true, 
      status: 'approved' 
    })
    .sort({ createdAt: -1 })
    .limit(_limit);
  },

  // Find recent posts
  async findRecentPosts(this: IPostModel, _limit: number = 20): Promise<IPostDocument[]> {
    return this.find({ 
      status: 'approved' 
    })
    .sort({ createdAt: -1 })
    .limit(_limit);
  },

  // Find expired posts
  async findExpiredPosts(this: IPostModel): Promise<IPostDocument[]> {
    return this.find({
      expiresAt: { $lt: new Date() }
    });
  },

  // Search posts with filters
  async searchPosts(this: IPostModel, _filters: PostSearchFilters): Promise<IPostDocument[]> {
    const query: any = { status: 'approved' };

    if (_filters.status) {
      query.status = _filters.status;
    }

    if (_filters.minPrice || _filters.maxPrice) {
      query.price = {};
      if (_filters.minPrice) query.price.$gte = _filters.minPrice;
      if (_filters.maxPrice) query.price.$lte = _filters.maxPrice;
    }

    if (_filters.location) {
      if (_filters.location.city) {
        query['propertyFeature.address.city'] = _filters.location.city;
      }
      if (_filters.location.district) {
        query['propertyFeature.address.district'] = _filters.location.district;
      }
    }

    if (_filters.featured !== undefined) {
      query.featured = _filters.featured;
    }

    if (_filters.tags && _filters.tags.length > 0) {
      query.tags = { $in: _filters.tags };
    }

    if (_filters.availableFrom) {
      query.availableFrom = { $lte: _filters.availableFrom };
    }

    if (_filters.availableUntil) {
      query.availableUntil = { $gte: _filters.availableUntil };
    }

    return this.find(query).sort({ createdAt: -1 });
  },

  // Get post statistics
  async getPostStats(this: IPostModel): Promise<PostStats> {
    const [totalResult, statusResults, featuredResult, expiredResult, priceResults] = await Promise.all([
      this.countDocuments(),
      this.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      this.countDocuments({ featured: true }),
      this.countDocuments({ expiresAt: { $lt: new Date() } }),
      this.aggregate([
        { $group: { _id: null, avgPrice: { $avg: '$price' }, minPrice: { $min: '$price' }, maxPrice: { $max: '$price' } } }
      ])
    ]);

    const byStatus = statusResults.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as Record<PropertyStatus, number>);

    const priceStats = priceResults[0] || { avgPrice: 0, minPrice: 0, maxPrice: 0 };

    return {
      total: totalResult,
      byStatus,
      featured: featuredResult,
      expired: expiredResult,
      averagePrice: priceStats.avgPrice || 0,
      priceRange: {
        min: priceStats.minPrice || 0,
        max: priceStats.maxPrice || 0
      }
    };
  },

  // Create new post
  async createPost(this: IPostModel, _input: CreatePostInput, _ownerId: string): Promise<IPostDocument> {
    const post = new this({
      ..._input,
      owner: _ownerId,
      status: 'pending',
      viewCount: 0,
      favoriteCount: 0,
      analytics: {
        impressions: 0,
        clicks: 0,
        inquiries: 0,
        shares: 0
      },
      statusHistory: [{
        status: 'pending',
        changedBy: _ownerId,
        changedAt: new Date()
      }]
    });

    post.generateSEOMetadata();
    return post.save();
  },

  // Update post
  async updatePost(this: IPostModel, _id: string, _input: UpdatePostInput): Promise<IPostDocument | null> {
    return this.findByIdAndUpdate(_id, _input, { new: true });
  },

  // Update post status
  async updatePostStatus(this: IPostModel, _id: string, _input: UpdatePostStatusInput, _adminId?: string): Promise<IPostDocument | null> {
    const post = await this.findById(_id);
    if (!post) return null;

    const { status, note } = _input;
    const changedBy = _adminId || post.owner.toString();

    post.status = status;
    post.statusHistory.push({
      status,
      changedBy,
      changedAt: new Date(),
      note
    });

    if (note && _adminId) {
      post.adminNotes.push({
        admin: _adminId,
        note,
        createdAt: new Date()
      });
    }

    return post.save();
  },

  // Delete post
  async deletePost(this: IPostModel, _id: string): Promise<boolean> {
    const result = await this.findByIdAndDelete(_id);
    return !!result;
  }
};
