'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

type Booking = {
  id: string;
  guest: string;
  status: 'Booked' | 'Cancelled' | 'Completed';
  date: string;
};

const bookings: Booking[] = [
  {
    id: '0001',
    guest: 'Shagai Nyamdorj (1 adult, 0 children)',
    status: 'Booked',
    date: '2025-10-20',
  },
  {
    id: '0002',
    guest: 'Bold Baatar (2 adults, 1 child)',
    status: 'Completed',
    date: '2025-08-15',
  },
  {
    id: '0003',
    guest: 'Oyuna Byambaa (1 adult, 0 children)',
    status: 'Cancelled',
    date: '2025-07-11',
  },
  {
    id: '0004',
    guest: 'Naraa Bat (2 adults, 0 children)',
    status: 'Completed',
    date: '2025-06-25',
  },
];

export default function UpcomingBookings() {
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterDate, setFilterDate] = useState<string | null>(null);

  const filtered = bookings.filter((b) => {
    const statusOk = filterStatus ? b.status === filterStatus : true;
    const dateOk = filterDate ? b.date.startsWith(filterDate) : true;
    return statusOk && dateOk;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Booked':
        return 'bg-blue-100 text-blue-700';
      case 'Completed':
        return 'bg-green-100 text-green-700';
      case 'Cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Upcoming Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Guest name</TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    Status
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {['Booked', 'Cancelled', 'Completed'].map((s) => (
                          <DropdownMenuItem key={s} onClick={() => setFilterStatus(s)}>
                            {s}
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuItem onClick={() => setFilterStatus(null)}>Clear filter</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    Date
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {['2025-10', '2025-08', '2025-07', '2025-06'].map((d) => (
                          <DropdownMenuItem key={d} onClick={() => setFilterDate(d)}>
                            {d}
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuItem onClick={() => setFilterDate(null)}>Clear filter</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>{b.id}</TableCell>
                  <TableCell>
                    {b.guest.split('(')[0]}
                    <span className="text-gray-500 text-sm">({b.guest.split('(')[1]})</span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(b.status)}`}>{b.status}</span>
                  </TableCell>
                  <TableCell>{b.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
