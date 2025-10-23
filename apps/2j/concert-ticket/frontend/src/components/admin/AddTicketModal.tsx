'use client';

import { useState, useRef } from 'react';
import { X, Upload } from 'lucide-react';
import { useCreateConcertMutation, useCreateArtistMutation } from '../../generated';

interface AddTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const useAddTicketForm = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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

  return {
    uploadedImage, setUploadedImage,
    isUploading, setIsUploading,
    isSubmitting, setIsSubmitting,
    fileInputRef,
    formData, setFormData,
    createConcert, createLoading,
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

const useImageHandlers = (setUploadedImage: any) => {
  const { uploadImage } = useImageUpload();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Файлын хэмжээ 5MB-аас их байна');
      return;
    }

    try {
      const imageUrl = await uploadImage(file);
      setUploadedImage(imageUrl);
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Зураг upload хийхэд алдаа гарлаа');
    }
  };

  return { handleImageUpload };
};

const useFormValidation = (formData: any) => {
  const validateRequiredFields = () => {
    const requiredFields = ['name', 'venue', 'date', 'time', 'mainArtistName'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      alert('Бүх шаардлагатай талбаруудыг бөглөнө үү');
      return false;
    }
    return true;
  };

  const validateTicketCategories = () => {
    const categories = ['vipQuantity', 'vipPrice', 'regularQuantity', 'regularPrice', 'generalQuantity', 'generalPrice'];
    const missingCategories = categories.filter(category => !formData[category]);
    
    if (missingCategories.length > 0) {
      alert('Бүх тасалбарын ангилалын мэдээллийг бөглөнө үү');
      return false;
    }
    return true;
  };

  const validateForm = () => {
    return validateRequiredFields() && validateTicketCategories();
  };

  return { validateForm };
};

const useFormHandlers = (
  formData: any,
  setFormData: any,
  uploadedImage: string | null,
  setUploadedImage: any,
  fileInputRef: React.RefObject<HTMLInputElement>,
  createConcert: any,
  createArtist: any,
  setIsSubmitting: any,
  onClose: () => void
) => {
  const { handleImageUpload } = useImageHandlers(setUploadedImage);
  const { validateForm } = useFormValidation(formData);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTicketCategoryChange = (type: 'VIP' | 'REGULAR' | 'GENERAL', field: 'quantity' | 'price', value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [`${type.toLowerCase()}Quantity`]: field === 'quantity' ? value : prev[`${type.toLowerCase()}Quantity`],
      [`${type.toLowerCase()}Price`]: field === 'price' ? value : prev[`${type.toLowerCase()}Price`],
    }));
  };

  const createTicketCategories = () => [
    { type: 'VIP' as const, totalQuantity: parseInt(formData.vipQuantity), unitPrice: parseFloat(formData.vipPrice) },
    { type: 'REGULAR' as const, totalQuantity: parseInt(formData.regularQuantity), unitPrice: parseFloat(formData.regularPrice) },
    { type: 'GENERAL' as const, totalQuantity: parseInt(formData.generalQuantity), unitPrice: parseFloat(formData.generalPrice) }
  ];

  const resetForm = () => {
    setFormData({
      name: '', description: '', venue: '', date: '', time: '',
      mainArtistName: '', vipQuantity: '', vipPrice: '',
      regularQuantity: '', regularPrice: '', generalQuantity: '', generalPrice: ''
    });
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const createArtistAndConcert = async () => {
    const ticketCategories = createTicketCategories();

    const { data: artistData } = await createArtist({
      variables: { name: formData.mainArtistName }
    });

    if (!artistData?.createArtist?.id) {
      throw new Error('Артист үүсгэхэд алдаа гарлаа');
    }

    await createConcert({
      variables: {
        input: {
          name: formData.name,
          description: formData.description,
          venue: formData.venue,
          date: formData.date,
          time: formData.time,
          image: uploadedImage || '',
          mainArtistId: artistData.createArtist.id,
          ticketCategories
        }
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await createArtistAndConcert();
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error creating concert:', error);
      alert('Концерт үүсгэхэд алдаа гарлаа. Дахин оролдоно уу.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleImageUpload, handleInputChange, handleTicketCategoryChange, handleSubmit };
};

const AddTicketForm = ({
  uploadedImage,
  isUploading,
  isSubmitting,
  fileInputRef,
  formData,
  handleImageUpload,
  handleInputChange,
  handleTicketCategoryChange,
  handleSubmit,
  onClose
}: {
  uploadedImage: string | null;
  isUploading: boolean;
  isSubmitting: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  formData: any;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputChange: (field: string, value: string) => void;
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
        value={formData.name}
        onChange={(e) => handleInputChange('name', e.target.value)}
        placeholder="Нэр оруулах"
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
    
    <div>
      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Хөтөлбөрийн тухай</label>
      <textarea
        id="description"
        value={formData.description}
        onChange={(e) => handleInputChange('description', e.target.value)}
        placeholder="Дэлгэрэнгүй мэдээлэл"
        rows={4}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      />
    </div>
    
    <div>
      <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-2">Тоглолтын газар*</label>
      <input
        type="text"
        id="venue"
        value={formData.venue}
        onChange={(e) => handleInputChange('venue', e.target.value)}
        placeholder="Газар оруулах"
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">Тоглолтын өдөр сонгох*</label>
        <input
          type="date"
          id="date"
          value={formData.date}
          onChange={(e) => handleInputChange('date', e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">Тоглолтын цаг сонгох*</label>
        <input
          type="time"
          id="time"
          value={formData.time}
          onChange={(e) => handleInputChange('time', e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
    
    <div>
      <label htmlFor="mainArtistName" className="block text-sm font-medium text-gray-700 mb-2">Үндсэн артистын нэр*</label>
      <input
        type="text"
        id="mainArtistName"
        value={formData.mainArtistName}
        onChange={(e) => handleInputChange('mainArtistName', e.target.value)}
        placeholder="Артистын нэр"
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <button type="button" className="mt-2 text-blue-600 text-sm hover:text-blue-800">Бусад артист нэмэх +</button>
    </div>
    
    <div>
      <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">Зураг</label>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      <div
        onClick={() => fileInputRef.current?.click()}
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
    
    <div className="space-y-4">
      <h4 className="text-lg font-medium text-gray-900">Тасалбарын ангилал</h4>
      
      <div className="border border-gray-200 rounded-lg p-4">
        <h5 className="font-medium text-gray-900 mb-3">VIP*</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="number"
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
        Үүсгэх
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

const AddTicketModal = ({ isOpen, onClose }: AddTicketModalProps) => {
  const {
    uploadedImage, setUploadedImage,
    isUploading,
    isSubmitting, setIsSubmitting,
    fileInputRef,
    formData, setFormData,
    createConcert,
    createArtist
  } = useAddTicketForm();

  const { handleImageUpload, handleInputChange, handleTicketCategoryChange, handleSubmit } = useFormHandlers(
    formData,
    setFormData,
    uploadedImage,
    setUploadedImage,
    fileInputRef,
    createConcert,
    createArtist,
    setIsSubmitting,
    onClose
  );

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
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Тасалбар нэмэх</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <AddTicketForm
          uploadedImage={uploadedImage}
          isUploading={isUploading}
          isSubmitting={isSubmitting}
          fileInputRef={fileInputRef}
          formData={formData}
          handleImageUpload={handleImageUpload}
          handleInputChange={handleInputChange}
          handleTicketCategoryChange={handleTicketCategoryChange}
          handleSubmit={handleSubmit}
          onClose={handleClose}
        />
      </div>
    </div>
  );
};

export default AddTicketModal;