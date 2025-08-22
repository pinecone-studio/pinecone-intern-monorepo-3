'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
    items: ['Mini-bar', 'Tea/Coffee maker', 'Bottled water'],
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

export default function RoomServices() {
  return (
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
              <p className="text-sm font-semibold mb-2">{service.title}</p>
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
  );
}
