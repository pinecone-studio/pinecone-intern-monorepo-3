import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { 
  PropertyFeature, 
  createPropertyFeature, 
  findPropertyFeaturesByOwner,
  findPropertyFeaturesByType,
  findPropertyFeaturesByLocation,
  searchPropertyFeatures,
  getPropertyFeatureStats
} from '../property-feature';
import { createUser } from '../user';
import { PropertyType, UserRole } from '../../types';

describe('PropertyFeature Model', () => {
  let mongoServer: MongoMemoryServer;
  let testUser: any;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    // Create test user
    testUser = await createUser({
      email: 'property-owner@example.com',
      password: 'password123',
      firstName: 'Баяр',
      lastName: 'Доржийн',
      phone: '99887766',
      role: UserRole.SELLER
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await PropertyFeature.deleteMany({});
  });

  describe('PropertyFeature Creation', () => {
    it('should create a new property feature with valid data', async () => {
      const propertyData = {
        images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
        virtualTour: 'https://example.com/virtual-tour',
        videos: ['https://example.com/video1.mp4'],
        type: PropertyType.APARTMENT,
        size: 85,
        totalRooms: 3,
        bedrooms: 2,
        bathrooms: 1,
        livingRooms: 1,
        kitchens: 1,
        garage: true,
        garageSpaces: 1,
        location: {
          street: 'Энхтайваны өргөн чөлөө 1',
          city: 'Улаанбаатар',
          district: 'Сүхбаатар дүүрэг',
          khoroo: '1-р хороо',
          building: '10',
          apartment: '25',
          zipCode: '14240',
          coordinates: {
            latitude: 47.9184,
            longitude: 106.9177
          },
          description: {
            en: 'Near the central square',
            mn: 'Төв талбайн ойролцоо'
          }
        },
        details: {
          completionDate: new Date('2020-01-01'),
          constructionYear: 2019,
          windowsCount: 8,
          windowType: 'plastic',
          floorMaterial: 'laminate',
          floorNumber: 5,
          totalFloors: 12,
          balcony: true,
          balconyCount: 1,
          lift: true,
          liftCount: 2,
          heating: 'central',
          airConditioning: true,
          internet: true,
          parking: true,
          parkingSpaces: 1,
          security: true,
          furnished: false,
          petFriendly: true,
          garden: false,
          basement: false,
          storage: true
        },
        amenities: ['swimming_pool', 'gym', 'parking'],
        nearbyFacilities: {
          schools: ['1-р сургууль', '15-р сургууль'],
          hospitals: ['Songdo эмнэлэг'],
          shopping: ['State Department Store'],
          transport: ['Автобусны буудал'],
          parks: ['Чингисийн талбай']
        },
        energyRating: 'B',
        condition: 'excellent' as const,
        ownership: 'freehold' as const,
        furnished: false,
        petPolicy: {
          allowed: true,
          deposit: 200000,
          restrictions: ['small dogs only']
        },
        utilities: {
          electricity: true,
          water: true,
          gas: true,
          internet: true,
          cable: true
        },
        rules: {
          en: 'No smoking in the building',
          mn: 'Барилгад тамхи татахыг хориглоно'
        }
      };

      const property = await createPropertyFeature(propertyData, testUser._id.toString());
      
      expect(property.type).toBe(PropertyType.APARTMENT);
      expect(property.size).toBe(85);
      expect(property.totalRooms).toBe(3);
      expect(property.bedrooms).toBe(2);
      expect(property.bathrooms).toBe(1);
      expect(property.garage).toBe(true);
      expect(property.garageSpaces).toBe(1);
      expect(property.location.street).toBe('Энхтайваны өргөн чөлөө 1');
      expect(property.location.city).toBe('Улаанбаатар');
      expect(property.details.heating).toBe('central');
      expect(property.amenities).toContain('swimming_pool');
      expect(property.nearbyFacilities.schools).toContain('1-р сургууль');
      expect(property.energyRating).toBe('B');
      expect(property.condition).toBe('excellent');
      expect(property.petPolicy?.allowed).toBe(true);
      expect(property.utilities?.electricity).toBe(true);
      expect(property.rules?.mn).toBe('Барилгад тамхи татахыг хориглоно');
      expect(property.slug).toBeDefined();
      expect(property.viewCount).toBe(0);
      expect(property.favoriteCount).toBe(0);
    });

    it('should create property with minimal required data', async () => {
      const propertyData = {
        images: ['https://example.com/image1.jpg'],
        type: PropertyType.HOUSE,
        size: 120,
        totalRooms: 4,
        bedrooms: 3,
        bathrooms: 2,
        garage: false,
        location: {
          street: 'Some street',
          city: 'Улаанбаатар',
          district: 'Баянгол дүүрэг'
        },
        details: {
          completionDate: new Date('2021-06-01'),
          windowsCount: 12,
          windowType: 'wooden',
          floorMaterial: 'hardwood',
          floorNumber: 1,
          totalFloors: 2,
          balcony: false,
          lift: false,
          heating: 'individual'
        },
        condition: 'good' as const,
        ownership: 'freehold' as const,
        furnished: true
      };

      const property = await createPropertyFeature(propertyData, testUser._id.toString());
      
      expect(property.type).toBe(PropertyType.HOUSE);
      expect(property.size).toBe(120);
      expect(property.garage).toBe(false);
      expect(property.garageSpaces).toBeUndefined();
      expect(property.condition).toBe('good');
      expect(property.furnished).toBe(true);
    });
  });

  describe('PropertyFeature Validation', () => {
    it('should require owner', async () => {
      const propertyData = {
        images: ['https://example.com/image1.jpg'],
        type: PropertyType.APARTMENT,
        size: 85,
        totalRooms: 3,
        bedrooms: 2,
        bathrooms: 1,
        garage: false,
        location: {
          street: 'Test street',
          city: 'Test city',
          district: 'Test district'
        },
        details: {
          completionDate: new Date(),
          windowsCount: 5,
          windowType: 'plastic',
          floorMaterial: 'tile',
          floorNumber: 3,
          totalFloors: 5,
          balcony: true,
          lift: true,
          heating: 'central'
        },
        condition: 'new' as const,
        ownership: 'freehold' as const,
        furnished: false
      };

      const property = new PropertyFeature(propertyData);
      await expect(property.save()).rejects.toThrow('Owner is required');
    });

    it('should require at least one image', async () => {
      const propertyData = {
        images: [],
        type: PropertyType.APARTMENT,
        size: 85,
        totalRooms: 3,
        bedrooms: 2,
        bathrooms: 1,
        garage: false,
        location: {
          street: 'Test street',
          city: 'Test city',
          district: 'Test district'
        },
        details: {
          completionDate: new Date(),
          windowsCount: 5,
          windowType: 'plastic',
          floorMaterial: 'tile',
          floorNumber: 3,
          totalFloors: 5,
          balcony: true,
          lift: true,
          heating: 'central'
        },
        condition: 'new' as const,
        ownership: 'freehold' as const,
        furnished: false
      };

      await expect(createPropertyFeature(propertyData, testUser._id.toString())).rejects.toThrow();
    });

    it('should validate size range', async () => {
      const propertyData = {
        images: ['https://example.com/image1.jpg'],
        type: PropertyType.APARTMENT,
        size: 0, // Invalid size
        totalRooms: 3,
        bedrooms: 2,
        bathrooms: 1,
        garage: false,
        location: {
          street: 'Test street',
          city: 'Test city',
          district: 'Test district'
        },
        details: {
          completionDate: new Date(),
          windowsCount: 5,
          windowType: 'plastic',
          floorMaterial: 'tile',
          floorNumber: 3,
          totalFloors: 5,
          balcony: true,
          lift: true,
          heating: 'central'
        },
        condition: 'new' as const,
        ownership: 'freehold' as const,
        furnished: false
      };

      await expect(createPropertyFeature(propertyData, testUser._id.toString())).rejects.toThrow('Property size must be at least 1 square meter');
    });

    it('should validate room count logic', async () => {
      const propertyData = {
        images: ['https://example.com/image1.jpg'],
        type: PropertyType.APARTMENT,
        size: 85,
        totalRooms: 2, // Less than sum of individual rooms
        bedrooms: 2,
        bathrooms: 1,
        livingRooms: 1, // 2 + 1 + 1 = 4 > 2 total rooms
        garage: false,
        location: {
          street: 'Test street',
          city: 'Test city',
          district: 'Test district'
        },
        details: {
          completionDate: new Date(),
          windowsCount: 5,
          windowType: 'plastic',
          floorMaterial: 'tile',
          floorNumber: 3,
          totalFloors: 5,
          balcony: true,
          lift: true,
          heating: 'central'
        },
        condition: 'new' as const,
        ownership: 'freehold' as const,
        furnished: false
      };

      await expect(createPropertyFeature(propertyData, testUser._id.toString())).rejects.toThrow('Sum of individual rooms cannot exceed total rooms');
    });

    it('should validate garage spaces when garage exists', async () => {
      const propertyData = {
        images: ['https://example.com/image1.jpg'],
        type: PropertyType.HOUSE,
        size: 120,
        totalRooms: 4,
        bedrooms: 3,
        bathrooms: 2,
        garage: true,
        garageSpaces: 0, // Invalid when garage exists
        location: {
          street: 'Test street',
          city: 'Test city',
          district: 'Test district'
        },
        details: {
          completionDate: new Date(),
          windowsCount: 8,
          windowType: 'wooden',
          floorMaterial: 'hardwood',
          floorNumber: 1,
          totalFloors: 2,
          balcony: false,
          lift: false,
          heating: 'individual'
        },
        condition: 'new' as const,
        ownership: 'freehold' as const,
        furnished: false
      };

      await expect(createPropertyFeature(propertyData, testUser._id.toString())).rejects.toThrow('Garage spaces must be greater than 0 if garage exists');
    });

    it('should validate floor number logic', async () => {
      const propertyData = {
        images: ['https://example.com/image1.jpg'],
        type: PropertyType.APARTMENT,
        size: 85,
        totalRooms: 3,
        bedrooms: 2,
        bathrooms: 1,
        garage: false,
        location: {
          street: 'Test street',
          city: 'Test city',
          district: 'Test district'
        },
        details: {
          completionDate: new Date(),
          windowsCount: 5,
          windowType: 'plastic',
          floorMaterial: 'tile',
          floorNumber: 10,
          totalFloors: 5, // Total floors less than floor number
          balcony: true,
          lift: true,
          heating: 'central'
        },
        condition: 'new' as const,
        ownership: 'freehold' as const,
        furnished: false
      };

      await expect(createPropertyFeature(propertyData, testUser._id.toString())).rejects.toThrow('Total floors must be greater than or equal to floor number');
    });
  });

  describe('PropertyFeature Methods', () => {
    let property: any;

    beforeEach(async () => {
      const propertyData = {
        images: ['https://example.com/image1.jpg'],
        type: PropertyType.APARTMENT,
        size: 100,
        totalRooms: 4,
        bedrooms: 2,
        bathrooms: 2,
        garage: true,
        garageSpaces: 1,
        location: {
          street: 'Test street',
          city: 'Улаанбаатар',
          district: 'Сүхбаатар дүүрэг'
        },
        details: {
          completionDate: new Date('2020-01-01'),
          constructionYear: 2019,
          windowsCount: 6,
          windowType: 'plastic',
          floorMaterial: 'laminate',
          floorNumber: 3,
          totalFloors: 8,
          balcony: true,
          lift: true,
          heating: 'central'
        },
        amenities: ['parking', 'elevator', 'security'],
        nearbyFacilities: {
          schools: ['School 1', 'School 2'],
          hospitals: ['Hospital 1'],
          shopping: ['Mall 1'],
          transport: ['Bus stop'],
          parks: ['Park 1']
        },
        condition: 'good' as const,
        ownership: 'freehold' as const,
        furnished: false
      };

      property = await createPropertyFeature(propertyData, testUser._id.toString());
    });

    it('should calculate total area', () => {
      expect(property.calculateTotalArea()).toBe(100);
    });

    it('should calculate price per square meter', () => {
      const price = 300000000; // 300 million MNT
      const pricePerSqM = property.calculatePricePerSqM(price);
      expect(pricePerSqM).toBe(3000000); // 3 million MNT per sqm
    });

    it('should check location match', () => {
      expect(property.isInLocation('Улаанбаатар')).toBe(true);
      expect(property.isInLocation('Улаанбаатар', 'Сүхбаатар дүүрэг')).toBe(true);
      expect(property.isInLocation('Дархан')).toBe(false);
      expect(property.isInLocation('Улаанбаатар', 'Баянгол дүүрэг')).toBe(false);
    });

    it('should check amenity existence', () => {
      expect(property.hasAmenity('parking')).toBe(true);
      expect(property.hasAmenity('swimming_pool')).toBe(false);
    });

    it('should get nearby facilities', () => {
      const facilities = property.getNearbyFacilities();
      expect(facilities).toContain('School 1');
      expect(facilities).toContain('Hospital 1');
      expect(facilities).toContain('Mall 1');
      expect(facilities.length).toBe(6);
    });

    it('should validate images', () => {
      expect(property.validateImages()).toBe(true);
      
      property.images = [];
      expect(property.validateImages()).toBe(false);
      
      property.images = new Array(25).fill('https://example.com/image.jpg');
      expect(property.validateImages()).toBe(false);
    });

    it('should return public JSON', () => {
      const publicData = property.toPublicJSON();
      expect(publicData).toBeDefined();
      expect(publicData.size).toBe(100);
      expect(publicData.location).toBeDefined();
    });
  });

  describe('Virtual Properties', () => {
    let property: any;

    beforeEach(async () => {
      const propertyData = {
        images: ['https://example.com/image1.jpg'],
        type: PropertyType.HOUSE,
        size: 150,
        totalRooms: 5,
        bedrooms: 3,
        bathrooms: 2,
        garage: false,
        location: {
          street: 'Test street',
          city: 'Test city',
          district: 'Test district'
        },
        details: {
          completionDate: new Date('2015-01-01'),
          constructionYear: 2014,
          windowsCount: 10,
          windowType: 'wooden',
          floorMaterial: 'hardwood',
          floorNumber: 1,
          totalFloors: 2,
          balcony: false,
          lift: false,
          heating: 'individual'
        },
        condition: 'fair' as const,
        ownership: 'freehold' as const,
        furnished: true
      };

      property = await createPropertyFeature(propertyData, testUser._id.toString());
    });

    it('should calculate property age', () => {
      const expectedAge = new Date().getFullYear() - 2014;
      expect(property.age).toBe(expectedAge);
    });

    it('should calculate room density', () => {
      expect(property.roomDensity).toBe(30); // 150 / 5
    });
  });

  describe('Static Methods', () => {
    beforeEach(async () => {
      // Create test properties
      const properties = [
        {
          images: ['https://example.com/1.jpg'],
          type: PropertyType.APARTMENT,
          size: 80,
          totalRooms: 3,
          bedrooms: 2,
          bathrooms: 1,
          garage: false,
          location: {
            street: 'Street 1',
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
        },
        {
          images: ['https://example.com/2.jpg'],
          type: PropertyType.HOUSE,
          size: 200,
          totalRooms: 6,
          bedrooms: 4,
          bathrooms: 3,
          garage: true,
          garageSpaces: 2,
          location: {
            street: 'Street 2',
            city: 'Дархан',
            district: 'Төв дүүрэг'
          },
          details: {
            completionDate: new Date('2019-01-01'),
            windowsCount: 15,
            windowType: 'wooden',
            floorMaterial: 'hardwood',
            floorNumber: 1,
            totalFloors: 2,
            balcony: false,
            lift: false,
            heating: 'individual'
          },
          condition: 'good' as const,
          ownership: 'freehold' as const,
          furnished: true
        },
        {
          images: ['https://example.com/3.jpg'],
          type: PropertyType.OFFICE,
          size: 120,
          totalRooms: 8,
          bedrooms: 0,
          bathrooms: 2,
          garage: true,
          garageSpaces: 3,
          location: {
            street: 'Street 3',
            city: 'Улаанбаатар',
            district: 'Баянгол дүүрэг'
          },
          details: {
            completionDate: new Date('2021-01-01'),
            windowsCount: 20,
            windowType: 'aluminum',
            floorMaterial: 'tile',
            floorNumber: 8,
            totalFloors: 15,
            balcony: false,
            lift: true,
            heating: 'central'
          },
          condition: 'new' as const,
          ownership: 'leasehold' as const,
          furnished: true
        }
      ];

      for (const propertyData of properties) {
        await createPropertyFeature(propertyData, testUser._id.toString());
      }
    });

    it('should find properties by owner', async () => {
      const properties = await findPropertyFeaturesByOwner(testUser._id.toString());
      expect(properties).toHaveLength(3);
      expect(properties.every(p => p.owner.toString() === testUser._id.toString())).toBe(true);
    });

    it('should find properties by type', async () => {
      const apartments = await findPropertyFeaturesByType(PropertyType.APARTMENT);
      expect(apartments).toHaveLength(1);
      expect(apartments[0].type).toBe(PropertyType.APARTMENT);
      
      const houses = await findPropertyFeaturesByType(PropertyType.HOUSE);
      expect(houses).toHaveLength(1);
      expect(houses[0].type).toBe(PropertyType.HOUSE);
    });

    it('should find properties by location', async () => {
      const ulaanbaatarProperties = await findPropertyFeaturesByLocation('Улаанбаатар');
      expect(ulaanbaatarProperties).toHaveLength(2);
      
      const sukbaatarProperties = await findPropertyFeaturesByLocation('Улаанбаатар', 'Сүхбаатар дүүрэг');
      expect(sukbaatarProperties).toHaveLength(1);
      
      const darkhanProperties = await findPropertyFeaturesByLocation('Дархан');
      expect(darkhanProperties).toHaveLength(1);
    });

    it('should search properties with filters', async () => {
      const filters = {
        type: [PropertyType.APARTMENT, PropertyType.HOUSE],
        sizeMin: 100,
        sizeMax: 250,
        bedrooms: 2,
        location: { city: 'Улаанбаатар' },
        furnished: false
      };
      
      const results = await searchPropertyFeatures(filters);
      expect(results.length).toBeGreaterThan(0);
      expect(results.every(p => [PropertyType.APARTMENT, PropertyType.HOUSE].includes(p.type))).toBe(true);
      expect(results.every(p => p.size >= 100 && p.size <= 250)).toBe(true);
    });

    it('should get property statistics', async () => {
      const stats = await getPropertyFeatureStats();
      
      expect(stats.total).toBe(3);
      expect(stats.byType[PropertyType.APARTMENT]).toBe(1);
      expect(stats.byType[PropertyType.HOUSE]).toBe(1);
      expect(stats.byType[PropertyType.OFFICE]).toBe(1);
      expect(stats.averageSize).toBe(Math.round((80 + 200 + 120) / 3));
      expect(stats.sizeRange.min).toBe(80);
      expect(stats.sizeRange.max).toBe(200);
    });
  });

  describe('Pre-save Middleware', () => {
    it('should generate slug on save', async () => {
      const propertyData = {
        images: ['https://example.com/image1.jpg'],
        type: PropertyType.APARTMENT,
        size: 85,
        totalRooms: 3,
        bedrooms: 2,
        bathrooms: 1,
        garage: false,
        location: {
          street: 'Test street',
          city: 'Улаанбаатар',
          district: 'Сүхбаатар дүүрэг'
        },
        details: {
          completionDate: new Date(),
          windowsCount: 5,
          windowType: 'plastic',
          floorMaterial: 'tile',
          floorNumber: 3,
          totalFloors: 5,
          balcony: true,
          lift: true,
          heating: 'central'
        },
        condition: 'new' as const,
        ownership: 'freehold' as const,
        furnished: false
      };

      const property = await createPropertyFeature(propertyData, testUser._id.toString());
      
      expect(property.slug).toBeDefined();
      expect(property.slug).toContain('apartment');
      expect(property.slug).toContain('улаанбаатар');
    });

    it('should update updatedAt on save', async () => {
      const propertyData = {
        images: ['https://example.com/image1.jpg'],
        type: PropertyType.APARTMENT,
        size: 85,
        totalRooms: 3,
        bedrooms: 2,
        bathrooms: 1,
        garage: false,
        location: {
          street: 'Test street',
          city: 'Test city',
          district: 'Test district'
        },
        details: {
          completionDate: new Date(),
          windowsCount: 5,
          windowType: 'plastic',
          floorMaterial: 'tile',
          floorNumber: 3,
          totalFloors: 5,
          balcony: true,
          lift: true,
          heating: 'central'
        },
        condition: 'new' as const,
        ownership: 'freehold' as const,
        furnished: false
      };

      const property = await createPropertyFeature(propertyData, testUser._id.toString());
      const originalUpdatedAt = property.updatedAt;
      
      // Wait a moment and update
      await new Promise(resolve => setTimeout(resolve, 10));
      property.size = 90;
      await property.save();
      
      expect(property.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });
});
