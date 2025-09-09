'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { HotelType } from './HotelDetail';

type RoomType = {
  hotel: HotelType | undefined;
};

export const RoomTypes = ({ hotel }: RoomType) => {
  const { hotelId } = useParams();
  const router = useRouter();
  const handleAddRoom = () => {
    router.push(`/admin/hotels/${hotelId}/rooms/add-room`);
  };
  return (
    <Card className="bg-white p-6 rounded-lg shadow-sm">
      <Table>
        <div className=" flex justify-between ">
          <div className="mb-4">
            <h1 className="text-lg font-semibold text-gray-800">Room Types</h1>
          </div>
          <Button variant="ghost" className="text-[#2563EB]" onClick={handleAddRoom}>
            <Plus />
            Add Room
          </Button>
        </div>

        <CardContent>
          <Tabs defaultValue="All" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="All">All Rooms</TabsTrigger>
              <TabsTrigger value="one-bed">1 Bed</TabsTrigger>
              <TabsTrigger value="two-bed">2 Bed</TabsTrigger>
            </TabsList>

            <TabsContent value="All">
              <div className="rounded-lg overflow-hidden border">
                <Table>
                  <TableHeader className="bg-gray-100">
                    <TableRow>
                      <TableHead className="w-[82px]">ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="text-right">Bed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {hotel?.rooms?.map((room) => {
                      return (
                        <TableRow className="hover:bg-gray-50" key={room?._id}>
                          <TableCell className="font-medium">{room?.roomNumber}</TableCell>
                          <TableCell className="flex items-center gap-2 text-sm">
                            <Image src={room?.roomImgs?.[0] || ''} alt={room?.roomNumber || ''} width={40} height={40} className="rounded-md object-cover" />
                            {room?.roomType}
                          </TableCell>
                          <TableCell>{room?.pricePerNight}₮</TableCell>
                          <TableCell className="text-right">{room?.roomType}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="one-bed">
              <p className="text-gray-500">1 bed room list goes here...</p>
            </TabsContent>

            <TabsContent value="two-bed">
              <p className="text-gray-500">2 bed room list goes here...</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Table>
    </Card>
  );
};
