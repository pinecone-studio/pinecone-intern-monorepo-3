import { Card } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const UpcomingBookings = () => {
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
            {/* {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">{booking.id}</TableCell>
                <TableCell>
                  {booking.guest}
                  <br />
                  <span className="text-sm text-gray-500">{booking.details}</span>
                </TableCell>
                <TableCell>{booking.date}</TableCell>
                <TableCell className="text-right">{booking.rooms}</TableCell>
              </TableRow>
            ))} */}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
