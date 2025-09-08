'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ImageOff, LoaderCircle, Plus, Trash2 } from 'lucide-react';
import { useUpload } from '@/components/providers/ImageProvider';
import { useGetHotelByIdQuery, useUploadToCloudinaryMutation } from '@/generated';
import Image from 'next/image';
import { Input } from '@/components/ui/input';

export const AddImage = ({ hotelId }: { hotelId: string | undefined }) => {
  const [uploadToCloudinaryMutation] = useUploadToCloudinaryMutation();
  const { data } = useGetHotelByIdQuery({
    variables: {
      getHotelByIdId: hotelId!,
    },
  });

  const [open, setOpen] = useState(false);
  const [imgFiles, setImgFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [imgUrls, setImgUrls] = useState<string[]>([]);
  const { uploadImage, uploading } = useUpload();
  console.log(data, 'imgaes');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

    setImgFiles((prev) => [...prev, ...newFiles]);
    setPreview((prev) => [...prev, ...newPreviews]);
  };

  const uploadFiles = async (files: File[]) => {
    const uploaded: string[] = [];
    for (const file of files) {
      const url = await uploadImage(file);
      if (url) uploaded.push(url);
    }
    return uploaded;
  };

  const handleUpload = async () => {
    if (imgFiles.length === 0 || !hotelId) return;

    try {
      const uploadedUrls = await uploadFiles(imgFiles);
      console.log(uploadedUrls, 'uploaded');

      setImgUrls((prev) => [...prev, ...uploadedUrls]);

      console.log(imgUrls, 'urls');

      const { data } = await uploadToCloudinaryMutation({
        variables: {
          hotelId: hotelId,
          image: uploadedUrls,
        },
      });

      console.log(data?.uploadToCloudinary);

      setImgFiles([]);
      setPreview([]);
      setOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = (index: number) => {
    setPreview((prev) => prev.filter((_, i) => i !== index));
    setImgFiles((prev) => prev.filter((_, i) => i !== index));
    setImgUrls((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Card className="pt-4 pr-6 pb-6 pl-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Images</h2>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="text-[#2563EB]">Edit</DialogTrigger>
          <DialogContent className="w-[1160px] max-h-[800px] overflow-y-scroll">
            <DialogHeader>Images</DialogHeader>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <Label htmlFor="image-upload" className="w-[552px] h-[300px] cursor-pointer border-2 border-dashed rounded-md p-8 text-sm flex flex-col justify-center gap-2 items-center bg-gray-50">
                <div className="flex flex-col gap-2 items-center">
                  <Plus className="w-8 h-8 text-[#2563EB]" />
                  {uploading ? <LoaderCircle className="animate-spin" /> : <p>Drag or Upload Photo</p>}
                </div>

                <Input id="image-upload" type="file" className="hidden" multiple onChange={handleFileChange} />
              </Label>
              {preview.map((el, index) => {
                return (
                  <div className="w-[552px] h-[300px]" key={index}>
                    <Image src={el} className="w-full h-full object-cover rounded-md" width={500} height={300} alt={`${index} photo`} />
                    <Button size="icon" className="w-[24px] h-[24px] translate-x-[520px] -translate-y-[290px]" variant="destructive" onClick={() => handleRemove(index)}>
                      <Trash2 className="w-[16px]" />
                    </Button>
                  </div>
                );
              })}
            </div>

            <div className="justify-between flex">
              <DialogClose>Close</DialogClose>
              <Button variant="hotel" type="button" onClick={handleUpload}>
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <CardContent className="mt-4">
        {imgUrls.length === 0 ? (
          <div className="flex flex-col gap-1">
            <div className="font-medium flex flex-col gap-3 justify-center items-center">
              <ImageOff className="text-muted-foreground" />
              <p>No Photos Uploaded</p>
            </div>
            <p className="text-sm text-gray-400 text-center">Add photos of your rooms, amenities, or property to showcase your hotel.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {imgUrls.map((url, index) => {
              return (
                <div className="w-[48px] h-[48px]" key={index}>
                  <Image src={url} alt={url} width={50} height={50} className="w-full h-full object-cover rounded-sm" />
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
