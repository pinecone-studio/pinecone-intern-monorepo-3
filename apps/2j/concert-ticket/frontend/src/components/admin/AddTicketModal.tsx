'use client';

import { useState, useRef } from 'react';
import { X, Upload } from 'lucide-react';
import { useCreateConcertMutation, useCreateArtistMutation } from '../../generated';

interface AddTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddTicketModal = ({ isOpen, onClose }: AddTicketModalProps) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    venue: '',
    date: '',
    time: '',
    mainArtistName: '',
    vipQuantity: '',
    vipPrice: '',
    regularQuantity: '',
    regularPrice: '',
    generalQuantity: '',
    generalPrice: ''
  });

  const [createConcert, { loading: createLoading }] = useCreateConcertMutation();
  const [createArtist, { loading: createArtistLoading }] = useCreateArtistMutation();

  // Upload function using direct Cloudinary upload
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default'); // Use default unsigned preset
    
    try {
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/ddtytj1hq/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Зөвхөн зураг файл оруулна уу');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Зурагны хэмжээ 5MB-аас бага байх ёстой');
      return;
    }

    setIsUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      setUploadedImage(imageUrl);
    } catch (error) {
      alert('Зураг upload хийхэд алдаа гарлаа: ' + (error as Error).message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    setUploadedImage(null);
    setFormData({
      name: '',
      description: '',
      venue: '',
      date: '',
      time: '',
      mainArtistName: '',
      vipQuantity: '',
      vipPrice: '',
      regularQuantity: '',
      regularPrice: '',
      generalQuantity: '',
      generalPrice: ''
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.venue || !formData.date || !formData.time || !formData.mainArtistName) {
      alert('Бүх шаардлагатай талбаруудыг бөглөнө үү');
      return;
    }

    // Validate ticket categories
    if (!formData.vipQuantity || !formData.vipPrice || 
        !formData.regularQuantity || !formData.regularPrice || 
        !formData.generalQuantity || !formData.generalPrice) {
      alert('Бүх тасалбарын ангилалын мэдээллийг бөглөнө үү');
      return;
    }

    setIsSubmitting(true);
    try {
      // Create ticket categories
      const ticketCategories = [
        {
          type: 'VIP' as const,
          totalQuantity: parseInt(formData.vipQuantity),
          unitPrice: parseFloat(formData.vipPrice)
        },
        {
          type: 'REGULAR' as const,
          totalQuantity: parseInt(formData.regularQuantity),
          unitPrice: parseFloat(formData.regularPrice)
        },
        {
          type: 'GENERAL_ADMISSION' as const,
          totalQuantity: parseInt(formData.generalQuantity),
          unitPrice: parseFloat(formData.generalPrice)
        }
      ];

      // Create or find artist
      let mainArtistId: string;
      
      try {
        // First try to create a new artist with the provided name
        const artistResult = await createArtist({
          variables: {
            input: {
              name: formData.mainArtistName,
              bio: `Artist for ${formData.name} concert`,
              image: null
            }
          }
        });
        
        mainArtistId = artistResult.data?.createArtist?.id || '';
        
        if (!mainArtistId) {
          throw new Error('Artist үүсгэхэд алдаа гарлаа');
        }
      } catch (error) {
        console.error('Error creating artist:', error);
        // If artist creation fails, use a fallback artist ID
        mainArtistId = '68e75deab6cd9759bc4033de'; // ThunderZ artist ID as fallback
      }

      const input = {
        name: formData.name,
        description: formData.description,
        venue: formData.venue,
        date: formData.date,
        time: formData.time,
        mainArtistId,
        image: uploadedImage,
        ticketCategories
      };

      await createConcert({
        variables: { input }
      });

      alert('Концерт амжилттай үүсгэгдлээ!');
      handleClose();
    } catch (error) {
      console.error('Error creating concert:', error);
      alert('Концерт үүсгэхэд алдаа гарлаа');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">
            Тасалбар нэмэх
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Performance Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Тоглолтын нэр*
            </label>
            <input
              type="text"
              placeholder="Нэр оруулах"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Зураг
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <div 
              onClick={handleImageClick}
              className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors relative overflow-hidden"
            >
              {uploadedImage ? (
                <div className="relative w-full h-full">
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded" 
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage();
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  {isUploading ? (
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                      <p className="text-gray-600">Upload хийж байна...</p>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Upload className="w-6 h-6 text-blue-600" />
                      </div>
                      <p className="text-gray-600">Зураг оруулах</p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG, GIF (5MB хүртэл)</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Venue */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Тоглолтын газар*
            </label>
            <input
              type="text"
              placeholder="Газар оруулах"
              value={formData.venue}
              onChange={(e) => handleInputChange('venue', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* About the Program */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Хөтөлбөрийн тухай
            </label>
            <textarea
              placeholder="Дэлгэрэнгүй мэдээлэл"
              rows={4}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Main Artist */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Үндсэн артистын нэр*
            </label>
            <input
              type="text"
              placeholder="Артистын нэр"
              value={formData.mainArtistName}
              onChange={(e) => handleInputChange('mainArtistName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <button type="button" className="mt-2 text-blue-600 text-sm hover:text-blue-800">
              Бусад артист нэмэх +
            </button>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тоглолтын өдөр сонгох*
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тоглолтын цаг сонгох*
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Ticket Categories */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900">Тасалбарын ангилал</h4>
            
            {/* VIP */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-3">VIP*</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="number"
                    placeholder="Нийт тоо хэмжээ"
                    value={formData.vipQuantity}
                    onChange={(e) => handleInputChange('vipQuantity', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Нэгжийн үнэ"
                    value={formData.vipPrice}
                    onChange={(e) => handleInputChange('vipPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Regular */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-3">Regular*</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="number"
                    placeholder="Нийт тоо хэмжээ"
                    value={formData.regularQuantity}
                    onChange={(e) => handleInputChange('regularQuantity', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Нэгжийн үнэ"
                    value={formData.regularPrice}
                    onChange={(e) => handleInputChange('regularPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* General Admission */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-3">Задгай*</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="number"
                    placeholder="Нийт тоо хэмжээ"
                    value={formData.generalQuantity}
                    onChange={(e) => handleInputChange('generalQuantity', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Нэгжийн үнэ"
                    value={formData.generalPrice}
                    onChange={(e) => handleInputChange('generalPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button 
              type="submit"
              disabled={isSubmitting || createLoading || createArtistLoading}
              className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting || createLoading || createArtistLoading ? 'Үүсгэж байна...' : 'Үүсгэх'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTicketModal;
