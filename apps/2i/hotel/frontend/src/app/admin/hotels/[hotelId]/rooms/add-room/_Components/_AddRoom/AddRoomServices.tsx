'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { ServicesDialog } from './ServicesDialog';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { useUpdateRoomMutation } from '@/generated';

type ServiceLabelType = {
  label: string;
  value: string[];
  key: string;
};

export const formSchema = z.object({
  bathroom: z.array(z.string().nonempty('at least one required item')),
  bedroom: z.array(z.string().nonempty('at least one required item')),
  accessibility: z.array(z.string().nonempty('at least one required item')),
  entertainment: z.array(z.string().nonempty('at least one required item')),
  foodAndDrink: z.array(z.string().nonempty('at least one required item')),
  other: z.array(z.string().nonempty('at least one required item')),
});

export type FormType = z.infer<typeof formSchema>;

export const AddRoomServices = ({ roomId }: { roomId: string | undefined }) => {
  const [updateRoomMutation] = useUpdateRoomMutation();
  const [open, setOpen] = useState<boolean>(false);
  const [labels, setLabels] = useState<ServiceLabelType[]>([
    { label: 'Bathroom', value: ['-/-'], key: 'bathroom' },
    { label: 'Bedroom', value: ['-/-'], key: 'bedroom' },
    { label: 'Accessibility', value: ['-/-'], key: 'accessibility' },
    { label: 'Entertainment', value: ['-/-'], key: 'entertainment' },
    { label: 'Food and Drink', value: ['-/-'], key: 'foodAndDrink' },
    { label: 'other', value: ['-/-'], key: 'other' },
  ]);
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bathroom: [],
      bedroom: [],
      accessibility: [],
      entertainment: [],
      foodAndDrink: [],
      other: [],
    },
  });
  console.log(roomId, 'roomID services');

  const onSubmit = async (values: FormType) => {
    if (!roomId) return;
    try {
      const { data } = await updateRoomMutation({
        variables: {
          roomId: roomId,
          input: {
            amenities: {
              bathroom: values.bathroom,
              bedroom: values.bedroom,
              accessibility: values.accessibility,
              technology: values.entertainment,
              foodAndDrink: values.foodAndDrink,
              more: values.other,
            },
          },
        },
      });
      console.log(data?.updateRoom.message);
      setOpen(false);
      setLabels((prev) =>
        prev.map((item) => {
          const valueArray = values[item.key as keyof FormType] as string[];
          return {
            ...item,
            value: valueArray.length > 0 ? valueArray : ['-/-'],
          };
        })
      );
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Card className="w-[784px]">
      <CardContent className="flex flex-col gap-6">
        <CardHeader>
          <CardTitle className="text-[18px] font-semibold flex justify-between">
            Room services
            <Dialog open={open} onOpenChange={setOpen}>
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
        </div>
      </CardContent>
    </Card>
  );
};
