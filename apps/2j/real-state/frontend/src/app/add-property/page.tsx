/* eslint-disable complexity */
/* eslint-disable max-lines */
/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Plus, Upload, X, Home, MapPin, DollarSign, Bed, Bath, Maximize } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { PropertySubmission } from '../../types/property-submission';
import { useCreatePropertyMutation, PropertyType, PropertyStatus } from '../../generated';

const AddPropertyPage = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [createProperty, { loading, error }] = useCreatePropertyMutation();
  const [formData, setFormData] = useState({
    title: '',
    titleEn: '',
    price: '',
    location: '',
    locationEn: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    type: 'apartment' as const,
    description: '',
    descriptionEn: '',
    yearBuilt: '',
    parking: '',
    garden: false,
    balcony: false,
    furnished: false,
    petFriendly: false,
    owner: '',
    phone: '',
    windows: '',
    windowType: '',
    doorType: '',
    floor: '',
    buildingFloors: '',
    floorType: '',
    elevator: false,
    amenities: [] as string[],
  });

  const propertyTypes = [
    { value: 'apartment', label: 'Орон сууц' },
    { value: 'house', label: 'Байшин' },
    { value: 'commercial', label: 'Худалдааны байр' },
    { value: 'land', label: 'Газар' },
    { value: 'villa', label: 'Вилла' },
    { value: 'cottage', label: 'Зуслангийн байшин' },
    { value: 'loft', label: 'Лофт' },
    { value: 'condo', label: 'Кондо' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    
    try {
      // Create property using GraphQL mutation
      const result = await createProperty({
        variables: {
          input: {
            title: formData.title,
            price: parseFloat(formData.price),
            location: formData.location,
            bedrooms: parseInt(formData.bedrooms),
            bathrooms: parseInt(formData.bathrooms),
            area: parseFloat(formData.area),
            type: formData.type as PropertyType,
            image: images[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600',
            images: images,
            featured: false,
            description: formData.description,
            yearBuilt: formData.yearBuilt ? parseInt(formData.yearBuilt) : undefined,
            parking: formData.parking ? parseInt(formData.parking) : undefined,
            garden: formData.garden,
            balcony: formData.balcony,
            furnished: formData.furnished,
            petFriendly: formData.petFriendly,
            status: PropertyStatus.ForSale,
            agent: formData.owner && formData.phone ? {
              name: formData.owner,
              phone: formData.phone,
              email: user.primaryEmailAddress?.emailAddress || '',
              title: 'Owner'
            } : undefined
          }
        }
      });

      console.log('Property created:', result.data);
      
      // Show success message
      alert('Үл хөдлөх хөрөнгө амжилттай нэмэгдлээ!');
      
      router.push('/properties');
    } catch (err) {
      console.error('Error creating property:', err);
      alert('Алдаа гарлаа. Дахин оролдоно уу.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ачааллаж байна...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Home className="h-16 w-16 text-blue-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Нэвтрэх шаардлагатай</h1>
          <p className="text-gray-600 mb-6">Үл хөдлөх хөрөнгө нэмэхийн тулд эхлээд нэвтэрнэ үү.</p>
          <button
            onClick={() => router.push('/sign-in')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Нэвтрэх
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Plus className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Үл хөдлөх хөрөнгө нэмэх</h1>
          </div>
          <p className="text-gray-600">Таны үл хөдлөх хөрөнгийн заа админы зөвшөөрлийн дараа нийтлэгдэнэ.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Үндсэн мэдээлэл</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Гарчиг (Монгол) *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Жишээ: Орчин үеийн орон сууц"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Гарчиг (Англи)
                </label>
                <input
                  type="text"
                  name="titleEn"
                  value={formData.titleEn}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Example: Modern Apartment"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Үнэ (₮) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="150000000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Үл хөдлөх хөрөнгийн төрөл *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  {propertyTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Байршил (Монгол) *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Сүхбаатар дүүрэг, Чингисийн өргөн чөлөө"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Байршил (Англи)
                </label>
                <input
                  type="text"
                  name="locationEn"
                  value={formData.locationEn}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Sukhbaatar District, Chinggis Avenue"
                />
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Үл хөдлөх хөрөнгийн дэлгэрэнгүй</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Өрөөний тоо *
                </label>
                <div className="relative">
                  <Bed className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="3"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ариун цэврийн өрөө *
                </label>
                <div className="relative">
                  <Bath className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Талбай (м²) *
                </label>
                <div className="relative">
                  <Maximize className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="120"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Зураг</h2>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Зураг оруулах</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Файл сонгох
                </label>
              </div>
              
              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Property ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Тайлбар</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Тайлбар (Монгол)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Үл хөдлөх хөрөнгийн тайлбар..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Тайлбар (Англи)
                </label>
                <textarea
                  name="descriptionEn"
                  value={formData.descriptionEn}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Property description in English..."
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Холбоо барих мэдээлэл</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Эзэмшигч
                </label>
                <input
                  type="text"
                  name="owner"
                  value={formData.owner}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Батбаяр"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Утасны дугаар
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="+976 11 123456"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Илгээж байна...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Үл хөдлөх хөрөнгө нэмэх
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default AddPropertyPage;
