import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const Policies = () => {
  return (
    <Card className="p-4">
      <CardHeader className="font-bold text-[18px] border-b">Policies</CardHeader>
      <CardContent className="p-6">
        <div>
          <h1>Check-in</h1>
        </div>
        <div>
          <h1>Check-in</h1>
        </div>
        <h1>Children and extra beds</h1>
        This property offers transfers from the airport (surcharges may apply); guests must contact the property with arrival details before travel, using the contact information on the booking
        confirmation
        <h1 className="font-bold text-[18px]">Languages</h1>
        <p>English, Japanese, Mongolian, Russian</p>
      </CardContent>
    </Card>
  );
};
