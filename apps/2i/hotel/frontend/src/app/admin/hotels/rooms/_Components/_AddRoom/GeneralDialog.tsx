'use client';

import { Button } from '@/components/ui/button';
import { DialogClose, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { FormType } from './AddRoomGeneral';

type GeneralDialogType = {
  form: UseFormReturn<FormType>;
  onSubmit: (_values: FormType) => void;
};

export const GeneralDialog = ({ form, onSubmit }: GeneralDialogType) => {
  const types = ['Single', 'Double', 'Deluxe', 'Standart'];
  return (
    <DialogContent className="w-[600px]">
      <DialogHeader>General Info</DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <FormField
            control={form.control}
            name="roomNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="roomType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room number</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose room type" />
                    </SelectTrigger>
                    <SelectContent>
                      {types.map((type, index) => {
                        return (
                          <SelectItem key={index} value={type}>
                            {type}
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
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price per night</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="roomInfo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room information</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between">
            <DialogClose>Close</DialogClose>
            <Button type="submit" variant="hotel">
              Save
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
};
