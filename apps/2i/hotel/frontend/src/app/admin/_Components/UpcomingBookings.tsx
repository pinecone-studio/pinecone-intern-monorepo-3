import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { History } from 'lucide-react';
type Booking = {
  id: string;
  guest: string;
  details?: string;
  date: string;
  room: string;
};

export const UpcomingBookings = () => {
  const bookings: Booking[] = [];

  return (
    <Card className="bg-white p-6 rounded-lg shadow-sm">
      <div className="mb-4">
        <h1 className="text-lg font-semibold text-gray-800">Upcoming Bookings</h1>
      </div>

      <div className="rounded-lg overflow-hidden border">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Guest</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Rooms</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                    <div className=" bg-white p-3 rounded-full mb-4 shadow-md">
                      <History className="w-6 h-6" />
                    </div>
                    <p className="font-semibold">No Upcoming Bookings</p>
                    <p className="text-sm text-gray-400 mt-1">You currently have no upcoming stays. Your future bookings will appear here once confirmed.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.id}</TableCell>
                  <TableCell>
                    {booking.guest}
                    <br />
                    <span className="text-sm text-gray-500">{booking.details}</span>
                  </TableCell>
                  <TableCell>{booking.date}</TableCell>
                  <TableCell className="text-right">{booking.room}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
