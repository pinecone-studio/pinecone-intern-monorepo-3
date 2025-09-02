import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateHotelMutation } from '@/generated';

// --- Zod schema ---
const policySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
});

const formSchema = z.object({
  policies: z.array(policySchema).min(1, 'At least one policy is required'),
});

type FormValues = z.infer<typeof formSchema>;

export const AddPolicies = ({ hotelId }: { hotelId: string | undefined }) => {
  const [updateHotelMutation, { data, loading, error }] = useUpdateHotelMutation();
  const [savedPolicies, setSavedPolicies] = useState<FormValues>({
    policies: [
      { title: 'Check-in', description: '-/-' },
      { title: 'Check-out', description: '-/-' },
      { title: 'Special check-in instructions', description: '-/-' },
      { title: 'Access methods', description: '-/-' },
      { title: 'Pets', description: '-/-' },
      { title: 'Children and extra beds', description: '-/-' },
      { title: 'Property payment types', description: '-/-' },
    ],
  });

  // useForm
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: savedPolicies,
  });

  // useFieldArray
  const { fields } = useFieldArray({
    control: form.control,
    name: 'policies',
  });

  const onSubmit = async (values: FormValues) => {
    setSavedPolicies(values);
    try {
      const { data } = await updateHotelMutation({
        variables: {
          updateHotelId: hotelId!,
          input: {
            policies: values.policies.map((p) => ({
              title: p.title,
              description: p.description,
            })),
          },
        },
      });
      console.log(data?.updateHotel);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Card className="p-4">
      {/* Header */}
      <CardHeader className="font-bold text-[18px] border-b flex justify-between items-center">
        <span>Policies</span>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[480px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Policies</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {fields.map((field, index) => (
                  <div key={field.id} className="space-y-2">
                    <FormField
                      control={form.control}
                      name={`policies.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Policy title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`policies.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Policy description" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
                <div className="flex justify-between">
                  <DialogClose asChild>
                    <Button className="my-2">Close</Button>
                  </DialogClose>
                  <Button type="submit" className="my-2" variant="hotel">
                    Save
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>

      {/* Content */}
      <CardContent className="p-6 space-y-4">
        {savedPolicies.policies.map((p, i) => (
          <div key={i} className="flex justify-between">
            <h1>{p.title}</h1>
            <p>{p.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
