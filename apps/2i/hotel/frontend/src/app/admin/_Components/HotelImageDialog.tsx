'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const HotelImageUploadModal = ({ file, setFile, preview, setPreview }: any) => {
  const [open, setOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Upload Image</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Images</DialogTitle>
        </DialogHeader>
        <div className="border-2 border-dashed rounded-md flex items-center justify-center h-64">
          {preview ? (
            <Image src={preview} alt="Preview" width={200} height={200} className="object-cover rounded-md" />
          ) : (
            <label className="flex flex-col items-center justify-center cursor-pointer">
              <span className="text-blue-500 text-xl">+</span>
              <span className="text-sm text-muted-foreground">Drag or Upload Photo</span>
              <Input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
          )}
        </div>
        <DialogFooter className="flex justify-between">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
