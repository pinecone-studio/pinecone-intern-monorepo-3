'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ImageOff, Plus } from 'lucide-react';
import Image from 'next/image';
import { useUpload } from '@/components/providers';

export const DetailImage = ({ hotelId }: { hotelId: string }) => {
  const [images, setImages] = useState<string[]>([]);

  const { uploadImage, uploading } = useUpload();

  // const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     const file = e.target.files[0];
  //     const url = await uploadImage(file);

  //     if (url) {
  //       setImages((prev) => [...prev, url]);

  //       try {
  //         const res = await fetch('/api/hotels/upload-images', {
  //           method: 'POST',
  //           headers: { 'Content-Type': 'application/json' },
  //           body: JSON.stringify({ hotelId, images: [url] }),
  //         });
  //         if (!res.ok) {
  //           throw new Error('Failed to save image URL');
  //         }
  //       } catch (err) {
  //         console.error('Error saving image URL to DB:', err);
  //       }
  //     }
  //   }
  // };

  return (
    <Card className="pt-4 pr-6 pb-6 pl-6">
      <div className="flex items-center justify-between ">
        <h2 className="text-lg font-semibold text-gray-900">Images</h2>

        <Dialog>
          <DialogTrigger className="text-[#2563EB]">Edit</DialogTrigger>
          <DialogContent className="w-[1160px] max-h-[800px] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Images</DialogTitle>
            </DialogHeader>

            {/* Upload хэсэг */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <Label htmlFor="image-upload" className="w-[552px] h-[300px] cursor-pointer border-2 border-dashed rounded-md p-8 text-sm flex flex-col justify-center gap-2 items-center   bg-gray-50 ">
                <Plus className="w-8 h-8 text-[#2563EB]" />
                <span>Drag or Upload Photo</span>
                <input
                  id="image-upload"
                  type="file"
                  className="hidden"
                  onChange={async (e) => {
                    if (e.target.files && e.target.files[0]) {
                      const url = await uploadImage(e.target.files[0]);
                      if (url !== null) {
                        setImages((prev) => [...prev, url]);
                      }
                    }
                  }}
                />
                {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
              </Label>
            </div>

            <div className="flex justify-between">
              <Button variant="ghost">Cancel</Button>
              <Button className="bg-[#2563EB] text-white">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <CardContent className="mt-4">
        <div className="flex flex-col gap-1">
          {images.length > 0 ? (
            // Зураг байвал gallery
            <div>
              <div className="w-full h-64">
                <Image src={images[0]} alt="Main" width={625} height={400} className="w-full h-full object-cover rounded-xl border shadow-md" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {images.slice(1).map((img, i) => (
                  <Image key={i} src={img} alt={`Uploaded ${i}`} width={250} height={180} className="h-44 w-full object-cover rounded-lg border shadow hover:scale-105 transition" />
                ))}
              </div>
            </div>
          ) : (
            // Хоосон төлөв
            <div className="flex flex-col items-center justify-center  rounded-lg text-center ">
              <div className="font-medium flex flex-col gap-3 justify-center items-center">
                <ImageOff className="text-muted-foreground" />
                <p>No Photos Uploaded</p>
              </div>
              <p className="text-sm text-gray-400">Add photos of your rooms, amenities, or property to showcase your hotel.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
