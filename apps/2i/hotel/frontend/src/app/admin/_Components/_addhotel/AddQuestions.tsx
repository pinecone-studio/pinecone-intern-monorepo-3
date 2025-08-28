import { Card } from '@/components/ui/card';

export const AddQuestions = () => {
  return (
    <Card className="p-6">
      <div className="border-b flex justify-between">
        <div className="mb-4">
          <h1 className="text-lg font-semibold text-gray-800">Frequently asked questions</h1>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">-/-</div>
    </Card>
  );
};
