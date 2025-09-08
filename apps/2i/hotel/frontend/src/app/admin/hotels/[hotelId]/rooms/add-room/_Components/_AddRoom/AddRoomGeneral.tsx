'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { GeneralDialog } from './GeneralDialog';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dispatch, SetStateAction, useState } from 'react';
import { useAddRoomMutation } from '@/generated';

export type FormType = z.infer<typeof formSchema>;

type LabelsType = {
  label: string;
  value: string;
  key: string;
};
type RoomGeneralType = {
  setRoomId: Dispatch<SetStateAction<string | undefined>>;
  hotelId: string | undefined;
};
export const formSchema = z.object({
  roomNumber: z.string().nonempty('Please define your hotel room number'),
  roomType: z.string().nonempty('Choose your room type'),
  price: z.string().nonempty('Add room price per night'),
  roomInfo: z.string().nonempty('Please add room information'),
});

export const AddRoomGeneral = ({ setRoomId, hotelId }: RoomGeneralType) => {
  const [addRoomMutation] = useAddRoomMutation();
  const [open, setOpen] = useState<boolean>(false);
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomNumber: '',
      roomType: '',
      price: '',
      roomInfo: '',
    },
  });

  const [labels, setLabels] = useState<LabelsType[]>([
    { label: 'Room number', value: '-/-', key: 'roomNumber' },
    { label: 'Type', value: '-/-', key: 'roomType' },
    { label: 'Price per night', value: '-/-', key: 'price' },
    { label: 'Room information', value: '-/-', key: 'roomInfo' },
  ]);

  const onSubmit = async (values: FormType) => {
    if (!hotelId) return;

    try {
      const { data } = await addRoomMutation({
        variables: {
          hotelName: hotelId,
          roomNumber: values.roomNumber,
          roomType: values.roomType,
          roomInfos: values.roomInfo,
          pricePerNight: Number(values.price),
        },
      });
      console.log(data?.addRoom);
      setRoomId(data?.addRoom._id);
      setOpen(false);
      setLabels((prev) =>
        prev.map((item) => ({
          ...item,
          value: values[item.key as keyof FormType] || '-/-',
        }))
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
            General Info
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger className="text-[#2563EB] text-[14px] font-medium">Edit</DialogTrigger>
              <GeneralDialog form={form} onSubmit={onSubmit} />
            </Dialog>
          </CardTitle>
        </CardHeader>
        <div className="border"></div>
        <div className="grid grid-cols-3 gap-8">
          {labels.map((el, index) => {
            return (
              <div key={index} className="flex flex-col gap-2">
                <h1 className="text-[#71717A]">{el.label}</h1>
                <p>{el.value}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
