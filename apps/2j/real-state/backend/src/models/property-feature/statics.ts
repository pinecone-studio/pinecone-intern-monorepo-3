import { IPropertyFeatureDocument, IPropertyFeatureModel, PropertySearchFilters, PropertyStats } from './interfaces';
import { CreatePropertyFeatureInput, PropertyType } from '../../types';

// Static methods for PropertyFeature model
export const propertyFeatureStatics = {
  // Find properties by owner
  async findByOwner(this: IPropertyFeatureModel, _ownerId: string): Promise<IPropertyFeatureDocument[]> {
    return this.find({ owner: _ownerId }).sort({ createdAt: -1 });
  },

  // Find properties by type
  async findByType(this: IPropertyFeatureModel, _type: PropertyType): Promise<IPropertyFeatureDocument[]> {
    return this.find({ type: _type }).sort({ createdAt: -1 });
  },

  // Find properties by location
  async findByLocation(this: IPropertyFeatureModel, _city?: string, _district?: string): Promise<IPropertyFeatureDocument[]> {
    const query: any = {};
    
    if (_city) {
      query['location.city'] = new RegExp(_city, 'i');
    }
    if (_district) {
      query['location.district'] = new RegExp(_district, 'i');
    }
    
    return this.find(query).sort({ createdAt: -1 });
  },

  // Find properties by price range
  async findByPriceRange(this: IPropertyFeatureModel, _minPrice: number, _maxPrice: number, _prices: number[]): Promise<IPropertyFeatureDocument[]> {
    // This method would typically work with Post model for actual price filtering
    // For now, return all properties as price is stored in Post model
    return this.find({}).sort({ createdAt: -1 });
  },

  // Find properties by size range
  async findBySizeRange(this: IPropertyFeatureModel, _minSize: number, _maxSize: number): Promise<IPropertyFeatureDocument[]> {
    return this.find({
      'details.size': {
        $gte: _minSize,
        $lte: _maxSize
      }
    }).sort({ createdAt: -1 });
  },

  // Search properties with filters
  async searchProperties(this: IPropertyFeatureModel, _filters: PropertySearchFilters): Promise<IPropertyFeatureDocument[]> {
    const query: any = {};

    if (_filters.type) {
      query.type = _filters.type;
    }

    if (_filters.minSize || _filters.maxSize) {
      query['details.size'] = {};
      if (_filters.minSize) query['details.size'].$gte = _filters.minSize;
      if (_filters.maxSize) query['details.size'].$lte = _filters.maxSize;
    }

    if (_filters.location) {
      if (_filters.location.city) {
        query['location.city'] = new RegExp(_filters.location.city, 'i');
      }
      if (_filters.location.district) {
        query['location.district'] = new RegExp(_filters.location.district, 'i');
      }
    }

    if (_filters.amenities && _filters.amenities.length > 0) {
      query.amenities = { $in: _filters.amenities };
    }

    if (_filters.condition) {
      query['details.condition'] = _filters.condition;
    }

    if (_filters.ownership) {
      query['details.ownership'] = _filters.ownership;
    }

    if (_filters.furnished !== undefined) {
      query['details.furnished'] = _filters.furnished;
    }

    if (_filters.petFriendly !== undefined) {
      query['petPolicy.allowed'] = _filters.petFriendly;
    }

    if (_filters.utilities && _filters.utilities.length > 0) {
      const utilityQuery = _filters.utilities.map(utility => ({
        [`utilities.${utility}`]: true
      }));
      query.$and = utilityQuery;
    }

    return this.find(query).sort({ createdAt: -1 });
  },

  // Get property statistics
  async getPropertyStats(this: IPropertyFeatureModel): Promise<PropertyStats> {
    const [totalResult, typeResults, locationResults, sizeResults] = await Promise.all([
      this.countDocuments(),
      this.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } }
      ]),
      this.aggregate([
        { $group: { _id: '$location.city', count: { $sum: 1 } } }
      ]),
      this.aggregate([
        { $group: { _id: null, avgSize: { $avg: '$details.size' }, minSize: { $min: '$details.size' }, maxSize: { $max: '$details.size' } } }
      ])
    ]);

    const byType = typeResults.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as Record<PropertyType, number>);

    const byLocation = locationResults.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as Record<string, number>);

    const sizeStats = sizeResults[0] || { avgSize: 0, minSize: 0, maxSize: 0 };

    return {
      total: totalResult,
      byType,
      byLocation,
      averageSize: sizeStats.avgSize || 0,
      sizeRange: {
        min: sizeStats.minSize || 0,
        max: sizeStats.maxSize || 0
      }
    };
  },

  // Create new property feature
  async createPropertyFeature(this: IPropertyFeatureModel, _input: CreatePropertyFeatureInput, _ownerId: string): Promise<IPropertyFeatureDocument> {
    const propertyFeature = new this({
      ..._input,
      owner: _ownerId,
      viewCount: 0,
      favoriteCount: 0,
      inquiryCount: 0
    });

    return propertyFeature.save();
  },

  // Find property by ID
  async findPropertyById(this: IPropertyFeatureModel, id: string): Promise<IPropertyFeatureDocument | null> {
    return this.findById(id);
  },

  // Update property feature
  async updatePropertyFeature(this: IPropertyFeatureModel, id: string, updateData: Partial<CreatePropertyFeatureInput>): Promise<IPropertyFeatureDocument | null> {
    return this.findByIdAndUpdate(id, updateData, { new: true });
  },

  // Delete property feature
  async deletePropertyFeature(this: IPropertyFeatureModel, id: string): Promise<boolean> {
    const result = await this.findByIdAndDelete(id);
    return !!result;
  },

  // Find featured properties
  async findFeaturedProperties(this: IPropertyFeatureModel, limit: number = 10): Promise<IPropertyFeatureDocument[]> {
    return this.find({})
      .sort({ viewCount: -1, favoriteCount: -1 })
      .limit(limit);
  },

  // Find properties by condition
  async findByCondition(this: IPropertyFeatureModel, condition: string): Promise<IPropertyFeatureDocument[]> {
    return this.find({ 'details.condition': condition }).sort({ createdAt: -1 });
  },

  // Find properties by ownership type
  async findByOwnership(this: IPropertyFeatureModel, ownership: string): Promise<IPropertyFeatureDocument[]> {
    return this.find({ 'details.ownership': ownership }).sort({ createdAt: -1 });
  }
};
