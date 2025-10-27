import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

import { Category, GetCategoriesQuery, useAllFoodQuery, useDeleteCategoryMutation } from '@/generated';

import { ApolloQueryResult } from '@apollo/client';

import { Trash, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export const DeleteCategory = ({ category, refetchCategory }: { category: Category; refetchCategory: () => Promise<ApolloQueryResult<GetCategoriesQuery>> }) => {
  
  const [DeleteCategory] = useDeleteCategoryMutation();
  const {data, refetch} = useAllFoodQuery();
  const [open, setOpen] = useState(false);

  const handleDeleteCategory = async () => {
    await DeleteCategory({ variables: { categoryId: category.categoryId } });
    
    await refetchCategory();
    await refetch();
    setOpen(false);

    toast.success(
      <span>
        Амжилттай устгагдлаа: <b className="text-red-500">{category.categoryName}</b>
      </span>
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-all p-0"
        >
          <Trash className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-sm ">
        {/* Close button дээд баруун буланд */}
        <AlertDialogCancel asChild>
          <button className="absolute top-3 right-3 p-1 rounded-md hover:bg-gray-200 transition-all" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </AlertDialogCancel>

        <AlertDialogHeader>
          <AlertDialogTitle>Цэс хасах</AlertDialogTitle>
          <AlertDialogDescription>&quot;Амттан&quot;-г хасахдаа итгэлтэй байна уу?</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogAction onClick={handleDeleteCategory} className="w-full bg-black text-white hover:bg-gray-900">
            Тийм
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
