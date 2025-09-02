import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateHotelMutation } from '@/generated';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

const formSchema = z.object({
  about: z.string().nonempty('about'),
  language: z.array(z.string().nonempty('language')).nonempty('At least one language required'),
});

export const AddAbout = ({ hotelId }: { hotelId: string | undefined }) => {
  const [updateHotelMutation] = useUpdateHotelMutation();
  const [open, setOpen] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      about: '',
      language: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data } = await updateHotelMutation({
        variables: {
          updateHotelId: hotelId!,
          input: {
            about: values.about,
            languages: values.language,
          },
        },
      });
      console.log(data?.updateHotel);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Card className="p-6 space-y-3">
      <div className="flex justify-between items-center border-b  ">
        <div className="mb-2 ">
          <h1 className="text-lg font-semibold text-gray-800">About This Property</h1>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button variant="link" className="text-[#2563EB] text-lg">
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[480px]">
            <DialogHeader>
              <DialogTitle>About this property</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <FormField
                  control={form.control}
                  name="about"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea placeholder="About..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="language..." {...field} value={field.value.join(', ')} onChange={(e) => field.onChange(e.target.value.split(',').map((lang) => lang.trim()))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-between">
                  <DialogClose asChild>
                    <Button variant="secondary">Close</Button>
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

      <div className="">
        <p>{form.getValues('about')}</p>

        <h1 className="font-semibold ">Languages</h1>
        <p>{form.getValues('language')}</p>
      </div>
    </Card>
  );
};
