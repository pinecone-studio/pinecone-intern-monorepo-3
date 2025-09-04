'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
// import { useUpdateHotelMutation } from '@/generated';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

const formSchema = z.object({
  amenities: z.array(z.string().min(1, 'Amenity is required')).min(1, 'At least one amenity required'),
});

export const AddHotelAmenities = ({ hotelId }: { hotelId: string | undefined }) => {
  const [open, setOpen] = useState<boolean>(false);
  // const [updateHotelMutation] = useUpdateHotelMutation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amenities: [],
    },
  });

  const handleAmenityKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = e.currentTarget.value.trim();
      if (value) {
        const prev = form.getValues('amenities');
        form.setValue('amenities', [...prev, value]);
        e.currentTarget.value = '';
      }
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // try {
    //   const { data } = await updateHotelMutation({
    //     variables: {
    //       updateHotelId: hotelId!,
    //       input: {
    //         amenities: values.amenities,
    //       },
    //     },
    //   });
    //   console.log(data?.updateHotel);
    //   setOpen(false);
    // } catch (err) {
    //   console.log(err);
    // }
    console.log(values);
    console.log(hotelId);
  };

  return (
    <Card className="p-6">
      <div className="border-b flex justify-between">
        <div className="mb-4">
          <h1 className="text-lg font-semibold text-gray-800">Amenities</h1>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="text-[#2563EB]">Edit</DialogTrigger>
          <DialogContent className="w-[626px]">
            <DialogHeader>
              <DialogTitle>Amenities</DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <FormField
                  control={form.control}
                  name="amenities"
                  render={() => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Type amenity and press Enter" onKeyDown={handleAmenityKeyDown} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-wrap gap-2">
                  {form.watch('amenities').map((a, i) => (
                    <Button
                      type="button"
                      onClick={() => {
                        const current = form.getValues('amenities');
                        form.setValue(
                          'amenities',
                          current.filter((_, idx) => idx !== i)
                        );
                      }}
                      variant="destructive"
                      key={i}
                    >
                      {a} x
                    </Button>
                  ))}
                </div>
                <div className="flex justify-between">
                  <DialogClose asChild>
                    <Button>Close</Button>
                  </DialogClose>
                  <Button type="submit" variant="hotel">
                    Save
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {form.watch('amenities').map((a, i) => (
          <span key={i} className="bg-gray-200 px-2 py-1 rounded">
            {a}
          </span>
        ))}
      </div>
    </Card>
  );
};
