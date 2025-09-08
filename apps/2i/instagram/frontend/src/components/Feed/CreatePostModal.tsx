'use client';

import { useState } from 'react';
import { useCreatePostMutation } from '@/generated';
import { X, Image as ImageIcon, XCircle } from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

export const CreatePostModal = ({ isOpen, onClose, onPostCreated }: CreatePostModalProps) => {
  const [images, setImages] = useState<string[]>([]);
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [createPost] = useCreatePostMutation();

  if (!isOpen) return null;

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsUploading(true);
    const newImages: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Simulate Cloudinary upload - replace with actual Cloudinary upload
      const mockUrl = URL.createObjectURL(file);
      newImages.push(mockUrl);
    }

    setImages((prev) => [...prev, ...newImages]);
    setIsUploading(false);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) return;

    try {
      await createPost({
        variables: {
          input: {
            images,
            caption: caption.trim() || undefined,
          },
        },
      });

      setImages([]);
      setCaption('');
      onPostCreated();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Create new post</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex">
            {/* Left side - Images */}
            <div className="flex-1 p-4">
              {images.length === 0 ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Drag photos and videos here</p>
                  <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600">
                    Select from computer
                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img src={image} alt={`Upload ${index + 1}`} className="w-full aspect-square object-cover rounded" />
                        <button type="button" onClick={() => removeImage(index)} className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1">
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600 inline-block">
                    Add more photos
                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              )}
            </div>

            {/* Right side - Caption */}
            <div className="w-80 border-l p-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 text-sm">U</span>
                </div>
                <span className="font-semibold text-sm">username</span>
              </div>

              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a caption..."
                className="w-full h-32 resize-none border-none outline-none text-sm"
                maxLength={2200}
              />

              <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                <span>{caption.length}/2,200</span>
                <span>😊</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t p-4 flex justify-end">
            <button
              type="submit"
              disabled={images.length === 0 || isUploading}
              className="bg-blue-500 text-white px-6 py-2 rounded font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : 'Share'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
