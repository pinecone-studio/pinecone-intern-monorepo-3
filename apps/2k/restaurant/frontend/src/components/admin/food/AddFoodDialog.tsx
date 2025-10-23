import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { ImagePlus } from 'lucide-react';

interface FoodItem {
  id: number;
  name: string;
  price: string;
  status: 'идэвхитэй' | 'идэвхгүй';
  image: string;
}

interface AddFoodDialogProps {
  mode: 'add' | 'edit';
  food?: FoodItem;
}

export const AddFoodDialog: React.FC<AddFoodDialogProps> = ({ mode, food }) => {
  const [name, setName] = useState(food?.name || '');
  const [price, setPrice] = useState(food?.price || '');
  const [status, setStatus] = useState<'идэвхитэй' | 'идэвхгүй'>(food?.status || 'идэвхитэй');
  const [image, setImage] = useState(food?.image || '');
  const [preview, setPreview] = useState(food?.image || '');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
      setImage(file.name);
    }
  };

  console.log("image:", image);
  console.log("preview:", preview);

  const handleSubmit = () => {
    const data = { id: food?.id, name, price, status, image: preview };
    if (mode === 'add') {
      console.log('🟢 Шинэ хоол нэмэх:', data);
    } else {
      console.log('🟡 Хоол update хийх:', data);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className={`px-4 py-2 rounded-lg font-medium ${
            mode === 'add' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          {mode === 'add' ? 'Хоол нэмэх' : 'Засах'}
        </button>
      </DialogTrigger>

      <DialogContent className="p-6 sm:max-w-[400px] space-y-5 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            {mode === 'add' ? 'Шинэ хоол нэмэх' : 'Хоол засах'}
          </DialogTitle>
        </DialogHeader>

        {/* Form */}
        <div className="flex flex-col gap-4">
          {/* Зураг оруулах */}
          <div className="flex flex-col items-center">
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center transition bg-gray-100 cursor-pointer w-28 h-28 rounded-xl hover:bg-gray-200"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="object-cover w-full h-full rounded-xl"
                />
              ) : (
                <>
                  <ImagePlus size={28} className="text-gray-500" />
                  <span className="mt-1 text-xs text-gray-500">Зураг нэмэх</span>
                </>
              )}
            </label>
            <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </div>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Хоолны нэр"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
          />

          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Үнэ (ж: 15.6k)"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'идэвхитэй' | 'идэвхгүй')}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <option value="идэвхитэй">идэвхитэй</option>
            <option value="идэвхгүй">идэвхгүй</option>
          </select>
        </div>

        {/* Footer */}
        <DialogFooter className="flex justify-between mt-4">
          <DialogClose asChild>
            <button className="px-4 py-2 text-gray-600 transition rounded-lg hover:bg-gray-100">
              Хаах
            </button>
          </DialogClose>
          <DialogClose asChild>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-white transition bg-gray-900 rounded-lg hover:bg-gray-800"
            >
              {mode === 'add' ? 'Нэмэх' : 'Хадгалах'}
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
