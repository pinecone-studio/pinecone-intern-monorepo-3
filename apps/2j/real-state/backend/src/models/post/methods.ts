import { IPostDocument } from './interfaces';
import { PropertyFeature } from '../property-feature';

// Instance methods for Post document
export const postMethods = {
  // Calculate price per square meter
  async calculatePricePerSqM(this: IPostDocument): Promise<number> {
    try {
      const propertyFeature = await PropertyFeature.findById(this.propertyFeature);
      if (!propertyFeature || !propertyFeature.details.size) {
        return 0;
      }
      return this.price / propertyFeature.details.size;
    } catch (error) {
      console.error('Error calculating price per sqm:', error);
      return 0;
    }
  },

  // Increment view count
  async incrementViewCount(this: IPostDocument): Promise<void> {
    this.viewCount += 1;
    this.analytics.impressions += 1;
    await this.save();
  },

  // Increment favorite count
  async incrementFavoriteCount(this: IPostDocument): Promise<void> {
    this.favoriteCount += 1;
    await this.save();
  },

  // Decrement favorite count
  async decrementFavoriteCount(this: IPostDocument): Promise<void> {
    if (this.favoriteCount > 0) {
      this.favoriteCount -= 1;
      await this.save();
    }
  },

  // Check if post is expired
  isExpired(this: IPostDocument): boolean {
    if (!this.expiresAt) return false;
    return new Date() > this.expiresAt;
  },

  // Check if post is available
  isAvailable(this: IPostDocument): boolean {
    const now = new Date();
    return (
      this.status === 'approved' &&
      !this.isExpired() &&
      (!this.availableFrom || now >= this.availableFrom) &&
      (!this.availableUntil || now <= this.availableUntil)
    );
  },

  // Check if user can edit post
  canBeEditedBy(this: IPostDocument, _userId: string): boolean {
    return this.owner.toString() === _userId;
  },

  // Generate SEO metadata
  generateSEOMetadata(this: IPostDocument): void {
    if (!this.seoMetadata) {
      this.seoMetadata = {
        metaTitle: {
          en: this.title.en,
          mn: this.title.mn
        },
        metaDescription: {
          en: this.description.en.substring(0, 160),
          mn: this.description.mn.substring(0, 160)
        },
        keywords: this.tags || []
      };
    }
  },

  // Convert to public JSON (remove sensitive data)
  toPublicJSON(this: IPostDocument): Partial<IPostDocument> {
    const { adminNotes, ...publicData } = this.toObject();
    return publicData;
  },

  // Approve post
  async approvePost(this: IPostDocument, _adminId: string, _note?: string): Promise<void> {
    this.status = 'approved';
    this.publishedAt = new Date();
    
    this.statusHistory.push({
      status: 'approved',
      changedBy: _adminId,
      changedAt: new Date(),
      note: _note
    });

    if (_note) {
      this.adminNotes.push({
        admin: _adminId,
        note: _note,
        createdAt: new Date()
      });
    }

    await this.save();
  },

  // Decline post
  async declinePost(this: IPostDocument, _adminId: string, _note?: string): Promise<void> {
    this.status = 'declined';
    
    this.statusHistory.push({
      status: 'declined',
      changedBy: _adminId,
      changedAt: new Date(),
      note: _note
    });

    if (_note) {
      this.adminNotes.push({
        admin: _adminId,
        note: _note,
        createdAt: new Date()
      });
    }

    await this.save();
  }
};
