'use client';

import { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { useUpdateConcertMutation, useCreateArtistMutation } from '../../generated';

interface Concert {
  id: string;
  name: string;
  description: string;
  venue: string;
  date: string;
  time: string;
  image?: string;
  mainArtist?: {
    id: string;
    name: string;
  };
  otherArtists?: Array<{
    id: string;
    name: string;
  }>;
  ticketCategories: Array<{
    id: string;
    type: string;
    totalQuantity: number;
    unitPrice: number;
  }>;
}

interface EditConcertModalProps {
  isOpen: boolean;
  onClose: () => void;
  concert: Concert | null;
}

const EditConcertModal = ({ isOpen, onClose, concert }: EditConcertModalProps) => {
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

  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileInputRef] = useState<HTMLInputElement | null>(null);

  const [updateConcert, { loading: updateLoading }] = useUpdateConcertMutation();
  const [createArtist, { loading: createArtistLoading }] = useCreateArtistMutation();

  // Concert data-г form-д оруулах
  useEffect(() => {
    if (concert) {
      setFormData({
        name: concert.name || '',
        description: concert.description || '',
        venue: concert.venue || '',
        date: concert.date ? concert.date.split('T')[0] : '',
        time: concert.time || '',
        mainArtistName: concert.mainArtist?.name || '',
        vipQuantity: concert.ticketCategories.find(cat => cat.type === 'VIP')?.totalQuantity.toString() || '',
        vipPrice: concert.ticketCategories.find(cat => cat.type === 'VIP')?.unitPrice.toString() || '',
        regularQuantity: concert.ticketCategories.find(cat => cat.type === 'REGULAR')?.totalQuantity.toString() || '',
        regularPrice: concert.ticketCategories.find(cat => cat.type === 'REGULAR')?.unitPrice.toString() || '',
        generalQuantity: concert.ticketCategories.find(cat => cat.type === 'GENERAL_ADMISSION')?.totalQuantity.toString() || '',
        generalPrice: concert.ticketCategories.find(cat => cat.type === 'GENERAL_ADMISSION')?.unitPrice.toString() || ''
      });
      setUploadedImage(concert.image || '');
    }
  }, [concert]);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      setUploadedImage(imageUrl);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Зураг upload хийхэд алдаа гарлаа');
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = handleImageUpload;
    input.click();
  };

  const removeImage = () => {
    setUploadedImage('');
  };

  const handleClose = () => {
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
    setUploadedImage('');
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!concert) return;

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
        // If artist creation fails, use existing artist ID or fallback
        mainArtistId = concert.mainArtist?.id || '68e75deab6cd9759bc4033de';
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

      await updateConcert({
        variables: { 
          id: concert.id,
          input 
        }
      });

      alert('Концерт амжилттай шинэчлэгдлээ!');
      handleClose();
    } catch (error) {
      console.error('Error updating concert:', error);
      alert('Концерт шинэчлэхэд алдаа гарлаа');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !concert) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Тасалбар засах</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Concert Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Тоглолтын нэр*
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Нэр оруулах"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Хөтөлбөрийн тухай*
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Дэлгэрэнгүй мэдээлэл"
              required
            />
          </div>

          {/* Main Artist */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Үндсэн артистын нэр*
            </label>
            <input
              type="text"
              name="mainArtistName"
              value={formData.mainArtistName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Артистын нэр"
              required
            />
          </div>

          {/* Other Artists Button */}
          <div className="flex justify-end">
            <button
              type="button"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Бусад артист нэмэх +
            </button>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Тоглолтын өдөр сонгох*
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Тоглолтын цаг сонгох*
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Venue */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Тоглолтын газар*
            </label>
            <input
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Газар"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Зураг
            </label>
            {uploadedImage ? (
              <div className="relative">
                <img
                  src={uploadedImage}
                  alt="Uploaded"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={handleImageClick}
                className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400"
              >
                <div className="text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Зураг оруулах</p>
                </div>
              </div>
            )}
            {isUploading && (
              <p className="text-sm text-blue-600 mt-1">Зураг upload хийж байна...</p>
            )}
          </div>

          {/* Ticket Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Тасалбарын ангилал</h3>
            
            {/* VIP */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  VIP*
                </label>
                <input
                  type="number"
                  name="vipQuantity"
                  value={formData.vipQuantity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Нийт тоо хэмжээ"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  VIP үнэ*
                </label>
                <input
                  type="number"
                  name="vipPrice"
                  value={formData.vipPrice}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Үнэ"
                  required
                />
              </div>
            </div>

            {/* Regular */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Regular*
                </label>
                <input
                  type="number"
                  name="regularQuantity"
                  value={formData.regularQuantity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Нийт тоо хэмжээ"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Regular үнэ*
                </label>
                <input
                  type="number"
                  name="regularPrice"
                  value={formData.regularPrice}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Үнэ"
                  required
                />
              </div>
            </div>

            {/* General */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Задгай*
                </label>
                <input
                  type="number"
                  name="generalQuantity"
                  value={formData.generalQuantity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Нийт тоо хэмжээ"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Задгай үнэ*
                </label>
                <input
                  type="number"
                  name="generalPrice"
                  value={formData.generalPrice}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Үнэ"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button 
              type="submit"
              disabled={isSubmitting || updateLoading || createArtistLoading}
              className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting || updateLoading || createArtistLoading ? 'Шинэчлэж байна...' : 'Шинэчлэх'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditConcertModal;
