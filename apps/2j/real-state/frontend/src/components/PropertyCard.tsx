'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Property } from '../types/property';
import { Bed, Bath, Maximize, MapPin } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
}

const propertyTypeLabels: Record<string, string> = {
  apartment: 'Apartment',
  house: 'House',
  commercial: 'Commercial',
  land: 'Land',
};

const PropertyCard = ({ property }: PropertyCardProps) => {
  return (
    <div className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
      <div className="relative h-64 overflow-hidden">
        <Image
          src={property.image}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {property.featured && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
            ⭐ Featured
          </div>
        )}
        
        {/* Property type badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-semibold uppercase shadow-md">
          {propertyTypeLabels[property.type] || property.type}
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
          {property.title}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            ₮{property.price.toLocaleString()}
          </p>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="h-4 w-4 text-blue-500" />
          <p className="text-sm font-medium">{property.location}</p>
        </div>

        {/* Property details */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-gray-700">
            <Bed className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-semibold">{property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-700">
            <Bath className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-semibold">{property.bathrooms}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-700">
            <Maximize className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-semibold">{property.area} m²</span>
          </div>
        </div>

        {/* View Details Button */}
        <Link
          href={`/properties/${property.id}`}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-center font-semibold shadow-md hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 group/btn"
        >
          View Details
          <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;