import { createPropertyFeature, findPropertyFeatureById, findPropertyFeaturesByOwner } from '../../property-feature';
import { createUser } from '../../user';
import { PropertyType } from '../../../types';
import { setupTestDB, teardownTestDB, clearTestDB } from '../setup';
import { createUserData, createPropertyFeatureData } from '../factories';

describe('PropertyFeature Creation', () => {
  let testUser: any;

  beforeAll(async () => {
    await setupTestDB();
    testUser = await createUser(createUserData());
  });

  afterAll(teardownTestDB);
  afterEach(clearTestDB);

  it('should create a new property feature with valid data', async () => {
    const propertyData = createPropertyFeatureData();
    const property = await createPropertyFeature(propertyData, testUser._id.toString());

    expect(property.type).toBe(PropertyType.APARTMENT);
    expect(property.size).toBe(85);
    expect(property.bedrooms).toBe(2);
    expect(property.bathrooms).toBe(1);
    expect(property.owner.toString()).toBe(testUser._id.toString());
    expect(property.viewCount).toBe(0);
    expect(property.favoriteCount).toBe(0);
    expect(property.inquiryCount).toBe(0);
  });

  it('should create property with address', async () => {
    const propertyData = createPropertyFeatureData();
    const property = await createPropertyFeature(propertyData, testUser._id.toString());

    expect(property.location).toBeDefined();
    expect(property.location.city).toBe('Ulaanbaatar');
    expect(property.location.district).toBe('Sukhbaatar');
    expect(property.location.coordinates?.latitude).toBe(47.9077);
  });

  it('should create property with amenities', async () => {
    const propertyData = createPropertyFeatureData({
      amenities: ['elevator', 'parking', 'gym']
    });
    const property = await createPropertyFeature(propertyData, testUser._id.toString());

    expect(property.amenities).toHaveLength(3);
    expect(property.amenities).toContain('elevator');
    expect(property.amenities).toContain('parking');
    expect(property.amenities).toContain('gym');
  });

  it('should find property by ID', async () => {
    const propertyData = createPropertyFeatureData();
    const createdProperty = await createPropertyFeature(propertyData, testUser._id.toString());
    const foundProperty = await findPropertyFeatureById(createdProperty._id.toString());

    expect(foundProperty).toBeTruthy();
    expect(foundProperty?.type).toBe(propertyData.type);
  });

  it('should find properties by owner', async () => {
    const propertyData1 = createPropertyFeatureData();
    const propertyData2 = createPropertyFeatureData({
      type: PropertyType.HOUSE
    });

    await createPropertyFeature(propertyData1, testUser._id.toString());
    await createPropertyFeature(propertyData2, testUser._id.toString());

    const userProperties = await findPropertyFeaturesByOwner(testUser._id.toString());
    expect(userProperties).toHaveLength(2);
  });

  it('should not create property with invalid data', async () => {
    const invalidPropertyData = {
      type: 'invalid-type' as any,
      size: -10,
      bedrooms: -1
    };

    await expect(createPropertyFeature(invalidPropertyData, testUser._id.toString())).rejects.toThrow();
  });
});
