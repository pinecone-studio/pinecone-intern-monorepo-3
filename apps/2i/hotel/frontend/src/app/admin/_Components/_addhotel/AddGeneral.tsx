import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Phone, Star } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAddHotelMutation } from '@/generated';
import { Dispatch, SetStateAction, useState } from 'react';

const formSchema = z.object({
  hotelName: z.string().nonempty('Define your hotel name'),
  description: z.string().min(10, 'at least 10 character'),
  phone: z.string().min(8, 'at least 8 character'),
  stars: z.string().nonempty('Choose star'),
});

export const AddHotelGeneral = ({ setHotelId }: { setHotelId: Dispatch<SetStateAction<string | undefined>> }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [addHotelMutation, { data, loading, error }] = useAddHotelMutation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hotelName: '',
      description: '',
      phone: '',
      stars: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data } = await addHotelMutation({
        variables: {
          hotelName: values.hotelName,
          description: values.description,
          phoneNumber: values.phone,
          starRating: values.stars,
        },
      });
      setHotelId(data?.addHotel._id!);
      console.log('Hotel added', data?.addHotel);
      setOpen(false);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Card className="p-6">
      <div className="flex justify-between border-b">
        <div className="mb-4">
          <h1 className="text-lg font-semibold text-gray-800">General Info</h1>
        </div>
        {/* dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="text-[#2563EB]">Edit</DialogTrigger>

          <DialogContent className="w-[626px] ">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <DialogHeader>
                  <DialogTitle>General Info</DialogTitle>
                </DialogHeader>
                <FormField
                  control={form.control}
                  name="hotelName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hotel name</FormLabel>
                      <FormControl>
                        <Input placeholder="please insert your hotel name here" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Hotel Description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stars"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rating</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Choose rating" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5 stars">5 stars</SelectItem>
                            <SelectItem value="4 stars">4 stars</SelectItem>
                            <SelectItem value="3 stars">3 stars</SelectItem>
                            <SelectItem value="2 stars">2 stars</SelectItem>
                            <SelectItem value="1 star">1 star</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone number</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-between">
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
      <div className="flex flex-col gap-2 justify-between p-6 ">
        <div>
          <label className="text-sxm text-gray-500">Name</label>
          <p className="text-sm">{form.getValues('hotelName')}</p>
        </div>

        <div className="flex justify-between items-center ">
          <div>
            <label className="text-sm text-gray-500">Phone Number</label>
            <p className="text-sm flex gap-2 items-center">
              <Phone className="w-4 h-4" />
              {form.getValues('phone')}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Rating</label>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium border rounded-xl w-[39px] h-[20px] text-white flex justify-center bg-[#2563EB]">0.0</span>
              <span className="font-medium text-sm  text-[#09090B] ">None</span>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-500">Stars Rating</label>
            <div className="flex gap-1 ">
              <Star className="w-4 h-4" />
              <Star className="w-4 h-4" />
              <Star className="w-4 h-4" />
              <Star className="w-4 h-4" />
              <Star className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div>
          <label className="text-base text-gray-500">Description</label>
          <p className="text-sm text-[#09090B] font-medium">{form.getValues('description')}</p>
        </div>
      </div>
    </Card>
  );
};
