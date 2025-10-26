import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Category, GetCategoriesQuery, useCreateCategoryMutation, useUpdateCategoryMutation } from '@/generated';
import { Pen, Plus, X } from 'lucide-react';
import { ApolloQueryResult } from '@apollo/client';
import { toast } from 'sonner';

type AddCategoryDialogProps = {
  isUpdate?: boolean;
  refetchCategory: () => Promise<ApolloQueryResult<GetCategoriesQuery>>;
  category?: Category | null; // ✅ optional болгосон
};

export const AddCategoryDialog = ({ isUpdate = false, refetchCategory, category }: AddCategoryDialogProps) => {
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  const [categoryName, setCategoryName] = useState(category?.categoryName || '');
  const [open, setOpen] = useState(false);

  // ✅ Нэг л function — create/update-г нөхцлөөр шийдэж байна
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      toast.error('Ангиллын нэрийг оруулна уу.');
      return;
    }

    try {
      if (isUpdate && category?.categoryId) {
        await updateCategory({ variables: { categoryId: category.categoryId, input: { categoryName } } });
        toast.success(`"${categoryName}" амжилттай шинэчлэгдлээ!`);
      } else {
        await createCategory({ variables: { input: { categoryName } } });
        toast.success(
          <span>
            Ангилал нэмэгдлээ: <b>{categoryName}</b>
          </span>
        );
        setCategoryName('');
      }

      await refetchCategory();
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(isUpdate ? 'Ангилал шинэчлэхэд алдаа гарлаа.' : 'Ангилал нэмэхэд алдаа гарлаа.');
    }
  };

  // console.log("category nae", categoryName);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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

      <DialogContent className="sm:max-w-[425px]">
        {/* Баруун дээд X товч */}
        <DialogClose asChild>
          <button className="absolute top-3 right-3 p-1 rounded-md hover:bg-gray-200 transition-all" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </DialogClose>

        <DialogHeader>
          <DialogTitle>{isUpdate ? 'Ангилал шинэчлэх' : 'Ангилал нэмэх'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Input id="categoryName" name="categoryName" placeholder="Ангиллын нэр" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button type="submit" className="w-full bg-black text-white hover:bg-gray-900">
              {isUpdate ? 'Шинэчлэх' : 'Нэмэх'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
