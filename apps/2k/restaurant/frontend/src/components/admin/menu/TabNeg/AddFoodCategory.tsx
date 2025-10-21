import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';

const categories = [
  { value: 'fruit', label: 'Жимс' },
  { value: 'vegetable', label: 'Ногоо' },
  { value: 'drink', label: 'Ундаа' },
];

export const DialogDemo = () => {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all rounded-lg">
            Бүтээгдэхүүнээс <Plus className="w-4 h-4" />
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px] ">
          {/* Баруун дээд X товч */}
          <DialogClose asChild>
            <button className="absolute top-3 right-3 p-1 rounded-md hover:bg-gray-200 transition-all" aria-label="Close">
              <X className="w-4 h-4" />
            </button>
          </DialogClose>

          <DialogHeader>
            <DialogTitle>Цэсэнд нэмэх</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" name="name" placeholder="Бүтээгдэхүүн нэмэх" />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="category-1">Category</Label>
              <select id="category-1" name="category" className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Сонгох</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full bg-black text-white hover:bg-gray-900">
              Хадгалах
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
