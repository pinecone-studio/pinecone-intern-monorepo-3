'use client';

import { createContext, Dispatch, PropsWithChildren, SetStateAction } from 'react';
import { useContext, useState } from 'react';

type UploadContextType = {
  uploadImage: (_file: File) => Promise<string | null>;
  uploading: boolean;
  setUploading: Dispatch<SetStateAction<boolean>>;
};

const UploadContext = createContext<UploadContextType | undefined>(undefined);

export const UploadProvider = ({ children }: PropsWithChildren) => {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'hotel-booking');
    formData.append('cloud_name', 'dip9rajob');

    try {
      setUploading(true);
      const res = await fetch('https://api.cloudinary.com/v1_1/dip9rajob/image/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      return data.secure_url;
    } catch (err) {
      console.error('Upload error:', err);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return <UploadContext.Provider value={{ uploadImage, uploading, setUploading }}>{children}</UploadContext.Provider>;
};

export const useUpload = () => {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error('useUpload must be used within an UploadProvider');
  }
  return context;
};
