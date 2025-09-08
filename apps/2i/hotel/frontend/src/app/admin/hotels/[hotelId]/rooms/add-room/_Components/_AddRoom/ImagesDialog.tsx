'use client';

import { useUpload } from '@/components/providers';
import { Button } from '@/components/ui/button';
import { DialogClose, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUploadRoomImagesMutation } from '@/generated';
import { LoaderCircle, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import React, { Dispatch, SetStateAction } from 'react';

type ImagesDialogType = {
  preview: string[];
  handleFileChange: (_e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemove: (_index: number) => void;
  imgFiles: File[];
  roomId: string | undefined;
  setPreview: Dispatch<SetStateAction<string[]>>;
  setImgFiles: Dispatch<SetStateAction<File[]>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setImgUrls: Dispatch<SetStateAction<string[]>>;
};

export const ImagesDialog = ({ preview, handleFileChange, handleRemove, imgFiles, roomId, setPreview, setImgFiles, setOpen, setImgUrls }: ImagesDialogType) => {
  const { uploading, uploadImage } = useUpload();
  const [uploadRoomImagesMutation] = useUploadRoomImagesMutation();

  const uploadFiles = async (files: File[]) => {
    const uploaded: string[] = [];
    for (const file of files) {
      const url = await uploadImage(file);
      if (url) uploaded.push(url);
    }
    return uploaded;
  };

  const handleUpload = async () => {
    if (imgFiles.length === 0 || !roomId) return;

    try {
      const uploadedUrls = await uploadFiles(imgFiles);

      setImgUrls((prev) => [...prev, ...uploadedUrls]);

      const { data } = await uploadRoomImagesMutation({
        variables: {
          roomId: roomId,
          image: uploadedUrls,
        },
      });

      console.log(data?.uploadRoomImages);

      setImgFiles([]);
      setPreview([]);
      setOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

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
        <Button variant="hotel" type="button" onClick={handleUpload}>
          Save
        </Button>
      </div>
    </DialogContent>
  );
};
