import { DialogClose, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { FormType } from './AddRoomServices';
import React from 'react';
import { TagInput } from './TagInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ServicesDialogType = {
  form: UseFormReturn<FormType>;
  onSubmit: (values: FormType) => void;
};

const amenities: { label: string; name: keyof FormType }[] = [
  { label: 'Bathroom', name: 'bathroom' },
  { label: 'Accessibility', name: 'accessibility' },
  { label: 'Entertainment', name: 'entertainment' },
  { label: 'Food and Drink', name: 'foodAndDrink' },
  { label: 'Other', name: 'other' },
];
const stars = ['1', '2', '3', '4', '5'];
export const ServicesDialog = ({ form, onSubmit }: ServicesDialogType) => {
  return (
    <DialogContent className="w-[600px]">
      <DialogHeader>Room services</DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {amenities.map((el, index) => {
            return (
              <FormField
                key={index}
                control={form.control}
                name={el.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{el.label}</FormLabel>
                    <FormControl>
                      <TagInput value={(field.value as string[]) || []} onChange={field.onChange} placeholder={`Add ${el.name} items (press Enter)`} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          })}
          <FormField
            control={form.control}
            name="starsRating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stars rating</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose star rating" />
                    </SelectTrigger>
                    <SelectContent>
                      {stars.map((star, index) => {
                        return (
                          <SelectItem value={star} key={index}>
                            <div className="flex gap-2 items-center">
                              <Star className="w-[16px]" />
                              <p>{`${star} ${star === '1' ? 'star' : 'stars'}`}</p>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between">
            <DialogClose>Close</DialogClose>
            <Button variant="hotel" type="submit">
              Save
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
};
