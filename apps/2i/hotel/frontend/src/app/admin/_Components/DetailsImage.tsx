import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
export const DetailImage = () => {
  return (
    <Card className="p-6">
      <div className="flex justify-between border-b">
        <CardTitle>Images</CardTitle>
        <Dialog>
          <DialogTrigger className="text-[#2563EB]">Edit</DialogTrigger>
          <DialogContent className="w-[1160px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Images</DialogTitle>
            </DialogHeader>

            {/* zurag */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* upload */}

              <Label
                htmlFor="image-upload"
                className="cursor-pointer border border-dashed rounded-md p-6 text-sm flex flex-col justify-center gap-2 items-center text-muted-foreground hover:bg-gray-50 bg-[#E4E4E7]"
              >
                <Plus className="w-5 h-5 text-[#2563EB]" />
                <input id="image-upload" type="file" className="hidden" />
              </Label>

              <img src="/images/room1.jpg" alt="Room 1" className="rounded-md object-cover w-full h-40 border" />
              <img src="/images/room2.jpg" alt="Room 2" className="rounded-md object-cover w-full h-40 border" />
              <img src="/images/room3.jpg" alt="Room 3" className="rounded-md object-cover w-full h-40 border" />
              <img src="/images/room4.jpg" alt="Room 4" className="rounded-md object-cover w-full h-40 border" />
            </div>

            <div className="flex justify-between">
              <Button variant="ghost">Cancel</Button>
              <Button className="bg-[#2563EB] text-white">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <CardContent className="mt-10">
        {/* <div className="border rounded-xl p-4 space-y-4"> */}
        {/* <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Images</h2>
            <button className="text-sm text-blue-500 hover:underline">Edit</button>
          </div> */}

        <div className="grid grid-cols-2 gap-2">
          {/* tom zurag */}
          <img src="/images/bar.jpg" alt="Main" className="col-span-2 h-48 object-cover rounded-lg border" />

          {/* jijig zurganuud */}
          <img src="/images/hotel.jpg" alt="Hotel" className="h-24 object-cover rounded-lg border" />
          <img src="/images/lobby.jpg" alt="Lobby" className="h-24 object-cover rounded-lg border" />
          <img src="/images/room.jpg" alt="Room" className="h-24 object-cover rounded-lg border" />

          {/* + */}
          <div className="relative h-24 rounded-lg overflow-hidden">
            <img src="/images/more.jpg" alt="More" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-sm font-medium">+18</span>
            </div>
          </div>
        </div>
        {/* </div> */}
      </CardContent>
    </Card>
  );
};
