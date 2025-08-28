import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
export const Amenities = () => {
  const Amenities = ['Airport Shuttle', 'Free Wi-Fi', 'Swimming Pool', 'Spa', 'Fitness Center', 'Restaurant', 'Bar'];
  return (
    <Card className="p-6">
      <div className="border-b flex justify-between">
        <div className="mb-4">
          <h1 className="text-lg font-semibold text-gray-800">Aminities</h1>
        </div>

        <Dialog>
          <DialogTrigger className="text-[#2563EB]">Edit</DialogTrigger>
          <DialogContent className="w-[626px] h-[234px]">
            <DialogHeader>
              <DialogTitle>Amenities </DialogTitle>
            </DialogHeader>
            <Label>Amenities</Label>
            <div className="border p-4 flex flex-wrap gap-2 ">
              {Amenities.map((amenity, index) => (
                <Button variant={'secondary'} key={index} className="rounded-full ">
                  {amenity}
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {Amenities.map((amenity, index) => (
          <Button variant={'secondary'} key={index} className="rounded-full ">
            {amenity}
          </Button>
        ))}
      </div>
    </Card>
  );
};
