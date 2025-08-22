import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
export const UpcomingBookings = () => {
  return (
    <Card className="bg-white p-6">
      <h1></h1>
      <Table className="">
        <TableCaption className="text-start  font-bold text-black text-[18px]">Upcoming Bookings</TableCaption>
        <TableHeader>
          <TableRow className="bg-gray-300">
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Guest</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Rooms</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">0001</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell className="text-right">$250.00</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  );
};
