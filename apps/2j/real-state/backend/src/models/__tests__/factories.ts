import { UserRole, Language, PropertyType, PropertyStatus, Currency } from '../../types';

export const createUserData = (overrides: Record<string, unknown> = {}) => ({
  email: 'test@example.com',
  password: 'password123',
  firstName: 'Баттулга',
  lastName: 'Баяр',
  phone: '+97699123456',
  role: UserRole.BUYER,
  preferredLanguage: Language.MN,
  ...overrides
});

export const createUserWithAddress = (overrides: Record<string, unknown> = {}) => ({
  ...createUserData(overrides),
  address: {
    street: 'Peace Avenue 15',
    city: 'Ulaanbaatar',
    district: 'Sukhbaatar',
    zipCode: '14200',
    coordinates: {
      latitude: 47.9077,
      longitude: 106.8832
    },
    description: {
      en: 'Central location near Sukhbaatar Square',
      mn: 'Сүхбаатарын талбайн ойролцоох төв байршил'
    }
  }
});

export const createPropertyFeatureData = (overrides: Record<string, unknown> = {}) => ({
  type: PropertyType.APARTMENT,
  size: 85,
  totalRooms: 3,
  bedrooms: 2,
  bathrooms: 1,
  livingRooms: 1,
  kitchens: 1,
  garage: false,
  location: {
    street: 'Peace Avenue 15',
    city: 'Ulaanbaatar',
    district: 'Sukhbaatar',
    zipCode: '14200',
    coordinates: {
      latitude: 47.9077,
      longitude: 106.8832
    }
  },
  details: {
    size: 85,
    totalRooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    livingRooms: 1,
    kitchens: 1,
    garage: false,
    condition: 'good' as const,
    ownership: 'freehold' as const,
    furnished: false
  },
  images: ['https://example.com/image1.jpg'],
  amenities: ['elevator', 'parking'],
  ...overrides
});

export const createPostData = (overrides: Record<string, unknown> = {}) => ({
  title: {
    en: 'Beautiful Apartment in Central Ulaanbaatar',
    mn: 'Төв Улаанбаатарт сайхан орон сууц'
  },
  description: {
    en: 'Modern apartment with great location',
    mn: 'Орчин үеийн орон сууц, сайхан байршилтай'
  },
  price: 150000000,
  currency: Currency.MNT,
  propertyFeature: '', // Will be set when creating
  status: PropertyStatus.PENDING,
  featured: false,
  tags: ['apartment', 'central', 'modern'],
  availableFrom: new Date(),
  contactInfo: {
    showPhone: true,
    showEmail: true,
    preferredContactTime: '9AM-6PM'
  },
  ...overrides
});

export const createAdminUser = () => createUserData({
  email: 'admin@example.com',
  role: UserRole.ADMIN,
  firstName: 'Admin',
  lastName: 'User'
});

export const createSellerUser = () => createUserData({
  email: 'seller@example.com',
  role: UserRole.SELLER,
  firstName: 'Seller',
  lastName: 'User'
});

export const createAgentUser = () => createUserData({
  email: 'agent@example.com',
  role: UserRole.AGENT,
  firstName: 'Agent',
  lastName: 'User'
});
