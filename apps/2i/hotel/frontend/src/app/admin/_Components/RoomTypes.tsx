import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import Image from 'next/image';

export const RoomTypes = () => {
  return (
    <Card className="bg-white p-6 rounded-lg shadow-sm">
      <Table>
        <div className=" flex justify-between ">
          <div className="mb-4">
            <h1 className="text-lg font-semibold text-gray-800">Room Types</h1>
          </div>
          <Button variant="ghost" className="text-[#2563EB]">
            {' '}
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
                    <TableRow className="hover:bg-gray-50">
                      <TableCell className="font-medium">0001</TableCell>
                      <TableCell className="flex items-center gap-2 text-sm">
                        <Image src="/path/to/image.jpg" alt="Room Image" width={40} height={40} className="rounded-md object-cover" />
                        Economy Single room
                      </TableCell>
                      <TableCell>$250.00</TableCell>
                      <TableCell className="text-right">1 Bed</TableCell>
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
      </Table>
    </Card>
  );
};
