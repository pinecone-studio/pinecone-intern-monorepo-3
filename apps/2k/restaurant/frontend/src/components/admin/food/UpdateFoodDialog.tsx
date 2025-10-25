import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AllFoodQuery, FoodType, useUpdateFoodMutation } from '@/generated';
import { ImagePlus } from 'lucide-react';
import { useState } from 'react';
import { ApolloQueryResult } from '@apollo/client';

// ✅ Validation schema
const foodSchema = z.object({
  name: z.string().min(1, 'Нэр оруулах шаардлагатай'),
  price: z.string().regex(/^\d+(\.\d+)?$/, 'Үнэ зөв форматтай байх ёстой'),
  status: z.boolean(),
  image: z.string().optional(),
});

type FoodFormData = z.infer<typeof foodSchema>;

interface EditFoodDialogProps {
  food: FoodType;
  reFetchAdminFood: () => Promise<ApolloQueryResult<AllFoodQuery>>;
}

export const EditFoodDialog: React.FC<EditFoodDialogProps> = ({
  food,
  reFetchAdminFood,
}) => {
  const [updateFood] = useUpdateFoodMutation();
  const [preview, setPreview] = useState(food?.image || '');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FoodFormData>({
    resolver: zodResolver(foodSchema),
    defaultValues: {
      name: food?.name || '',
      price: food?.price?.toString() || '',
      status: food?.available ?? true,
      image: food?.image || '',
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setValue('image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FoodFormData) => {
    console.log('🧩 UPDATE өгөгдөл:', data);

    await updateFood({
      variables: {
        updateFoodId: food.id, // ← энэ нэрийг GraphQL mutation-дээ тааруул
        name: data.name,
        price: Number(data.price),
        available: data.status,
        image: data.image,
      },
    });

    await reFetchAdminFood();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
          Засах
        </button>
      </DialogTrigger>

      <DialogContent className="p-6 sm:max-w-[400px] space-y-5 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            Хоол засах
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Зураг */}
          <div className="flex flex-col items-center">
            <label
              htmlFor={`image-upload-${food.id}`}
              className="w-28 h-28 bg-gray-100 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <>
                  <ImagePlus size={28} className="text-gray-500" />
                  <span className="mt-1 text-xs text-gray-500">Зураг нэмэх</span>
                </>
              )}
            </label>
            
            <input
              id={`image-upload-${food.id}`}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Нэр */}
          <input
            {...register('name')}
            placeholder="Хоолны нэр"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}

          {/* Үнэ */}
          <input
            {...register('price')}
            placeholder="Үнэ (ж: 15000)"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
          {errors.price && (
            <p className="text-sm text-red-500">{errors.price.message}</p>
          )}

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
              <button
                type="button"
                className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100 transition"
              >
                Хаах
              </button>
            </DialogClose>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
            >
              Хадгалах
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};