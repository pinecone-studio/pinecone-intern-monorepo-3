export interface PropertySubmission {
  id: string;
  title: string;
  titleEn?: string;
  price: number;
  location: string;
  locationEn?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: 'apartment' | 'house' | 'commercial' | 'land' | 'villa' | 'cottage' | 'loft' | 'condo';
  images: string[];
  description?: string;
  descriptionEn?: string;
  amenities?: string[];
  features?: string[];
  yearBuilt?: number;
  parking?: number;
  garden?: boolean;
  balcony?: boolean;
  furnished?: boolean;
  petFriendly?: boolean;
  
  // Submission details
  submittedBy: string; // User ID
  submittedByEmail: string;
  submittedByName: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  
  // Additional details for admin
  owner?: string;
  phone?: string;
  windows?: number;
  windowType?: string;
  doorType?: string;
  floor?: number;
  buildingFloors?: number;
  floorType?: string;
  elevator?: boolean;
}
