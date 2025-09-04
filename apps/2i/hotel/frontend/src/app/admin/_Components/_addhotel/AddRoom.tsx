'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DoorClosed, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const AddHotelRoom = () => {
  const router = useRouter();

  const handleRoom = () => {
    router.push('/admin/hotels/rooms');
  };

  return (
    <Card className="bg-white p-6 rounded-lg shadow-sm">
      {/* Header хэсэг */}
      <div className="flex justify-between mb-4">
        <h1 className="text-lg font-semibold text-gray-800">Room Types</h1>
        <Button variant="ghost" className="text-[#2563EB]" onClick={handleRoom}>
          <Plus className="mr-1" /> Add Room
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
                  <TableRow className="hover:bg-gray-50">
                    <TableCell colSpan={4}>
                      <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                        <div className="bg-white p-3 rounded-full mb-4 shadow-md">
                          <DoorClosed className="w-6 h-6" />
                        </div>
                        <p className="font-semibold">Room Types Not Set up</p>
                        <p className="text-sm text-gray-400 mt-1">Define room types to help guests choose the best stay option.</p>
                      </div>
                    </TableCell>
                  </TableRow>
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
    </Card>
  );
};
