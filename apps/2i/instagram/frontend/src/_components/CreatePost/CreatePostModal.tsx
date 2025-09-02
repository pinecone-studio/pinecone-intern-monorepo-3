'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

export const CreatePostModal = ({ isOpen, onClose, onPostCreated }: CreatePostModalProps) => {
  const [step, setStep] = useState<'upload' | 'caption'>('upload');
  const [images, setImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [caption, setCaption] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // GraphQL mutation
  const [createPost] = useMutation(gql`
    mutation CreatePost($input: CreatePostInput!) {
      createPost(input: $input) {
        id
        images
        caption
        user {
          id
          username
          fullname
          profilePicture
        }
        createdAt
      }
    }
  `);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newImages.push(e.target.result as string);
            if (newImages.length === files.length) {
              setImages((prev) => [...prev, ...newImages]);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files) {
      const newImages: string[] = [];
      Array.from(files).forEach((file) => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              newImages.push(e.target.result as string);
              if (newImages.length === files.length) {
                setImages((prev) => [...prev, ...newImages]);
              }
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const handleNext = () => {
    if (images.length > 0) {
      setStep('caption');
    }
  };

  const handleBack = () => {
    setStep('upload');
  };

  // Cloudinary upload функц
  const uploadImageToCloudinary = async (imageDataUrl: string): Promise<string | null> => {
    try {
      // Data URL-г File object болгох
      const response = await fetch(imageDataUrl);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append('file', blob);
      formData.append('upload_preset', 'food-delivery');

      const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/dip9rajob/image/upload`, { method: 'POST', body: formData });

      const result = await uploadResponse.json();
      return result.secure_url;
    } catch (error) {
      console.error('Image upload error:', error);
      return null;
    }
  };

  const handleShare = async () => {
    if (images.length === 0) return;

    setIsLoading(true);
    try {
      console.log('Uploading images to Cloudinary...');

      // Бүх зургийг Cloudinary-д upload хийх
      const uploadPromises = images.map((imageDataUrl) => uploadImageToCloudinary(imageDataUrl));
      const uploadedUrls = await Promise.all(uploadPromises);

      // Upload амжилтгүй болсон зургуудыг шүүх
      const validUrls = uploadedUrls.filter((url) => url !== null) as string[];

      if (validUrls.length === 0) {
        throw new Error('Failed to upload images');
      }

      console.log('Creating post with uploaded images:', validUrls);

      const result = await createPost({
        variables: {
          input: {
            images: validUrls, // Cloudinary URL-ууд
            caption: caption.trim(),
          },
        },
      });

      console.log('Post created successfully:', result);

      // Show success message briefly before closing
      setShowSuccess(true);
      setTimeout(() => {
        onPostCreated();
        onClose();
        setImages([]);
        setCurrentImageIndex(0);
        setCaption('');
        setStep('upload');
        setShowSuccess(false);
      }, 1000);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setImages([]);
      setCurrentImageIndex(0);
      setCaption('');
      setStep('upload');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
          <h2 className="text-lg font-semibold">Create new post</h2>
          {step === 'caption' && (
            <button onClick={handleShare} disabled={isLoading} className="text-blue-500 font-semibold hover:text-blue-600 disabled:opacity-50">
              {isLoading ? 'Uploading...' : showSuccess ? 'Posted!' : 'Share'}
            </button>
          )}
        </div>

        <div className="flex-1 flex">
          {/* Left side - Image preview */}
          <div className="flex-1 bg-gray-50 flex items-center justify-center">
            {step === 'upload' ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-8" onDragOver={handleDragOver} onDrop={handleDrop}>
                {images.length === 0 ? (
                  <div className="text-center">
                    <div className="mb-4">
                      <ImageIcon size={48} className="mx-auto text-gray-400" />
                    </div>
                    <p className="text-lg font-medium mb-2">Drag photos and videos here</p>
                    <button onClick={() => fileInputRef.current?.click()} className="bg-blue-500 text-white px-4 py-2 rounded font-medium hover:bg-blue-600">
                      Select from computer
                    </button>
                    <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col">
                    <div className="flex-1 grid grid-cols-2 gap-2 p-4 overflow-y-auto">
                      {images.map((image, index) => (
                        <div key={index} className="relative aspect-square">
                          <img src={image} alt={`Upload ${index + 1}`} className="w-full h-full object-cover rounded" />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-opacity-70"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 border-t">
                      <button onClick={handleNext} className="w-full bg-blue-500 text-white py-2 rounded font-medium hover:bg-blue-600">
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center p-4 relative">
                <img src={images[currentImageIndex]} alt="Post preview" className="max-w-full max-h-full object-contain" />

                {/* Navigation arrows for multiple images */}
                {images.length > 1 && (
                  <>
                    {currentImageIndex > 0 && (
                      <button
                        onClick={() => setCurrentImageIndex(currentImageIndex - 1)}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70"
                      >
                        ‹
                      </button>
                    )}
                    {currentImageIndex < images.length - 1 && (
                      <button
                        onClick={() => setCurrentImageIndex(currentImageIndex + 1)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70"
                      >
                        ›
                      </button>
                    )}

                    {/* Image indicators */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {images.map((_, index) => (
                        <div key={index} className={`w-2 h-2 rounded-full transition-colors ${index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'}`} />
                      ))}
                    </div>

                    {/* Image counter */}
                    <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                      {currentImageIndex + 1} of {images.length}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right side - Caption */}
          {step === 'caption' && (
            <div className="w-80 border-l bg-white">
              <div className="p-4">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-pink-400 rounded-full flex items-center justify-center text-white text-sm font-medium">U</div>
                  <span className="ml-3 font-medium">username</span>
                </div>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write a caption..."
                  className="w-full h-32 border-none resize-none outline-none text-sm"
                  maxLength={2200}
                />
                <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                  <span>😊</span>
                  <span>{caption.length}/2,200</span>
                </div>
                <button onClick={handleBack} className="w-full mt-4 text-gray-500 hover:text-gray-700">
                  Back
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
