'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { ServicesDialog } from './ServicesDialog';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

type ServiceLabelType = {
  label: string;
  value: string[];
  key: string;
};

export const formSchema = z.object({
  bathroom: z.array(z.string().nonempty('at least one required item')),
  accessibility: z.array(z.string().nonempty('at least one required item')),
  entertainment: z.array(z.string().nonempty('at least one required item')),
  foodAndDrink: z.array(z.string().nonempty('at least one required item')),
  starsRating: z.string().nonempty('Choose star rating'),
  other: z.array(z.string().nonempty('at least one required item')),
});

export type FormType = z.infer<typeof formSchema>;

export const AddRoomServices = () => {
  const [labels, setLabels] = useState<ServiceLabelType[]>([
    { label: 'Bathroom', value: ['-/-'], key: 'bathroom' },
    { label: 'Accessibility', value: ['-/-'], key: 'accessibility' },
    { label: 'Entertainment', value: ['-/-'], key: 'entertainment' },
    { label: 'Food and Drink', value: ['-/-'], key: 'foodAndDrink' },
    { label: 'other', value: ['-/-'], key: 'other' },
  ]);
  const [starRate, setStarRate] = useState<string>('');
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bathroom: [],
      accessibility: [],
      entertainment: [],
      foodAndDrink: [],
      starsRating: '',
      other: [],
    },
  });

  const onSubmit = async (values: FormType) => {
    setLabels((prev) =>
      prev.map((item) => {
        const valueArray = values[item.key as keyof FormType] as string[];
        return {
          ...item,
          value: valueArray.length > 0 ? valueArray : ['-/-'],
        };
      })
    );

    // Update star rate separately if needed
    setStarRate(values.starsRating || '');
  };
  return (
    <Card className="w-[784px]">
      <CardContent className="flex flex-col gap-6">
        <CardHeader>
          <CardTitle className="text-[18px] font-semibold flex justify-between">
            Room services
            <Dialog>
              <DialogTrigger className="text-[#2563EB] text-[14px] font-medium">Edit</DialogTrigger>
              <ServicesDialog form={form} onSubmit={onSubmit} />
            </Dialog>
          </CardTitle>
        </CardHeader>
        <div className="border"></div>
        <div className="grid grid-cols-3 gap-8">
          {labels.map((el, index) => {
            return (
              <div key={index} className="flex flex-col gap-2">
                <h1 className="text-[#71717A]">{el.label}</h1>
                <div className="flex flex-wrap gap-2">
                  {el.value.map((val, idx) => (
                    <Badge key={idx} variant="secondary">
                      {val}
                    </Badge>
                  ))}
                </div>
              </div>
            );
          })}
          <div className="flex flex-col gap-2">
            <h1 className="text-[#71717A]">Stars rating </h1>
            <p className="flex items-center gap-1">
              {starRate === '' ? (
                '-/-'
              ) : (
                <>
                  {starRate}
                  <Star className="w-[16px]" />
                </>
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
