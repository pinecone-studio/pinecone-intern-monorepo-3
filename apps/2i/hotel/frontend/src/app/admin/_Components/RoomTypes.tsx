import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';

export const RoomTypes = () => {
  return (
    <Card className="bg-white p-6">
      <Table className=" ">
        <div className=" flex justify-between">
          <TableCaption className="text-start  font-bold text-black text-[18px]">Room Types</TableCaption>

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
              <Table className="rounded-lg overflow-hidden border">
                <TableHeader className="bg-gray-100">
                  <TableRow>
                    <TableHead className="w-[82px]">ID</TableHead>
                    <TableHead>Guest</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Rooms</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="hover:bg-gray-50">
                    <TableCell className="font-medium">0001</TableCell>
                    <TableCell>Paid</TableCell>
                    <TableCell>Credit Card</TableCell>
                    <TableCell className="text-right">$250.00</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
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
