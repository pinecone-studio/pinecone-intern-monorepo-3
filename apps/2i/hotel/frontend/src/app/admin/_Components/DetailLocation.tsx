import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
export const DetailLocation = () => {
  return (
    <Card className="p-6">
      <div className="flex justify-between border-b">
        <CardTitle>Location</CardTitle>
        <Dialog>
          <DialogTrigger className="text-[#2563EB]">Edit</DialogTrigger>
          <DialogContent className="w-[480px] ">
            <DialogHeader>
              <DialogTitle>Location</DialogTitle>
            </DialogHeader>
            <Textarea placeholder="Enter location details" className="" />
            <div className=" flex justify-between">
              <Button>Cancel</Button>
              <Button className="text-white bg-[#2563EB]">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <CardContent>Ulaanbaatar hotel in Downtown Ulaanbaatar with 4 restaurants and a full-service spa</CardContent>
    </Card>
  );
};
