'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const RoomGeneralInfo = () => {
  return (
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
  );
};
