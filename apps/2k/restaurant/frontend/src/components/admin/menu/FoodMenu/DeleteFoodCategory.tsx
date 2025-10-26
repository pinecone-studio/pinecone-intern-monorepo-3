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

import { AllFoodQuery, useDeleteFoodFromCategoryMutation } from '@/generated';
import { ApolloQueryResult } from '@apollo/client';

import { Minus, X } from 'lucide-react';
import { toast } from 'sonner';

export const DeleteFood = ({ foodId, categoryId, refetchAllFood }: { foodId: string; categoryId: string; refetchAllFood: () => Promise<ApolloQueryResult<AllFoodQuery>> }) => {
  const [DeleteFoodFromCategory] = useDeleteFoodFromCategoryMutation();

  const handleDeleteFoodFromCategory = async () => {
    try {
      await DeleteFoodFromCategory({ variables: { foodId, categoryId } });
      await refetchAllFood();

      toast.success('Хоолыг цэснээс амжилттай хаслаа!');
    } catch (error) {
      toast.error('Хоолыг цэснээс хасахад алдаа гарлаа.');
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-all p-0"
        >
          <Minus size={16} />
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
          <AlertDialogTitle>Цэснээс хасах</AlertDialogTitle>
          <AlertDialogDescription>&quot;Taso&quot;-г цэснээс хасахдаа итгэлтэй байна уу?</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogAction onClick={handleDeleteFoodFromCategory} className="w-full bg-black text-white hover:bg-gray-900">
            Тийм
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
