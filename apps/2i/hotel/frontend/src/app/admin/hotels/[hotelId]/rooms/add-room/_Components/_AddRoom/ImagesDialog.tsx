'use client';

import { useUpload } from '@/components/providers';
import { Button } from '@/components/ui/button';
import { DialogClose, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoaderCircle, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

type ImagesDialogType = {
  preview: string[];
  handleFileChange: (_e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemove: (_index: number) => void;
  imgFiles: File[];
};

export const ImagesDialog = ({ preview, handleFileChange, handleRemove }: ImagesDialogType) => {
  const { uploading } = useUpload();

  // const uploadFiles = (files: File[]) => {
  //   const uploaded = files.map(async (file) => {
  //     return await uploadImage(file);
  //   });
  // };

  // const handleUplaod = async () => {};

  return (
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
        <Button variant="hotel" type="button">
          Save
        </Button>
      </div>
    </DialogContent>
  );
};
