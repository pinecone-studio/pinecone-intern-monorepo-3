'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { ImagesDialog } from './ImagesDialog';
import { ImageOff } from 'lucide-react';
import { useState } from 'react';

export const AddRoomImages = () => {
  const [preview, setPreview] = useState<string[]>([]);
  const [imgFiles, setImgFiles] = useState<File[]>([]);
  const [, setImgUrl] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

    setImgFiles((prev) => [...prev, ...newFiles]);
    setPreview((prev) => [...prev, ...newPreviews]);
  };
  const handleRemove = (index: number) => {
    setPreview((prev) => prev.filter((_, i) => i !== index));
    setImgFiles((prev) => prev.filter((_, i) => i !== index));
    setImgUrl((prev) => prev.filter((_, i) => i !== index));
  };
  return (
    <Card className="w-[400px] col-start-3 mr-[24px]">
      <CardContent className="flex flex-col gap-12">
        <CardHeader>
          <CardTitle className="text-[18px] font-semibold flex justify-between">
            Images
            <Dialog>
              <DialogTrigger className="text-[#2563EB] text-[14px] font-medium">Edit</DialogTrigger>
              <ImagesDialog preview={preview} handleFileChange={handleFileChange} handleRemove={handleRemove} imgFiles={imgFiles} />
            </Dialog>
          </CardTitle>
        </CardHeader>
        <div className="flex flex-col items-center gap-4">
          <ImageOff />
          <div className="flex flex-col gap-1 items-center">
            <h1 className="text-[14px] font-medium">No Photos Uploaded</h1>
            <p className="text-[14px] text-[#71717A] text-center">Add photos of your rooms, amenities, or property to showcase your hotel.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
