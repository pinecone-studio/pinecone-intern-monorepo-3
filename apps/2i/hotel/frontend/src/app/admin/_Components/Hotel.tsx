'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const ImageUploadModal = () => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSave = () => {
    if (file) {
      console.log('Uploaded file:', file);
      // API-д upload хийх хэсгийг энд хийнэ
    }
    setOpen(false);
  };

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Upload Image</Button>

      <Dialog open={open} onOpenChange={setOpen}>
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
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
