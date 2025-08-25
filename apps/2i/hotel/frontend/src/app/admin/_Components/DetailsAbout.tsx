import { Card, CardContent } from '@/components/ui/card';

export const AboutProperty = () => {
  return (
    <Card className="p-6 space-y-8">
      <div className="flex justify-between border-b">
        <div className="mb-4 ">
          <h1 className="text-lg font-semibold text-gray-800">About This Property</h1>
        </div>
      </div>

      <CardContent className="mt-4 space-y-2">
        <h1 className="text-lg font-semibold ">Flower Hotel Ulaanbaatar</h1>
        Consider a stay at Flower Hotel Ulaanbaatar and take advantage of a coffee shop/cafe, dry cleaning/laundry services, and a bar. Treat yourself to a massage at the onsite spa. Be sure to enjoy
        Mongolian cuisine at one of the 4 on-site restaurants. In addition to a gym and a business center, guests can connect to free in-room WiFi.
        <h1 className="font-bold text-[18px]">Languages</h1>
        <p>English, Japanese, Mongolian, Russian</p>
      </CardContent>
    </Card>
  );
};
