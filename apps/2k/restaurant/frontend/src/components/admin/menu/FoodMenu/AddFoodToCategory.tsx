import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { AllFoodQuery, FoodType, GetCategoriesQuery, useAddFoodToCategoryMutation } from '@/generated';
import { ApolloQueryResult } from '@apollo/client';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const categories = [
  { value: 'fruit', label: 'Жимс' },
  { value: 'vegetable', label: 'Ногоо' },
  { value: 'drink', label: 'Ундаа' },
];

type AddCategoryDialogProps = {
  filteredCategoryFood: FoodType[] | undefined;
  activeCategory: string;
  refetchAllFood: () => Promise<ApolloQueryResult<AllFoodQuery>>;
};

export const AddFoodToCategory = ({ filteredCategoryFood, activeCategory, refetchAllFood }: AddCategoryDialogProps) => {
  const [selectedFood, setSelectedFood] = useState('');

  const [addFoodCategory] = useAddFoodToCategoryMutation();

  const handleAddFoodToCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('hello');

    try {
      console.log('Selected Food ID:', selectedFood, 'Category:', activeCategory);

      await addFoodCategory({ variables: { foodId: selectedFood, categoryId: activeCategory } });
      await refetchAllFood();

      setSelectedFood('');

      toast.success('Хоол амжилттай цэсэнд нэмэгдлээ!');
    } catch (error) {
      console.error(error);
      toast.error('Хоол нэмэхэд алдаа гарлаа.');
    }
    console.log('Adding food to category:', activeCategory);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all rounded-lg">
          Бүтээгдэхүүнээс <Plus className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[420px] p-6 rounded-xl">
        <form onSubmit={handleAddFoodToCategory} className="relative space-y-5">
          {/* Баруун дээд X товч */}
          <DialogClose asChild>
            <button className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-gray-100 transition-all" aria-label="Close">
              <X className="w-4 h-4" />
            </button>
          </DialogClose>

          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">Цэсэнд нэмэх</DialogTitle>
          </DialogHeader>

          <div className="grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="category-1" className="text-sm font-medium text-gray-700">
                Category
              </Label>
              <select
                value={selectedFood}
                onChange={(e) => setSelectedFood(e.target.value)}
                id="category-1"
                name="category"
                className="border border-gray-300 rounded-lg p-2.5 text-gray-800 focus:outline-none focus:ring-0 focus:border-gray-400 transition-all"
              >
                <option value="">Сонгох</option>
                {filteredCategoryFood?.map((food) => (
                  <option key={food.id} value={food.id}>
                    {food.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit" className="w-full bg-black text-white hover:bg-gray-900 py-2.5 rounded-lg text-sm font-medium">
                Хадгалах
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
