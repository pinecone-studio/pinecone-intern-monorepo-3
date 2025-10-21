import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

import { Pen, Plus, X } from 'lucide-react';

export const AddCategoryDialog = ({ isUpdate = false }: { isUpdate?: boolean }) => {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          {isUpdate ? (
            <Button
              variant="outline"
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-all p-0"
            >
              <Pen size={16} />
            </Button>
          ) : (
            <Button variant="outline" className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all rounded-lg">
              Цэс <Plus className="w-4 h-4" />
            </Button>
          )}
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px] ">
          {/* Баруун дээд X товч */}
          <DialogClose asChild>
            <button className="absolute top-3 right-3 p-1 rounded-md hover:bg-gray-200 transition-all" aria-label="Close">
              <X className="w-4 h-4" />
            </button>
          </DialogClose>

          <DialogHeader>
            <DialogTitle>{isUpdate ? 'Ангилал шинэчлэх' : 'Ангилал нэмэх'}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3">
              <Input id="name-1" name="name" placeholder="Ангиллын нэр" />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full bg-black text-white hover:bg-gray-900">
               {isUpdate ? 'Шинэчлэх' : 'Нэмэх'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
