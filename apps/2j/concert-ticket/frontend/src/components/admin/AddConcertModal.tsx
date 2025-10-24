'use client';

import { useState } from 'react';
import { useCreateConcertMutation, useGetArtistsQuery, useCreateArtistMutation } from '../../generated';

interface AddConcertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Концерт нэмэх модал компонент
const AddConcertModal = ({ isOpen, onClose, onSuccess }: AddConcertModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    venue: '',
    date: '',
    time: '',
    isActive: true,
    mainArtistName: '',
    otherArtists: [] as string[],
    image: '',
    ticketCategories: {
      vip: { totalQuantity: 0, unitPrice: 0 },
      regular: { totalQuantity: 0, unitPrice: 0 },
      general: { totalQuantity: 0, unitPrice: 0 }
    }
  });

  const [imageUploadState, setImageUploadState] = useState({
    isUploading: false,
    uploadProgress: 0,
    uploadedImageUrl: ''
  });

  const [createConcert] = useCreateConcertMutation();
  const [createArtist] = useCreateArtistMutation();
  const { data: artistsData, refetch: refetchArtists } = useGetArtistsQuery();

  // Backend-аас Cloudinary тохиргоо авах
  const fetchCloudinaryConfig = async () => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URI?.replace('/api/graphql', '') || 'http://localhost:4000';
    const response = await fetch(`${backendUrl}/api/cloudinary-config`);
    if (!response.ok) {
      throw new Error('Failed to get Cloudinary config');
    }
    return await response.json();
  };

  // Environment variables-аас fallback тохиргоо авах
  const getFallbackConfig = () => ({
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
    uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ticket-booking'
  });

  // Cloudinary тохиргоо авах функц
  const getCloudinaryConfig = async () => {
    try {
      return await fetchCloudinaryConfig();
    } catch (error) {
      console.error('Error fetching Cloudinary config:', error);
      return getFallbackConfig();
    }
  };

  // Cloudinary upload хийх
  const performCloudinaryUpload = async (file: File, config: any) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', config.uploadPreset);
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Cloudinary upload failed: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    return data.secure_url || data.secureUrl;
  };

  // Cloudinary зураг upload функц
  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    try {
      setImageUploadState(prev => ({ ...prev, isUploading: true, uploadProgress: 0 }));
      
      const cloudinaryConfig = await getCloudinaryConfig();
      
      if (!cloudinaryConfig.cloudName) {
        throw new Error('Cloudinary cloud name not configured');
      }

      const imageUrl = await performCloudinaryUpload(file, cloudinaryConfig);
      
      setImageUploadState(prev => ({ 
        ...prev, 
        isUploading: false, 
        uploadProgress: 100, 
        uploadedImageUrl: imageUrl 
      }));
      
      return imageUrl;
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      setImageUploadState(prev => ({ ...prev, isUploading: false, uploadProgress: 0 }));
      alert('Зураг байршуулахад алдаа гарлаа.');
      throw error;
    }
  };

  // Зураг сонгох функц
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Файлын төрөл шалгах
    if (!file.type.startsWith('image/')) {
      alert('Зөвхөн зураг файл сонгоно уу.');
      return;
    }

    // Файлын хэмжээ шалгах (5MB хязгаар)
    if (file.size > 5 * 1024 * 1024) {
      alert('Зурагны хэмжээ 5MB-аас бага байх ёстой.');
      return;
    }

    try {
      const imageUrl = await uploadImageToCloudinary(file);
      setFormData(prev => ({ ...prev, image: imageUrl }));
    } catch (error) {
      console.error('Зураг upload хийхэд алдаа:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  // Уран бүтээлч нэмэх функц
  const addOtherArtist = () => {
    setFormData(prev => ({
      ...prev,
      otherArtists: [...prev.otherArtists, '']
    }));
  };

  // Бусад уран бүтээлч устгах функц
  const removeOtherArtist = (index: number) => {
    setFormData(prev => ({
      ...prev,
      otherArtists: prev.otherArtists.filter((_, i) => i !== index)
    }));
  };

  // Бусад уран бүтээлч нэр өөрчлөх функц
  const updateOtherArtist = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      otherArtists: prev.otherArtists.map((artist, i) => i === index ? value : artist)
    }));
  };

  // Тасалбарын ангилал өөрчлөх функц
  const updateTicketCategory = (category: string, field: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      ticketCategories: {
        ...prev.ticketCategories,
        [category]: {
          ...prev.ticketCategories[category as keyof typeof prev.ticketCategories],
          [field]: value
        }
      }
    }));
  };

  // Одоо байгаа уран бүтээлч олох
  const findExistingArtist = (artistName: string) => {
    const artists = artistsData?.artists || [];
    return artists.find(artist => 
      artist.name.toLowerCase() === artistName.toLowerCase()
    );
  };

  // Шинэ уран бүтээлч үүсгэх
  const createNewArtist = async (artistName: string) => {
    try {
      const result = await createArtist({
        variables: {
          input: {
            name: artistName,
            bio: '',
            image: ''
          }
        }
      });
      
      if (result.data?.createArtist?.id) {
        await refetchArtists();
        return result.data.createArtist.id;
      }
    } catch (error) {
      console.error('Уран бүтээлч үүсгэхэд алдаа:', error);
    }
    return null;
  };

  // Уран бүтээлч олох эсвэл үүсгэх функц
  const findOrCreateArtist = async (artistName: string) => {
    if (!artistName.trim()) return null;

    const existingArtist = findExistingArtist(artistName);
    if (existingArtist) {
      return existingArtist.id;
    }

    return await createNewArtist(artistName);
  };

  // Бусад уран бүтээлчдийн ID-г олох эсвэл үүсгэх
  const processOtherArtists = async () => {
    const otherArtistIds = [];
    for (const artistName of formData.otherArtists) {
      if (artistName.trim()) {
        const artistId = await findOrCreateArtist(artistName);
        if (artistId) {
          otherArtistIds.push(artistId);
        }
      }
    }
    return otherArtistIds;
  };

  // Тасалбарын категориудыг бэлтгэх
  const prepareTicketCategories = () => {
    const ticketCategories = [];
    Object.entries(formData.ticketCategories).forEach(([type, data]) => {
      if (data.totalQuantity > 0 && data.unitPrice > 0) {
        ticketCategories.push({
          type: type.toUpperCase(),
          totalQuantity: data.totalQuantity,
          unitPrice: data.unitPrice,
          description: `${type} тасалбар`,
          features: []
        });
      }
    });
    return ticketCategories;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Үндсэн уран бүтээлч олох эсвэл үүсгэх
      const mainArtistId = await findOrCreateArtist(formData.mainArtistName);
      if (!mainArtistId) {
        alert('Үндсэн уран бүтээлч олох эсвэл үүсгэхэд алдаа гарлаа');
        return;
      }

      const otherArtistIds = await processOtherArtists();
      const ticketCategories = prepareTicketCategories();

      await createConcert({
        variables: {
          input: {
            name: formData.name,
            description: formData.description,
            venue: formData.venue,
            date: formData.date,
            time: formData.time,
            isActive: formData.isActive,
            image: formData.image,
            mainArtistId,
            otherArtistIds,
            ticketCategories
          }
        }
      });

      alert('Концерт амжилттай нэмэгдлээ!');
      onSuccess();
      onClose();
      
      // Form-г цэвэрлэх
      setFormData({
        name: '',
        description: '',
        venue: '',
        date: '',
        time: '',
        isActive: true,
        mainArtistName: '',
        otherArtists: [],
        image: '',
        ticketCategories: {
          vip: { totalQuantity: 0, unitPrice: 0 },
          regular: { totalQuantity: 0, unitPrice: 0 },
          general: { totalQuantity: 0, unitPrice: 0 }
        }
      });
    } catch (error) {
      console.error('Error creating concert:', error);
      const errorMessage = error instanceof Error ? error.message : 'Тодорхойгүй алдаа';
      alert(`Концерт нэмэхэд алдаа гарлаа: ${errorMessage}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-6 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Тасалбар нэмэх</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Концертын мэдээлэл */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">Концертын мэдээлэл</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Тоглолтын нэр <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Нэр оруулах"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Зураг оруулах хэсэг */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Зураг
                </label>
                
                {formData.image ? (
                  <div className="relative">
                    <img 
                      src={formData.image} 
                      alt="Uploaded concert" 
                      className="w-full h-48 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={imageUploadState.isUploading}
                    />
                    <div className={`w-full h-32 border-2 border-dashed rounded-lg flex items-center justify-center ${
                      imageUploadState.isUploading 
                        ? 'border-blue-400 bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}>
                      {imageUploadState.isUploading ? (
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                          <p className="mt-2 text-sm text-blue-600">Зураг байршуулж байна...</p>
                          <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${imageUploadState.uploadProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <svg className="mx-auto h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <p className="mt-2 text-sm text-gray-600">Зураг оруулах</p>
                          <p className="text-xs text-gray-500">PNG, JPG, JPEG (5MB хүртэл)</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Хөтөлбөрийн тухай <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Дэлгэрэнгүй мэдээлэл"
                  rows={4}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Уран бүтээлчийн мэдээлэл */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">Уран бүтээлчийн мэдээлэл</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Үндсэн артистын нэр <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="mainArtistName"
                  value={formData.mainArtistName}
                  onChange={handleInputChange}
                  placeholder="Артистын нэр"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <button
                  type="button"
                  onClick={addOtherArtist}
                  className="flex items-center space-x-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Бусад артист нэмэх</span>
                </button>
              </div>

              {/* Бусад уран бүтээлчдийн жагсаалт */}
              {formData.otherArtists.map((artist, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={artist}
                    onChange={(e) => updateOtherArtist(index, e.target.value)}
                    placeholder="Артистын нэр"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => removeOtherArtist(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Огноо, цагийн мэдээлэл */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">Огноо, цагийн мэдээлэл</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Тоглолтын өдөр сонгох <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Тоглолтын цаг сонгох <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Тасалбарын ангилал */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">Тасалбарын ангилал</h4>
              
              {Object.entries(formData.ticketCategories).map(([category, data]) => (
                <div key={category} className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3 capitalize">{category} <span className="text-red-500">*</span></h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Нийт тоо хэмжээ
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={data.totalQuantity}
                        onChange={(e) => updateTicketCategory(category, 'totalQuantity', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Нэгжийн үнэ
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={data.unitPrice}
                        onChange={(e) => updateTicketCategory(category, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-6">
              <button
                type="submit"
                className="px-6 py-3 text-sm font-medium text-white bg-gray-800 border border-transparent rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Үүсгэх
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddConcertModal;
