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
import { AllFoodQuery, FoodType, useDeleteFoodMutation } from '@/generated';
import { ApolloQueryResult } from '@apollo/client';

import { Trash, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export const DeleteFood = ({ food, reFetchAdminFood }: { food: FoodType; reFetchAdminFood: () => Promise<ApolloQueryResult<AllFoodQuery>> }) => {
  const [deleteFood] = useDeleteFoodMutation();
  const [open, setOpen] = useState(false);

  const handleDelete = async (foodId: string) => {
    await deleteFood({ variables: { foodId } });
    setOpen(false);
    reFetchAdminFood();

    toast.success(
      <span>
        Хоол: <b>{food.name} </b>амжилттай устгагдлаа
      </span>
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="p-2 rounded-lg text-gray-500 bg-white font-normal hover:bg-gray-100 transition-colors duration-200">
          <Trash size={20} />
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
          <AlertDialogAction className="w-full bg-black text-white hover:bg-gray-900" onClick={() => handleDelete(food.id)}>
            Тийм
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
