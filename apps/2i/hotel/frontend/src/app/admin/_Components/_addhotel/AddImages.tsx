'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ImageOff, Plus, Trash2 } from 'lucide-react';
import { useUpload } from '@/components/providers/ImageProvider';
import { useUploadToCloudinaryMutation } from '@/generated';
import Image from 'next/image';

export const AddImage = ({ hotelId }: { hotelId: string | undefined }) => {
  const [uploadToCloudinaryMutation, { data, error, loading }] = useUploadToCloudinaryMutation();
  const [open, setOpen] = useState<boolean>(false);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string[]>([]);
  const [imgUrls, setImgUrls] = useState<string[]>([]);
  const { uploadImage, uploading } = useUpload();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return null;
    }
    const url = URL.createObjectURL(file);
    setPreview((prev) => [...prev, url]);
    setImgFile(file);
  };
  const handleUpload = async () => {
    if (!imgFile || !hotelId) return;

    try {
      const url = await uploadImage(imgFile);
      if (!url) return;

      // Preview-г Cloudinary URL-аар солих
      setPreview((prev) => [...prev, url]);
      setImgUrls((prev) => [...prev, url]);

      const { data } = await uploadToCloudinaryMutation({
        variables: {
          hotelId: hotelId,
          image: [...imgUrls, url],
        },
      });

      console.log(data?.uploadToCloudinary);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = (index: number) => {
    const newImages = preview.filter((_, i) => i !== index);
    setPreview(newImages);
  };

  return (
    <Card className="pt-4 pr-6 pb-6 pl-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Images</h2>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="text-[#2563EB]">Edit</DialogTrigger>
          <DialogContent className="w-[1160px] max-h-[800px] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Images</DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <Label htmlFor="image-upload" className="w-[552px] h-[300px] cursor-pointer border-2 border-dashed rounded-md p-8 text-sm flex flex-col justify-center gap-2 items-center bg-gray-50">
                <Plus className="w-8 h-8 text-[#2563EB]" />
                <span>{uploading ? 'Uploading...' : 'Drag or Upload Photo'}</span>
                <input id="image-upload" type="file" className="hidden" onChange={handleFileChange} />
              </Label>
            </div>

            {preview.length > 0 && (
              <div className="grid grid-cols-5 gap-4 mb-6">
                {preview.map((img, index) => (
                  <div key={index} className="relative w-full h-32 border rounded overflow-hidden">
                    <Image src={img} alt={`preview-${index}`} width={220} height={40} objectFit="cover" />
                    <Button size="sm" variant="destructive" className="absolute top-1 right-1 p-1 rounded-full" onClick={() => handleRemove(index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between">
              <DialogClose>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <Button variant="hotel" type="button" onClick={handleUpload}>
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <CardContent className="mt-4">
        {preview.length === 0 && (
          <div className="flex flex-col gap-1">
            <div className="font-medium flex flex-col gap-3 justify-center items-center">
              <ImageOff className="text-muted-foreground" />
              <p>No Photos Uploaded</p>
            </div>
            <p className="text-sm text-gray-400 text-center">Add photos of your rooms, amenities, or property to showcase your hotel.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
