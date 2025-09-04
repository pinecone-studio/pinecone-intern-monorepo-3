import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateHotelMutation } from '@/generated';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
const formSchema = z.object({
  location: z.string().nonempty('Location please'),
});
export const AddLocation = ({ hotelId }: { hotelId: string | undefined }) => {
  const [updateHotelMutation] = useUpdateHotelMutation();
  const [open, setOpen] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data } = await updateHotelMutation({
        variables: {
          updateHotelId: hotelId!,
          input: {
            location: values.location,
          },
        },
      });
      setOpen(false);
      console.log(data?.updateHotel, 'upodate hotel');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between p-6">
        <CardTitle className="text-lg font-semibold text-gray-900">Location</CardTitle>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="text-[#2563EB]">Edit</DialogTrigger>

          <DialogContent className="w-[480px] ">
            <DialogHeader>
              <DialogTitle>Location</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea placeholder="Location info here..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className=" flex justify-between">
                  <DialogClose asChild>
                    <Button>Cancel</Button>
                  </DialogClose>
                  <Button variant="hotel" type="submit">
                    Save
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <CardContent className="flex flex-col gap-3">
        {/* {location.city && location.city.trim() !== '' ? ( */}

        <span className="text-gray-400 italic">-/-</span>
      </CardContent>
    </Card>
  );
};
