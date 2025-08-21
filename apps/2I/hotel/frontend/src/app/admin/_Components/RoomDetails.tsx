'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, ArrowLeft } from 'lucide-react';

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

export default function RoomDetail() {
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
  const roomServices = [
    {
      title: 'Bathroom',
      items: ['Shower', 'Hair dryer', 'Free toiletries', 'Towels'],
    },
    {
      title: 'Bedroom',
      items: ['Linen', 'Wardrobe', 'Alarm clock', 'Heating'],
    },
    {
      title: 'TV',
      items: ['Flat-screen TV', 'Satellite channels', 'Streaming service'],
    },
    {
      title: 'Internet',
      items: ['Free WiFi', 'High-speed LAN', 'USB charging ports'],
    },
    {
      title: 'Food & Drink',
      items: ['Mini-bar', 'Tea/Coffee maker', 'Bottled water', 'fghj,bnmbn', 'ghjklbnm,bnm'],
    },
    {
      title: 'Accessibility',
      items: ['Wheelchair accessible', 'Elevator access', 'Lower bathroom sink'],
    },
    {
      title: 'Other',
      items: ['Smoke-free', 'Pet friendly', 'Daily housekeeping'],
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-start gap-2">
        <Button variant="ghost" className="flex items-center gap-0 p-0">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold">Economy Single Room</h1>
      </div>

      {/* General Info and Images */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>General Info</CardTitle>
            <Button className="text-blue-500" variant="ghost" size="sm">
              Edit
            </Button>
          </CardHeader>
          <div className="border-t border-gray-200 my-4"></div>
          <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">Economy single room</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Type</p>
              <p className="font-medium">Single</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Price per night</p>
              <p className="font-medium">150,000₮</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Room information</p>
              <p className="font-medium"></p>
            </div>
          </CardContent>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              '18 sq m',
              'Private bathroom',
              'Shower/tub combination',
              'Free breakfast',
              'Free bottle water',
              'Air conditioning',
              '1 double bed',
              'Desk',
              'Free self parking',
              'Bathrobes',
              'Sleeps 2',
              'Free WiFi',
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-s text-black font-semibold">
                <span className="text-black">•</span>
                <span>{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Images</CardTitle>
            <Button className="text-blue-500" variant="ghost" size="sm">
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2"></div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Bookings */}
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

      {/* Rooooooommmm servecis heseg */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Room Services</CardTitle>
            <Button variant="ghost" size="sm" className="text-blue-500">
              Edit
            </Button>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roomServices.map((service, index) => (
              <div key={index}>
                {/* Title */}
                <p className="text-sm font-semibold mb-2">{service.title}</p>

                {/* Items */}
                <div className="flex flex-wrap gap-2">
                  {service.items.map((item, i) => (
                    <span key={i} className="border border-gray-300 rounded-md bg-gray-50 px-2 py-1 text-xs text-gray-900 font-medium">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
