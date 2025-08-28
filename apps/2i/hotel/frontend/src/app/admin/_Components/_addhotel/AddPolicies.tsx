import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const AddPolicies = () => {
  return (
    <Card className="p-4">
      <CardHeader className="font-bold text-[18px] border-b">Policies</CardHeader>
      <CardContent className="p-6">
        <div>
          <h1>Check-in</h1>
          <p>-/-</p>
        </div>
        <div>
          <h1>Check-in</h1>
          <p>-/-</p>
        </div>
        <div>
          <h1>Special check-in instructions</h1>
          <p>-/-</p>
        </div>
        <div>
          <h1>Access methods</h1>
          <p>-/-</p>
        </div>
        <div>
          <h1>Pets</h1>
          <p>-/-</p>
        </div>
        <div>
          <h1>Children and extra beds</h1>
          <p>-/-</p>
        </div>
        <div>
          <h1>Property payment types</h1>
          <p>-/-</p>
        </div>
      </CardContent>
    </Card>
  );
};
