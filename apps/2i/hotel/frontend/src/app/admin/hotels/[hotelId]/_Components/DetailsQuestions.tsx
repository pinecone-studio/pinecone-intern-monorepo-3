import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
export const DetailsQuestions = () => {
  return (
    <Card className="p-6">
      <div className="border-b flex justify-between">
        <div className="mb-4">
          <h1 className="text-lg font-semibold text-gray-800">Frequently asked questions</h1>
        </div>
      </div>
      <CardContent className="mt-4">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Is Flower Hotel Ulaanbaatar pet-friendly?</AccordionTrigger>
            <AccordionContent>Self parking is free at this property.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>How much is parking at Flower Hotel Ulaanbaatar?</AccordionTrigger>
            <AccordionContent>Self parking is free at this property.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>How much is parking at Flower Hotel Ulaanbaatar?</AccordionTrigger>
            <AccordionContent>Self parking is free at this property.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>How much is parking at Flower Hotel Ulaanbaatar?</AccordionTrigger>
            <AccordionContent>Self parking is free at this property.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};
