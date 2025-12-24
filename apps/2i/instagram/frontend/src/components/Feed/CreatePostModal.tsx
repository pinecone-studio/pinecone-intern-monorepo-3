'use client';
import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useCreatePostMutation, GetPostsDocument } from '@/generated';
import { SquarePlus, ArrowLeft, ChevronLeft, ChevronRight, X, Smile } from 'lucide-react';

type CreatePostModalProps = {
  isCollapsed: boolean;
};

export const CreatePostModal = ({ isCollapsed }: CreatePostModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [step, setStep] = useState(1); // 1: select, 2: crop, 3: caption

  const [createPost] = useCreatePostMutation({
    refetchQueries: [{ query: GetPostsDocument }],
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            newImages.push(event.target.result as string);
            if (newImages.length === files.length) {
              setImages((prev) => [...prev, ...newImages]);
              setStep(2);
            }
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    if (currentImageIndex >= images.length - 1) {
      setCurrentImageIndex(Math.max(0, currentImageIndex - 1));
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    if (step === 2) {
      setStep(3);
    }
  };

  const handleSubmit = async () => {
    if (images.length === 0) return;

    try {
      setIsUploading(true);
      await createPost({
        variables: {
          input: {
            images,
            caption,
          },
        },
      });
      setImages([]);
      setCaption('');
      setCurrentImageIndex(0);
      setStep(1);
      setIsOpen(false);
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleBack = () => {
    if (step === 3) {
      setStep(2);
    } else if (step === 2) {
      setStep(1);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center h-12 cursor-pointer hover:text-pink-500">
          <SquarePlus />
          {!isCollapsed && <p className="pl-4 text-sm">Create</p>}
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh] p-0">
        <div className="flex h-full">
          {/* Left side - Image area */}
          <div className="flex-1 bg-gray-100 flex items-center justify-center relative">
            {step === 1 ? (
              // Step 1: Select images - Instagram style
              <div className="text-center">
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
                <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center space-y-6">
                  {/* Instagram style icons */}
                  <div className="relative">
                    {/* Photo icon */}
                    <div className="w-20 h-20 bg-black rounded-lg flex items-center justify-center relative">
                      <div className="w-16 h-16 bg-white rounded flex items-center justify-center">
                        <div className="w-12 h-12 relative">
                          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-yellow-400 rounded-full"></div>
                          <div className="absolute bottom-0 left-0 right-0 h-6 bg-gray-300 rounded-b flex items-end">
                            <div className="w-full h-4 bg-gray-400 rounded-b"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Video icon - overlapped */}
                    <div className="absolute -top-2 -right-2 w-20 h-20 bg-black rounded-lg flex items-center justify-center">
                      <div className="w-16 h-16 bg-white rounded flex items-center justify-center">
                        <div className="w-0 h-0 border-l-[12px] border-l-gray-600 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-lg font-medium">Drag photos and videos here</p>

                  <Button type="button" variant="outline" size="lg" className="bg-blue-500 hover:bg-blue-600 text-white border-blue-500">
                    Select from computer
                  </Button>
                </label>
              </div>
            ) : step === 2 ? (
              // Step 2: Crop/Edit - Instagram style
              <div className="relative w-full h-full">
                <img src={images[currentImageIndex]} alt={`Post image ${currentImageIndex + 1}`} className="w-full h-full object-cover" />

                {/* Navigation arrows */}
                {images.length > 1 && (
                  <>
                    <button onClick={prevImage} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70">
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button onClick={nextImage} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70">
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Image counter */}
                {images.length > 1 && (
                  <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                )}

                {/* Remove image button */}
                <button onClick={() => removeImage(currentImageIndex)} className="absolute top-4 left-4 bg-red-500 text-white rounded-full p-2 hover:bg-red-600">
                  <X className="w-4 h-4" />
                </button>

                {/* Bottom right preview - Instagram style */}
                <div className="absolute bottom-4 right-4 bg-black rounded-lg p-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden">
                      <img src={images[currentImageIndex]} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <button className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white">
                      <X className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white">
                      <SquarePlus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Step 3: Caption - Instagram style
              <div className="relative w-full h-full">
                <img src={images[currentImageIndex]} alt={`Post image ${currentImageIndex + 1}`} className="w-full h-full object-cover" />

                {/* Navigation arrows */}
                {images.length > 1 && (
                  <>
                    <button onClick={prevImage} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70">
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button onClick={nextImage} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70">
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Image counter */}
                {images.length > 1 && (
                  <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right side - Post details (only show in step 3) - Instagram style */}
          {step === 3 && (
            <div className="w-80 border-l border-gray-200 flex flex-col bg-white">
              {/* Header - Instagram style */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <button onClick={handleBack} className="p-1 hover:bg-gray-100 rounded-full">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="font-semibold text-lg">Create new post</h2>
                <Button onClick={handleSubmit} disabled={images.length === 0 || isUploading} size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                  {isUploading ? 'Sharing...' : 'Share'}
                </Button>
              </div>

              {/* User info - Instagram style */}
              <div className="flex items-center p-4 border-b border-gray-200">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">U</div>
                <span className="ml-3 font-semibold text-sm">defavours</span>
              </div>

              {/* Caption input - Instagram style */}
              <div className="flex-1 p-4">
                <Textarea
                  placeholder="Write a caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="border-0 resize-none focus:ring-0 text-sm min-h-[200px] placeholder-gray-500"
                  maxLength={2200}
                />

                {/* Character counter - Instagram style */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center">
                    <Smile className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="text-right text-gray-400 text-xs">{caption.length}/2,200</div>
                </div>
              </div>

              {/* Image thumbnails - Instagram style */}
              {images.length > 1 && (
                <div className="p-4 border-t border-gray-200">
                  <div className="flex space-x-2 overflow-x-auto">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'}`}
                      >
                        <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2 header - Crop step - Instagram style */}
          {step === 2 && (
            <div className="absolute top-0 left-0 right-0 bg-white bg-opacity-90 backdrop-blur-sm p-4 flex items-center justify-between z-10">
              <button onClick={handleBack} className="p-1 hover:bg-gray-100 rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="font-semibold text-lg">Crop</h2>
              <Button onClick={handleNext} size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                Next
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
