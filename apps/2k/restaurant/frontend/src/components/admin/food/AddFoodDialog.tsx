import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AllFoodQuery, useCreateFoodMutation } from '@/generated';
import { ImagePlus } from 'lucide-react';
import { useState } from 'react';
import { ApolloQueryResult } from '@apollo/client';
import { toast } from 'sonner';

// Zod schema
const foodSchema = z.object({
  name: z.string().min(1, 'Нэр оруулах шаардлагатай'),
  price: z.string().regex(/^\d+(\.\d+)?$/, 'Үнэ зөв форматтай байх ёстой'),
  status: z.boolean(),
  image: z.string().optional(),
});

type FoodFormData = z.infer<typeof foodSchema>;

interface AddFoodDialogProps {
  reFetchAdminFood: () => Promise<ApolloQueryResult<AllFoodQuery>>;
}

export const AddFoodDialog: React.FC<AddFoodDialogProps> = ({ reFetchAdminFood }) => {
  const [createFood] = useCreateFoodMutation();
  const [preview, setPreview] = useState('');

  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FoodFormData>({
    resolver: zodResolver(foodSchema),
    defaultValues: {
      name: '',
      price: '',
      status: true,
      image: '',
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Локал preview-г эхэлж харуулах
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'images');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_CLOUDINARY_IMAGE}`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (data.secure_url) {
        setPreview(data.secure_url); // upload хийгдсэний дараа Cloudinary URL-г харуулах
        setValue('image', data.secure_url);
      }
    } catch (error) {
      toast.error('Image upload failed');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: FoodFormData) => {
    console.log('🧩 Баталгаажсан өгөгдөл:', data);
    await createFood({
      variables: {
        name: data.name,
        price: Number(data.price),
        available: data.status,
        image: data.image,
      },
    });

    toast.success(
      <span>
        Хоол: <b>{data.name} </b>амжилттай нэмэгдлээ
      </span>
    );

    await reFetchAdminFood();
    reset();
    setPreview('');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="px-4 py-2 rounded-lg font-medium bg-gray-900 text-white">Хоол нэмэх</button>
      </DialogTrigger>

      <DialogContent className="p-6 sm:max-w-[400px] space-y-5 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">Шинэ хоол нэмэх</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Зураг */}
          <div className="flex flex-col items-center">
            <label htmlFor="image-upload" className="w-28 h-28 bg-gray-100 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition">
              {uploading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <span>Uploading...</span>
                </div>
              ) : preview ? (
                <img src={preview} alt="preview" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <>
                  <ImagePlus size={28} className="text-gray-500" />
                  <span className="mt-1 text-xs text-gray-500">Зураг нэмэх</span>
                </>
              )}
            </label>

            {/* 👇 File input */}
            <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />

            {/* 👇 Энэ мөрийг заавал нэмээрэй */}
            <input type="hidden" {...register('image')} />
          </div>

          {/* Нэр */}
          <input {...register('name')} placeholder="Хоолны нэр" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300" />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}

          {/* Үнэ */}
          <input {...register('price')} placeholder="Үнэ (ж: 15000)" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300" />

          {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}

          {/* Статус */}
          <select
            {...register('status', {
              setValueAs: (v) => v === 'true',
            })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <option value="true">идэвхитэй</option>
            <option value="false">идэвхгүй</option>
          </select>

          {/* Footer */}
          <DialogFooter className="flex justify-between mt-4">
            <DialogClose asChild>
              <button type="button" className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100 transition">
                Хаах
              </button>
            </DialogClose>

            <DialogClose asChild>
              <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition">
                Нэмэх
              </button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
