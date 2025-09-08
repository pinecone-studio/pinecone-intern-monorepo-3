'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { ImagesDialog } from './ImagesDialog';
import { ImageOff } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

export const AddRoomImages = ({ roomId }: { roomId: string | undefined }) => {
  const [preview, setPreview] = useState<string[]>([]);
  const [imgFiles, setImgFiles] = useState<File[]>([]);
  const [imgUrls, setImgUrls] = useState<string[]>([]);
  const [open, setOpen] = useState<boolean>(false);

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
    setImgUrls((prev) => prev.filter((_, i) => i !== index));
  };
  return (
    <Card className="w-[400px] col-start-3 mr-[24px]">
      <CardContent className="flex flex-col gap-12">
        <CardHeader>
          <CardTitle className="text-[18px] font-semibold flex justify-between">
            Images
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger className="text-[#2563EB] text-[14px] font-medium">Edit</DialogTrigger>
              <ImagesDialog
                preview={preview}
                handleFileChange={handleFileChange}
                handleRemove={handleRemove}
                imgFiles={imgFiles}
                roomId={roomId}
                setImgUrls={setImgUrls}
                setPreview={setPreview}
                setOpen={setOpen}
                setImgFiles={setImgFiles}
              />
            </Dialog>
          </CardTitle>
        </CardHeader>
        {imgUrls.length === 0 ? (
          <div className="flex flex-col items-center gap-4">
            <ImageOff />
            <div className="flex flex-col gap-1 items-center">
              <h1 className="text-[14px] font-medium">No Photos Uploaded</h1>
              <p className="text-[14px] text-[#71717A] text-center">Add photos of your rooms, amenities, or property to showcase your hotel.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {imgUrls.map((img, index) => {
              return (
                <div className="w-[48px] h-[48px]" key={index}>
                  <Image src={img} alt={img} width={50} height={50} className="w-full h-full object-cover rounded-sm" />
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
