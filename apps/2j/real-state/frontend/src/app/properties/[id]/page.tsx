/* eslint-disable complexity */
/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Heart, Share2, Phone, Mail, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { SAMPLE_PROPERTIES } from '../../../data/properties';
import PropertyCard from '../../../components/PropertyCard';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { Property } from '../../../types/property';

// Enhanced property data with more details
const enhancedPropertyData: Record<number, Property & {
  owner?: string;
  phone?: string;
  yearBuilt?: number;
  windows?: number;
  windowType?: string;
  doorType?: string;
  floor?: number;
  buildingFloors?: number;
  floorType?: string;
  balcony?: boolean;
  elevator?: boolean;
  images: string[];
}> = {
  1: {
    ...SAMPLE_PROPERTIES[0],
    owner: 'Батбаяр',
    phone: '+976 11 123456',
    yearBuilt: 2023,
    windows: 8,
    windowType: 'Дулаан цонх',
    doorType: 'Металл хаалга',
    floor: 5,
    buildingFloors: 12,
    floorType: 'Паркет',
    balcony: true,
    elevator: true,
    images: [
      '/api/placeholder/800/600',
      '/api/placeholder/800/600',
      '/api/placeholder/800/600',
      '/api/placeholder/800/600',
      '/api/placeholder/800/600',
      '/api/placeholder/800/600',
      '/api/placeholder/800/600',
      '/api/placeholder/800/600',
      '/api/placeholder/800/600',
      '/api/placeholder/800/600',
    ]
  },
  2: {
    ...SAMPLE_PROPERTIES[1],
    owner: 'Сүхбаатар',
    phone: '+976 11 234567',
    yearBuilt: 2022,
    windows: 12,
    windowType: 'Дулаан цонх',
    doorType: 'Модон хаалга',
    floor: 1,
    buildingFloors: 1,
    floorType: 'Паркет',
    balcony: true,
    elevator: false,
    images: [
      '/api/placeholder/800/600',
      '/api/placeholder/800/600',
      '/api/placeholder/800/600',
      '/api/placeholder/800/600',
      '/api/placeholder/800/600',
      '/api/placeholder/800/600',
      '/api/placeholder/800/600',
      '/api/placeholder/800/600',
      '/api/placeholder/800/600',
    ]
  }
};

const PropertyDetailPage = () => {
  const params = useParams();
  const [property, setProperty] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const propertyId = parseInt(params.id as string);
    const foundProperty = enhancedPropertyData[propertyId] || SAMPLE_PROPERTIES.find(p => p.id === propertyId);
    
    if (foundProperty) {
      setProperty(foundProperty);
    }
    setLoading(false);
  }, [params.id]);

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const nextImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Get related properties (exclude current property)
  const relatedProperties = SAMPLE_PROPERTIES.filter(p => p.id !== property?.id).slice(0, 6);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ачааллаж байна...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Үл хөдлөх хөрөнгө олдсонгүй</h1>
          <p className="text-gray-600">Таны хайсан үл хөдлөх хөрөнгө олдсонгүй.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image Gallery */}
          <div className="lg:col-span-2">
            {/* Main Image */}
            <div className="relative mb-4">
              <div className="relative h-96 lg:h-[500px] rounded-xl overflow-hidden bg-gray-200">
                <Image
                  src={property.images?.[currentImageIndex] || property.image}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                >
                  <ChevronLeft className="h-6 w-6 text-gray-700" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                >
                  <ChevronRight className="h-6 w-6 text-gray-700" />
                </button>
                {/* Image Counter */}
                <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1}/{property.images?.length || 1}
                </div>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {property.images?.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => selectImage(index)}
                  className={`relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden ${
                    currentImageIndex === index ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${property.title} - ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Property Details */}
          <div className="space-y-6">
            {/* Property Type & Title */}
            <div>
              <div className="text-sm text-blue-600 font-medium mb-2">Орон сууц</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{property.title}</h1>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="text-sm">{property.location}</span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-blue-600">
                {property.price.toLocaleString()}₮
              </div>
            </div>

            {/* Property Details Grid */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Үл хөдлөх хөрөнгийн мэдээлэл</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Эзэмшигч:</span>
                  <span className="font-medium">{property.owner || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Утасны дугаар:</span>
                  <span className="font-medium">{property.phone || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Үнэ:</span>
                  <span className="font-medium text-blue-600">{property.price.toLocaleString()}₮</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Талбай:</span>
                  <span className="font-medium">{property.area} м²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Өрөө:</span>
                  <span className="font-medium">{property.bedrooms} өрөө</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ариун цэврийн өрөө:</span>
                  <span className="font-medium">{property.bathrooms} өрөө</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Дулаан зогсоол:</span>
                  <span className="font-medium">{property.parking ? 'Тийм' : 'Үгүй'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ашиглалтанд орсон он:</span>
                  <span className="font-medium">{property.yearBuilt || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Цонхны тоо:</span>
                  <span className="font-medium">{property.windows || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Цонх:</span>
                  <span className="font-medium">{property.windowType || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Хаалга:</span>
                  <span className="font-medium">{property.doorType || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Хэдэн давхарт:</span>
                  <span className="font-medium">{property.floor || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Барилгын давхар:</span>
                  <span className="font-medium">{property.buildingFloors || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Шал:</span>
                  <span className="font-medium">{property.floorType || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Тагт:</span>
                  <span className="font-medium">{property.balcony ? 'Тийм' : 'Үгүй'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Лифт:</span>
                  <span className="font-medium">{property.elevator ? 'Тийм' : 'Үгүй'}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Тайлбар</h3>
              <p className="text-gray-700 leading-relaxed">
                {property.description || 'Орчин үеийн дизайн, өндөр чанарын материал ашиглан барьсан орон сууц. Төв халаалт, 24 цагийн аюулгүй байдал, зогсоол, цэцэрлэгтэй. Гайхалтай үзэмжтэй, тохилог орчинтой.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleToggleFavorite}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
                  isFavorite
                    ? 'bg-red-50 text-red-600 border border-red-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                {isFavorite ? 'Хасагдсан' : 'Хадгалах'}
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all">
                <Share2 className="h-5 w-5" />
                Хуваалцах
              </button>
            </div>

            {/* Contact Agent */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Холбоо барих</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-medium">ББ</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Батбаяр</div>
                    <div className="text-sm text-gray-600">Үл хөдлөх хөрөнгийн зөвлөх</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-all">
                    <Phone className="h-4 w-4" />
                    Утасдах
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all">
                    <Mail className="h-4 w-4" />
                    Имэйл
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Properties */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Тестэй зарууд</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProperties.map((relatedProperty) => (
              <PropertyCard key={relatedProperty.id} property={relatedProperty} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PropertyDetailPage;