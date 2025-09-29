import { createPropertyFeature } from '../../property-feature';
import { createUser } from '../../user';
// PropertyType not used in this test file
import { setupTestDB, teardownTestDB, clearTestDB } from '../setup';
import { createUserData, createPropertyFeatureData } from '../factories';

describe('PropertyFeature Methods', () => {
  let testUser: any;
  let testProperty: any;

  beforeAll(async () => {
    await setupTestDB();
    testUser = await createUser(createUserData());
  });

  afterAll(teardownTestDB);
  afterEach(clearTestDB);

  beforeEach(async () => {
    const propertyData = createPropertyFeatureData();
    testProperty = await createPropertyFeature(propertyData, testUser._id.toString());
  });

  it('should calculate total area', () => {
    const totalArea = testProperty.calculateTotalArea();
    expect(totalArea).toBe(85);
  });

  it('should calculate price per square meter', () => {
    const pricePerSqm = testProperty.calculatePricePerSqM(85000000); // 85M MNT
    expect(pricePerSqm).toBe(1000000); // 1M MNT per sqm
  });

  it('should check location', () => {
    expect(testProperty.isInLocation('Ulaanbaatar', 'Sukhbaatar')).toBe(true);
    expect(testProperty.isInLocation('Ulaanbaatar')).toBe(true);
    expect(testProperty.isInLocation('Darkhan')).toBe(false);
    expect(testProperty.isInLocation('Ulaanbaatar', 'Bayanzurkh')).toBe(false);
  });

  it('should check amenities', () => {
    expect(testProperty.hasAmenity('elevator')).toBe(true);
    expect(testProperty.hasAmenity('parking')).toBe(true);
    expect(testProperty.hasAmenity('pool')).toBe(false);
  });

  it('should get nearby facilities', () => {
    const facilities = testProperty.getNearbyFacilities();
    expect(Array.isArray(facilities)).toBe(true);
  });

  it('should validate images', () => {
    expect(testProperty.validateImages()).toBe(true);

    // Test with invalid images
    testProperty.images = ['invalid-url'];
    expect(testProperty.validateImages()).toBe(false);
  });

  it('should increment view count', async () => {
    const initialCount = testProperty.viewCount;
    await testProperty.incrementViewCount();
    expect(testProperty.viewCount).toBe(initialCount + 1);
  });

  it('should increment favorite count', async () => {
    const initialCount = testProperty.favoriteCount;
    await testProperty.incrementFavoriteCount();
    expect(testProperty.favoriteCount).toBe(initialCount + 1);
  });

  it('should decrement favorite count', async () => {
    await testProperty.incrementFavoriteCount();
    const countAfterIncrement = testProperty.favoriteCount;
    await testProperty.decrementFavoriteCount();
    expect(testProperty.favoriteCount).toBe(countAfterIncrement - 1);
  });

  it('should increment inquiry count', async () => {
    const initialCount = testProperty.inquiryCount;
    await testProperty.incrementInquiryCount();
    expect(testProperty.inquiryCount).toBe(initialCount + 1);
  });

  it('should check if property is available', () => {
    expect(testProperty.isAvailable()).toBe(true);

    // Test with poor condition
    testProperty.details.condition = 'poor';
    expect(testProperty.isAvailable()).toBe(false);
  });

  it('should get property summary', () => {
    const summary = testProperty.getSummary();
    expect(summary).toBe('2 bed, 1 bath, 85 sqm');
  });

  it('should check pet friendliness', () => {
    expect(testProperty.isPetFriendly()).toBe(false);

    testProperty.petPolicy = { allowed: true };
    expect(testProperty.isPetFriendly()).toBe(true);
  });

  it('should get energy rating', () => {
    const rating = testProperty.getEnergyRating();
    expect(rating).toBe('Not rated');

    testProperty.details.energyRating = 'A';
    expect(testProperty.getEnergyRating()).toBe('A');
  });

  it('should check utilities', () => {
    expect(testProperty.hasUtility('electricity')).toBe(false);

    testProperty.utilities = { electricity: true, water: true };
    expect(testProperty.hasUtility('electricity')).toBe(true);
    expect(testProperty.hasUtility('water')).toBe(true);
    expect(testProperty.hasUtility('gas')).toBe(false);
  });
});
