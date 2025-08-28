import { Card } from '@/components/ui/card';

export const AddAbout = () => {
  return (
    <Card className="p-6 space-y-3">
      <div className="flex justify-between border-b  ">
        <div className="mb-2 ">
          <h1 className="text-lg font-semibold text-gray-800">About This Property</h1>
        </div>
      </div>

      <div className="">
        <p>-/-</p>

        <h1 className="font-semibold ">Languages</h1>
        <p>-/-</p>
      </div>
    </Card>
  );
};
