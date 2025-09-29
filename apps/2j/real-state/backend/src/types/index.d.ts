/* eslint-disable @typescript-eslint/ban-types */

// ===== ENUMS / ТОДОРХОЙЛОГЧ =====

// Үл хөдлөх хөрөнгийн төрөл / Property Types
export enum PropertyType {
  HOUSE = 'house',      // байшин
  APARTMENT = 'apartment', // орон сууц
  OFFICE = 'office',    // оффис
  COMMERCIAL = 'commercial', // арилжааны
  LAND = 'land',        // газар
  WAREHOUSE = 'warehouse'  // агуулах
}

// Үл хөдлөх хөрөнгийн төлөв / Property Status
export enum PropertyStatus {
  PENDING = 'pending',     // хүлээгдэж буй
  APPROVED = 'approved',   // зөвшөөрөгдсөн
  DECLINED = 'declined',   // татгалзсан
  EXPIRED = 'expired',     // хугацаа дууссан
  SOLD = 'sold'           // зарагдсан
}

// Хэрэглэгчийн үүрэг / User Roles
export enum UserRole {
  BUYER = 'buyer',         // худалдан авагч
  SELLER = 'seller',       // худалдагч
  AGENT = 'agent',         // зуучлагч
  ADMIN = 'admin'          // админ
}

// Хэл / Language
export enum Language {
  EN = 'en',               // англи
  MN = 'mn'                // монгол
}

// Валют / Currency
export enum Currency {
  MNT = 'MNT',             // төгрөг
  USD = 'USD',             // доллар
  EUR = 'EUR'              // евро
}

// ===== LOCALIZED INTERFACES / ОРЧУУЛГАТАЙ ИНТЕРФЕЙС =====

// Хэл дэмжих интерфейс / Localized content interface
export interface LocalizedContent {
  en: string;              // англи хэл дээрх агуулга
  mn: string;              // монгол хэл дээрх агуулга
}

// ===== ADDRESS INTERFACE / ХАЯГИЙН ИНТЕРФЕЙС =====

// Хаяг / Address
export interface Address {
  street: string;          // гудамж
  city: string;            // хот
  district: string;        // дүүрэг
  khoroo?: string;         // хороо
  building?: string;       // байр
  apartment?: string;      // орц
  zipCode?: string;        // шуудангийн индекс
  coordinates?: {          // координат
    latitude: number;      // өргөрөг
    longitude: number;     // уртраг
  };
  description?: LocalizedContent; // тайлбар
}

// ===== PROPERTY DETAILS INTERFACE / ҮЙЛДВЭРИЙН ДЭЛГЭРЭНГҮЙ =====

// Үл хөдлөх хөрөнгийн дэлгэрэнгүй / Property Details
export interface PropertyDetails {
  completionDate: Date;    // барилгын дуусах огноо
  constructionYear?: number; // барилгын жил
  windowsCount: number;    // цонхны тоо
  windowType: string;      // цонхны төрөл
  floorMaterial: string;   // шалны материал
  floorNumber: number;     // давхар
  totalFloors: number;     // нийт давхар
  balcony: boolean;        // тагт
  balconyCount?: number;   // тагтын тоо
  lift: boolean;           // цахилгаан шат
  liftCount?: number;      // цахилгаан шатны тоо
  heating: string;         // халаалт
  airConditioning?: boolean; // агаарын кондиционер
  internet?: boolean;      // интернет
  parking?: boolean;       // зогсоол
  parkingSpaces?: number;  // зогсоолын байрны тоо
  security?: boolean;      // хамгаалалт
  furnished?: boolean;     // тавилгатай эсэх
  petFriendly?: boolean;   // тэжээвэр амьтан зөвшөөрөх эсэх
  garden?: boolean;        // цэцэрлэг
  basement?: boolean;      // подвал
  attic?: boolean;         // дээд давхар
  storage?: boolean;       // агуулах
  laundry?: boolean;       // угаалгын өрөө
  description?: LocalizedContent; // тайлбар
}

// ===== USER INTERFACES / ХЭРЭГЛЭГЧИЙН ИНТЕРФЕЙС =====

// Хэрэглэгчийн үндсэн интерфейс / User Base Interface
export interface IUser {
  _id?: string;
  email: string;           // имэйл
  password: string;        // нууц үг
  firstName: string;       // нэр
  lastName: string;        // овог
  phone: string;           // утас
  avatar?: string;         // зураг
  role: UserRole;          // үүрэг
  isActive: boolean;       // идэвхтэй эсэх
  isVerified: boolean;     // баталгаажсан эсэх
  preferredLanguage: Language; // сонгосон хэл
  address?: Address;       // хаяг
  dateOfBirth?: Date;      // төрсөн огноо
  gender?: 'male' | 'female' | 'other'; // хүйс
  bio?: LocalizedContent;  // товч танилцуулга
  socialMedia?: {          // сошиал медиа
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  preferences?: {          // тохиргоо
    notifications: boolean; // мэдэгдэл
    newsletter: boolean;   // сэтгүүл
    smsAlerts: boolean;    // SMS мэдэгдэл
  };
  lastLoginAt?: Date;      // сүүлд нэвтэрсэн огноо
  createdAt: Date;         // үүсгэсэн огноо
  updatedAt: Date;         // шинэчилсэн огноо
}

// Хэрэглэгч үүсгэх / Create User Input
export interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role?: UserRole;
  preferredLanguage?: Language;
  address?: Address;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  bio?: LocalizedContent;
}

// Хэрэглэгч шинэчлэх / Update User Input
export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  address?: Address;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  bio?: LocalizedContent;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  preferences?: {
    notifications?: boolean;
    newsletter?: boolean;
    smsAlerts?: boolean;
  };
  preferredLanguage?: Language;
}

// Нэвтрэх / Login Input
export interface LoginInput {
  email: string;
  password: string;
}

// Нууц үг сэргээх / Password Reset Input
export interface PasswordResetInput {
  email: string;
}

// Нууц үг солих / Change Password Input
export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

// ===== POST INTERFACES / НИЙТЛЭЛИЙН ИНТЕРФЕЙС =====

// Нийтлэлийн үндсэн интерфейс / Post Base Interface
export interface IPost {
  _id?: string;
  owner: string;           // эзэмшигч (User._id)
  title: LocalizedContent; // гарчиг
  description: LocalizedContent; // тайлбар
  price: number;           // үнэ
  currency: Currency;      // валют
  propertyFeature: string; // үл хөдлөх хөрөнгийн онцлог (PropertyFeature._id)
  status: PropertyStatus;  // төлөв
  featured: boolean;       // онцлох эсэх
  viewCount: number;       // үзсэн тоо
  favoriteCount: number;   // дуртай гэсэн тоо
  tags?: string[];         // шошго
  availableFrom?: Date;    // хэзээнээс боломжтой
  availableUntil?: Date;   // хэзээ хүртэл боломжтой
  contactInfo?: {          // холбоо барих мэдээлэл
    showPhone: boolean;    // утас харуулах эсэх
    showEmail: boolean;    // имэйл харуулах эсэх
    preferredContactTime?: string; // холбоо барих цаг
  };
  seoMetadata?: {          // SEO мэдээлэл
    metaTitle?: LocalizedContent;
    metaDescription?: LocalizedContent;
    keywords?: string[];
  };
  publishedAt?: Date;      // нийтэлсэн огноо
  expiresAt?: Date;        // дуусах огноо
  createdAt: Date;         // үүсгэсэн огноо
  updatedAt: Date;         // шинэчилсэн огноо
}

// Нийтлэл үүсгэх / Create Post Input
export interface CreatePostInput {
  title: LocalizedContent;
  description: LocalizedContent;
  price: number;
  currency?: Currency;
  propertyFeature: string;
  tags?: string[];
  availableFrom?: Date;
  availableUntil?: Date;
  contactInfo?: {
    showPhone?: boolean;
    showEmail?: boolean;
    preferredContactTime?: string;
  };
}

// Нийтлэл шинэчлэх / Update Post Input
export interface UpdatePostInput {
  title?: LocalizedContent;
  description?: LocalizedContent;
  price?: number;
  currency?: Currency;
  tags?: string[];
  availableFrom?: Date;
  availableUntil?: Date;
  contactInfo?: {
    showPhone?: boolean;
    showEmail?: boolean;
    preferredContactTime?: string;
  };
  featured?: boolean;
}

// Нийтлэлийн төлөв шинэчлэх / Update Post Status Input
export interface UpdatePostStatusInput {
  status: PropertyStatus;
  adminNote?: string;      // админы тэмдэглэл
}

// ===== PROPERTY FEATURE INTERFACES / ҮЙЛДВЭРИЙН ОНЦЛОГИЙН ИНТЕРФЕЙС =====

// Үл хөдлөх хөрөнгийн онцлог / Property Feature
export interface IPropertyFeature {
  _id?: string;
  owner: string;           // эзэмшигч (User._id)
  images: string[];        // зургууд
  virtualTour?: string;    // виртуал аялал
  videos?: string[];       // видео
  type: PropertyType;      // төрөл
  size: number;            // хэмжээ (м2)
  totalRooms: number;      // нийт өрөөний тоо
  bedrooms: number;        // унтлагын өрөөний тоо
  bathrooms: number;       // угаалгын өрөөний тоо
  livingRooms?: number;    // зочны өрөөний тоо
  kitchens?: number;       // гал тогооны өрөөний тоо
  garage: boolean;         // гараж
  garageSpaces?: number;   // гаражийн байрны тоо
  location: Address;       // байршил
  details: PropertyDetails; // дэлгэрэнгүй
  amenities?: string[];    // дэд бүтэц
  nearbyFacilities?: {     // ойр орчмын байгууламж
    schools?: string[];    // сургууль
    hospitals?: string[];  // эмнэлэг
    shopping?: string[];   // дэлгүүр
    transport?: string[];  // тээвэр
    parks?: string[];      // цэцэрлэгт хүрээлэн
  };
  energyRating?: string;   // эрчим хүчний үнэлгээ
  condition: 'new' | 'excellent' | 'good' | 'fair' | 'poor'; // байдал
  ownership: 'freehold' | 'leasehold' | 'shared'; // өмчлөлийн төрөл
  furnished: boolean;      // тавилгатай эсэх
  petPolicy?: {            // тэжээвэр амьтны бодлого
    allowed: boolean;
    deposit?: number;
    restrictions?: string[];
  };
  utilities?: {            // хэрэгслүүд
    electricity: boolean;
    water: boolean;
    gas: boolean;
    internet: boolean;
    cable: boolean;
  };
  rules?: LocalizedContent; // дүрэм
  createdAt: Date;         // үүсгэсэн огноо
  updatedAt: Date;         // шинэчилсэн огноо
}

// Үл хөдлөх хөрөнгийн онцлог үүсгэх / Create Property Feature Input
export interface CreatePropertyFeatureInput {
  images: string[];
  virtualTour?: string;
  videos?: string[];
  type: PropertyType;
  size: number;
  totalRooms: number;
  bedrooms: number;
  bathrooms: number;
  livingRooms?: number;
  kitchens?: number;
  garage: boolean;
  garageSpaces?: number;
  location: Address;
  details: PropertyDetails;
  amenities?: string[];
  nearbyFacilities?: {
    schools?: string[];
    hospitals?: string[];
    shopping?: string[];
    transport?: string[];
    parks?: string[];
  };
  energyRating?: string;
  condition: 'new' | 'excellent' | 'good' | 'fair' | 'poor';
  ownership: 'freehold' | 'leasehold' | 'shared';
  furnished: boolean;
  petPolicy?: {
    allowed: boolean;
    deposit?: number;
    restrictions?: string[];
  };
  utilities?: {
    electricity?: boolean;
    water?: boolean;
    gas?: boolean;
    internet?: boolean;
    cable?: boolean;
  };
  rules?: LocalizedContent;
}

// ===== SEARCH AND FILTER INTERFACES / ХАЙХ ШҮҮХ ИНТЕРФЕЙС =====

// Хайх шүүлтүүр / Search Filters
export interface SearchFilters {
  type?: PropertyType[];
  priceMin?: number;
  priceMax?: number;
  currency?: Currency;
  sizeMin?: number;
  sizeMax?: number;
  bedrooms?: number;
  bathrooms?: number;
  location?: {
    city?: string;
    district?: string;
    radius?: number;       // км радиус
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  amenities?: string[];
  condition?: string[];
  furnished?: boolean;
  garage?: boolean;
  availableFrom?: Date;
  availableUntil?: Date;
}

// Хайлтын үр дүн / Search Results
export interface SearchResults {
  posts: IPost[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  filters: SearchFilters;
}

// ===== NOTIFICATION INTERFACES / МЭДЭГДЛИЙН ИНТЕРФЕЙС =====

// Мэдэгдэл / Notification
export interface INotification {
  _id?: string;
  recipient: string;       // хүлээн авагч (User._id)
  sender?: string;         // илгээгч (User._id)
  type: 'info' | 'warning' | 'error' | 'success';
  title: LocalizedContent;
  message: LocalizedContent;
  data?: any;              // нэмэлт өгөгдөл
  read: boolean;           // уншсан эсэх
  createdAt: Date;
}

// ===== FAVORITES INTERFACES / ДУРТАЙ НИЙТЛЭЛИЙН ИНТЕРФЕЙС =====

// Дуртай нийтлэл / Favorite
export interface IFavorite {
  _id?: string;
  user: string;            // хэрэглэгч (User._id)
  post: string;            // нийтлэл (Post._id)
  createdAt: Date;
}

// ===== REVIEW INTERFACES / ҮНЭЛГЭЭНИЙ ИНТЕРФЕЙС =====

// Үнэлгээ / Review
export interface IReview {
  _id?: string;
  reviewer: string;        // үнэлэгч (User._id)
  reviewee: string;        // үнэлэгдэгч (User._id)
  post?: string;           // нийтлэл (Post._id)
  rating: number;          // үнэлгээ (1-5)
  comment?: LocalizedContent; // сэтгэгдэл
  createdAt: Date;
  updatedAt: Date;
}

// ===== MESSAGE INTERFACES / МЕССЕЖИЙН ИНТЕРФЕЙС =====

// Мессеж / Message
export interface IMessage {
  _id?: string;
  sender: string;          // илгээгч (User._id)
  recipient: string;       // хүлээн авагч (User._id)
  post?: string;           // нийтлэл (Post._id)
  content: string;         // агуулга
  attachments?: string[];  // хавсралт
  read: boolean;           // уншсан эсэх
  createdAt: Date;
}

// ===== ANALYTICS INTERFACES / АНАЛИТИКИЙН ИНТЕРФЕЙС =====

// Аналитик / Analytics
export interface IAnalytics {
  _id?: string;
  post: string;            // нийтлэл (Post._id)
  event: 'view' | 'contact' | 'favorite' | 'share';
  user?: string;           // хэрэглэгч (User._id)
  ipAddress?: string;      // IP хаяг
  userAgent?: string;      // хэрэглэгчийн програм
  timestamp: Date;
}

// ===== GRAPHQL CONTEXT / GRAPHQL КОНТЕКСТ =====

// GraphQL Context
export type Context = {
  user?: IUser;
  language?: Language;
  ip?: string;
  userAgent?: string;
};

// ===== API RESPONSE INTERFACES / API ХАРИУ ИНТЕРФЕЙС =====

// Стандарт API хариу / Standard API Response
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: LocalizedContent;
  errors?: Array<{
    field?: string;
    message: LocalizedContent;
  }>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

// ===== VALIDATION INTERFACES / БАТАЛГААЖУУЛАЛТЫН ИНТЕРФЕЙС =====

// Баталгаажуулалтын алдаа / Validation Error
export interface ValidationError {
  field: string;
  message: LocalizedContent;
  value?: any;
}

// ===== UTILITY TYPES / ТУСЛАХ ТӨРЛҮҮД =====

// MongoDB ObjectId төрөл / MongoDB ObjectId Type
export type ObjectId = string;

// Файлын мэдээлэл / File Information
export interface FileInfo {
  filename: string;
  mimetype: string;
  encoding: string;
  size: number;
  url: string;
  thumbnail?: string;
}

// Пагинацийн параметр / Pagination Parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ===== ENUM MAPPINGS FOR LOCALIZATION / ОРЧУУЛГЫН ТОДОРХОЙЛОЛТ =====

export const PropertyTypeLabels: Record<PropertyType, LocalizedContent> = {
  [PropertyType.HOUSE]: {
    en: 'House',
    mn: 'Байшин'
  },
  [PropertyType.APARTMENT]: {
    en: 'Apartment',
    mn: 'Орон сууц'
  },
  [PropertyType.OFFICE]: {
    en: 'Office',
    mn: 'Оффис'
  },
  [PropertyType.COMMERCIAL]: {
    en: 'Commercial',
    mn: 'Арилжааны'
  },
  [PropertyType.LAND]: {
    en: 'Land',
    mn: 'Газар'
  },
  [PropertyType.WAREHOUSE]: {
    en: 'Warehouse',
    mn: 'Агуулах'
  }
};

export const PropertyStatusLabels: Record<PropertyStatus, LocalizedContent> = {
  [PropertyStatus.PENDING]: {
    en: 'Pending',
    mn: 'Хүлээгдэж буй'
  },
  [PropertyStatus.APPROVED]: {
    en: 'Approved',
    mn: 'Зөвшөөрөгдсөн'
  },
  [PropertyStatus.DECLINED]: {
    en: 'Declined',
    mn: 'Татгалзсан'
  },
  [PropertyStatus.EXPIRED]: {
    en: 'Expired',
    mn: 'Хугацаа дууссан'
  },
  [PropertyStatus.SOLD]: {
    en: 'Sold',
    mn: 'Зарагдсан'
  }
};

export const UserRoleLabels: Record<UserRole, LocalizedContent> = {
  [UserRole.BUYER]: {
    en: 'Buyer',
    mn: 'Худалдан авагч'
  },
  [UserRole.SELLER]: {
    en: 'Seller',
    mn: 'Худалдагч'
  },
  [UserRole.AGENT]: {
    en: 'Agent',
    mn: 'Зуучлагч'
  },
  [UserRole.ADMIN]: {
    en: 'Administrator',
    mn: 'Админ'
  }
};