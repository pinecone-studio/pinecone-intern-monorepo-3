import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PropertyImagesProps {
  images: string[];
  title: string;
}

const PropertyImages = ({ images, title }: PropertyImagesProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative">
      <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
        <Image
          src={images[currentImageIndex]}
          alt={`${title} - зураг ${currentImageIndex + 1}`}
          fill
          className="object-cover"
        />
      </div>
      
      {images.length > 1 && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={prevImage}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={nextImage}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PropertyImages;
