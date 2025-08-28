import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { History } from 'lucide-react';
type Booking = {
  id: string;
  guest: string;
  details?: string;
  date: string;
  rooms: string;
};

export const UpcomingBookings = () => {
  // const bookings: Booking[] = [];
  const bookings: Booking[] = [
    {
      id: '0001',
      guest: 'Shagai Nymdorj',
      details: '2 Adults, 1 Child',
      date: '2023-10-15',
      rooms: 'Economy Double',
    },
    {
      id: '0001',
      guest: 'Shagai Nymdorj',
      details: '2 Adults, 1 Child',
      date: '2023-10-15',
      rooms: 'Economy Double',
    },
    {
      id: '0002',
      guest: 'Jane Smith',
      details: '1 Adult',
      date: '2023-10-16',
      rooms: 'Economy',
    },
    {
      id: '0003',
      guest: 'Jane Smith',
      details: '1 Adult',
      date: '2023-10-16',
      rooms: 'Economy',
    },
  ];
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
            {bookings.map((booking) => (
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
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
