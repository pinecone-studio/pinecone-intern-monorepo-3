import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import Image from 'next/image';

export const BookingConfirmation = () => {
  return (
    <div className="min-h-screen  ">
      <div className="mx-auto max-w-2xl px-6 py-10">
        <div className="flex items-center justify-center">
          <Image src={'/confirm.png'} width={146} height={155} alt="confirm img" />
        </div>
        <h1 className="text-start font- text-2xl">You're confirmed</h1>
        <div className="flex justify-between">
          <p className="text-muted-foreground text-sm">Contact email</p>
          <p className="text-sm">end email ni</p>
        </div>
        <Button className="bg-[#2563EB]">View your booking</Button>
        <div>
          <h1>Flower Hotel Ulaanbaatar</h1>
          <p className="text-muted-foreground">Zaluuchuud Avenue, 18, Bayanzurkh, Ulaanbaatar, Ulaanbaatar, 001334</p>
          <div className="my-6 h-px w-full bg-gray-200" />
          <p className="text-muted-foreground text-sm">Check in</p>
          <p>uuuu</p>
          <p className="text-muted-foreground text-sm">Check out</p>
          <p>uu</p>
          <div className="my-6 h-px w-full bg-gray-200" />

          <div>
            <h1 className="text-lg font-semibold">Important information</h1>
            <Zap className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
