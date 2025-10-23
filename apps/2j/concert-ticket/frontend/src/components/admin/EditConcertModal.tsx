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
  mainArtist: {
    id: string;
    name: string;
  };
  otherArtists: Array<{
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
  concert: Concert;
}

const useEditConcertForm = (concert: Concert) => {
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

  const [updateConcert, { loading: updateLoading }] = useUpdateConcertMutation();
  const [createArtist, { loading: createArtistLoading }] = useCreateArtistMutation();

  const getTicketCategoryValue = (type: string, field: 'totalQuantity' | 'unitPrice') => {
    const category = concert.ticketCategories.find(cat => cat.type === type);
    return String(category?.[field] || '');
  };

  useEffect(() => {
    if (concert) {
      setFormData({
        name: concert.name,
        description: concert.description || '',
        venue: concert.venue,
        date: concert.date,
        time: concert.time,
        mainArtistName: concert.mainArtist?.name || '',
        vipQuantity: getTicketCategoryValue('VIP', 'totalQuantity'),
        vipPrice: getTicketCategoryValue('VIP', 'unitPrice'),
        regularQuantity: getTicketCategoryValue('REGULAR', 'totalQuantity'),
        regularPrice: getTicketCategoryValue('REGULAR', 'unitPrice'),
        generalQuantity: getTicketCategoryValue('GENERAL', 'totalQuantity'),
        generalPrice: getTicketCategoryValue('GENERAL', 'unitPrice')
      });
      setUploadedImage(concert.image || '');
    }
  }, [concert]);

  return {
    formData, setFormData,
    uploadedImage, setUploadedImage,
    isUploading, setIsUploading,
    isSubmitting, setIsSubmitting,
    updateConcert, updateLoading,
    createArtist, createArtistLoading
  };
};

const useImageUpload = () => {
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default');
    
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
        throw new Error(`Upload failed: ${errorText}`);
      }
      
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  return { uploadImage };
};

const useFormHandlers = (
  concert: Concert,
  formData: any,
  setFormData: any,
  uploadedImage: string,
  setUploadedImage: any,
  setIsUploading: any,
  updateConcert: any,
  createArtist: any,
  setIsSubmitting: any,
  onClose: () => void
) => {
  const { uploadImage } = useImageUpload();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Файлын хэмжээ 5MB-аас их байна');
      return;
    }

    setIsUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      setUploadedImage(imageUrl);
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Зураг upload хийхэд алдаа гарлаа');
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleTicketCategoryChange = (type: 'VIP' | 'REGULAR' | 'GENERAL', field: 'quantity' | 'price', value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [`${type.toLowerCase()}Quantity`]: field === 'quantity' ? value : prev[`${type.toLowerCase()}Quantity`],
      [`${type.toLowerCase()}Price`]: field === 'price' ? value : prev[`${type.toLowerCase()}Price`],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const imageUrl = uploadedImage;
      
      const ticketCategories = [
        { type: 'VIP', totalQuantity: Number(formData.vipQuantity), unitPrice: Number(formData.vipPrice) },
        { type: 'REGULAR', totalQuantity: Number(formData.regularQuantity), unitPrice: Number(formData.regularPrice) },
        { type: 'GENERAL', totalQuantity: Number(formData.generalQuantity), unitPrice: Number(formData.generalPrice) },
      ];

      let mainArtistId = concert.mainArtist?.id;
      if (formData.mainArtistName !== concert.mainArtist?.name) {
        const { data: artistData } = await createArtist({
          variables: { name: formData.mainArtistName },
        });
        mainArtistId = artistData?.createArtist?.id;
      }

      await updateConcert({
        variables: {
          id: concert.id,
          input: {
            name: formData.name,
            description: formData.description,
            venue: formData.venue,
            date: formData.date,
            time: formData.time,
            image: imageUrl,
            mainArtistId: mainArtistId,
            ticketCategories,
          },
        },
      });
      onClose();
    } catch (error) {
      console.error('Error updating concert:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleImageUpload, handleChange, handleTicketCategoryChange, handleSubmit };
};

const EditConcertForm = ({
  formData,
  uploadedImage,
  isUploading,
  isSubmitting,
  handleImageUpload,
  handleChange,
  handleTicketCategoryChange,
  handleSubmit,
  onClose
}: {
  formData: any;
  uploadedImage: string;
  isUploading: boolean;
  isSubmitting: boolean;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleTicketCategoryChange: (type: 'VIP' | 'REGULAR' | 'GENERAL', field: 'quantity' | 'price', value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}) => (
  <form onSubmit={handleSubmit} className="p-6 space-y-6">
    <div>
      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Тоглолтын нэр*</label>
      <input
        type="text"
        id="name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Нэр оруулах"
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
    
    <div>
      <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">Зураг</label>
      <input
        id="image"
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      <div
        onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
        className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors relative overflow-hidden"
      >
        {uploadedImage ? (
          <img src={uploadedImage} alt="Uploaded" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Upload className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-gray-600">Зураг оруулах</p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG, GIF (5MB хүртэл)</p>
          </div>
        )}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
          </div>
        )}
      </div>
    </div>
    
    <div>
      <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-2">Тоглолтын газар*</label>
      <input
        type="text"
        id="venue"
        name="venue"
        value={formData.venue}
        onChange={handleChange}
        placeholder="Газар оруулах"
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
    
    <div>
      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Хөтөлбөрийн тухай*</label>
      <textarea
        id="description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Дэлгэрэнгүй мэдээлэл"
        rows={4}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      />
    </div>
    
    <div>
      <label htmlFor="mainArtistName" className="block text-sm font-medium text-gray-700 mb-2">Үндсэн артистын нэр*</label>
      <input
        type="text"
        id="mainArtistName"
        name="mainArtistName"
        value={formData.mainArtistName}
        onChange={handleChange}
        placeholder="Артистын нэр"
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <button type="button" className="mt-2 text-blue-600 text-sm hover:text-blue-800">Бусад артист нэмэх +</button>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">Тоглолтын өдөр сонгох*</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">Тоглолтын цаг сонгох*</label>
        <input
          type="time"
          id="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
    
    <div className="space-y-4">
      <h4 className="text-lg font-medium text-gray-900">Тасалбарын ангилал</h4>
      
      <div className="border border-gray-200 rounded-lg p-4">
        <h5 className="font-medium text-gray-900 mb-3">VIP*</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="number"
              name="vipQuantity"
              value={formData.vipQuantity}
              onChange={(e) => handleTicketCategoryChange('VIP', 'quantity', e.target.value)}
              placeholder="Нийт тоо хэмжээ"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <input
              type="number"
              name="vipPrice"
              value={formData.vipPrice}
              onChange={(e) => handleTicketCategoryChange('VIP', 'price', e.target.value)}
              placeholder="Нэгжийн үнэ"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
      
      <div className="border border-gray-200 rounded-lg p-4">
        <h5 className="font-medium text-gray-900 mb-3">Regular*</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="number"
              name="regularQuantity"
              value={formData.regularQuantity}
              onChange={(e) => handleTicketCategoryChange('REGULAR', 'quantity', e.target.value)}
              placeholder="Нийт тоо хэмжээ"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <input
              type="number"
              name="regularPrice"
              value={formData.regularPrice}
              onChange={(e) => handleTicketCategoryChange('REGULAR', 'price', e.target.value)}
              placeholder="Нэгжийн үнэ"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
      
      <div className="border border-gray-200 rounded-lg p-4">
        <h5 className="font-medium text-gray-900 mb-3">Задгай*</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="number"
              name="generalQuantity"
              value={formData.generalQuantity}
              onChange={(e) => handleTicketCategoryChange('GENERAL', 'quantity', e.target.value)}
              placeholder="Нийт тоо хэмжээ"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <input
              type="number"
              name="generalPrice"
              value={formData.generalPrice}
              onChange={(e) => handleTicketCategoryChange('GENERAL', 'price', e.target.value)}
              placeholder="Нэгжийн үнэ"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
    
    <div className="pt-4">
      <button
        type="submit"
        disabled={isSubmitting || isUploading}
        className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Шинэчлэх
      </button>
    </div>
    
    <div className="pt-4">
      <button
        type="button"
        onClick={onClose}
        className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
      >
        Цуцлах
      </button>
    </div>
  </form>
);

const EditConcertModal = ({ isOpen, onClose, concert }: EditConcertModalProps) => {
  const {
    formData, setFormData,
    uploadedImage, setUploadedImage,
    isUploading, setIsUploading,
    isSubmitting, setIsSubmitting,
    updateConcert,
    createArtist
  } = useEditConcertForm(concert);

  const { handleImageUpload, handleChange, handleTicketCategoryChange, handleSubmit } = useFormHandlers(
    concert,
    formData,
    setFormData,
    uploadedImage,
    setUploadedImage,
    setIsUploading,
    updateConcert,
    createArtist,
    setIsSubmitting,
    onClose
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Тасалбар засах</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <EditConcertForm
          formData={formData}
          uploadedImage={uploadedImage}
          isUploading={isUploading}
          isSubmitting={isSubmitting}
          handleImageUpload={handleImageUpload}
          handleChange={handleChange}
          handleTicketCategoryChange={handleTicketCategoryChange}
          handleSubmit={handleSubmit}
          onClose={onClose}
        />
      </div>
    </div>
  );
};

export default EditConcertModal;