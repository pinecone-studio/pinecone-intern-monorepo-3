import { IPropertyFeatureDocument } from './interfaces';

// Instance methods for PropertyFeature document
export const propertyFeatureMethods = {
  // Calculate total area
  calculateTotalArea(this: IPropertyFeatureDocument): number {
    return this.details.size;
  },

  // Calculate price per square meter
  calculatePricePerSqM(this: IPropertyFeatureDocument, _price: number): number {
    if (this.details.size <= 0) return 0;
    return _price / this.details.size;
  },

  // Check if property is in specific location
  isInLocation(this: IPropertyFeatureDocument, _city?: string, _district?: string): boolean {
    if (_city && this.location.city.toLowerCase() !== _city.toLowerCase()) {
      return false;
    }
    if (_district && this.location.district.toLowerCase() !== _district.toLowerCase()) {
      return false;
    }
    return true;
  },

  // Check if property has specific amenity
  hasAmenity(this: IPropertyFeatureDocument, _amenity: string): boolean {
    return this.amenities?.includes(_amenity.toLowerCase()) || false;
  },

  // Get all nearby facilities as flat array
  getNearbyFacilities(this: IPropertyFeatureDocument): string[] {
    if (!this.nearbyFacilities) return [];
    
    const facilities: string[] = [];
    Object.values(this.nearbyFacilities).forEach(facilityList => {
      if (Array.isArray(facilityList)) {
        facilities.push(...facilityList);
      }
    });
    
    return facilities;
  },

  // Convert to public JSON (remove sensitive data)
  toPublicJSON(this: IPropertyFeatureDocument): Partial<IPropertyFeatureDocument> {
    const { viewCount, favoriteCount, inquiryCount, ...publicData } = this.toObject();
    return publicData;
  },

  // Validate images array
  validateImages(this: IPropertyFeatureDocument): boolean {
    if (!this.images || this.images.length === 0) return false;
    
    // Basic URL validation
    const urlPattern = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i;
    return this.images.every(image => urlPattern.test(image));
  },

  // Increment view count
  async incrementViewCount(this: IPropertyFeatureDocument): Promise<void> {
    this.viewCount += 1;
    await this.save();
  },

  // Increment favorite count
  async incrementFavoriteCount(this: IPropertyFeatureDocument): Promise<void> {
    this.favoriteCount += 1;
    await this.save();
  },

  // Decrement favorite count
  async decrementFavoriteCount(this: IPropertyFeatureDocument): Promise<void> {
    if (this.favoriteCount > 0) {
      this.favoriteCount -= 1;
      await this.save();
    }
  },

  // Increment inquiry count
  async incrementInquiryCount(this: IPropertyFeatureDocument): Promise<void> {
    this.inquiryCount += 1;
    await this.save();
  },

  // Check if property is available for rent/sale
  isAvailable(this: IPropertyFeatureDocument): boolean {
    return this.details.condition !== 'poor' && this.validateImages();
  },

  // Get property summary
  getSummary(this: IPropertyFeatureDocument): string {
    const { bedrooms, bathrooms, details } = this;
    return `${bedrooms} bed, ${bathrooms} bath, ${details.size} sqm`;
  },

  // Check if property is pet friendly
  isPetFriendly(this: IPropertyFeatureDocument): boolean {
    return this.petPolicy?.allowed || false;
  },

  // Get energy efficiency rating
  getEnergyRating(this: IPropertyFeatureDocument): string {
    return this.details.energyRating || 'Not rated';
  },

  // Check if property has specific utility
  hasUtility(this: IPropertyFeatureDocument, utility: string): boolean {
    if (!this.utilities) return false;
    return this.utilities[utility as keyof typeof this.utilities] || false;
  }
};
