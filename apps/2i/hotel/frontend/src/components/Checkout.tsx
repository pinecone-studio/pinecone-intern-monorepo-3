'use client';
import { Button } from '@/components/ui/button';
import { CheckContact } from './CheckContact';
import { CheckGuest } from './CheckGuest';
import { CheckPayment } from './CheckPayment';
import { CheckoutSideCard } from './CheckoutSideCard';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { BookingConfirmation } from './BookingConfirmation';
const Schema = z.object({
  firstname: z.string().min(1, 'First name is required'),
  middlename: z.string().optional(),
  lastname: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phonenumber: z
    .string()
    .min(8, 'Too short')
    .regex(/^\+?\d{8}$/, 'Invalid phone number'),
  cardname: z.string().min(1, 'Name on card is required'),
  cardnumber: z.string().min(12, 'Too short').max(19, 'Too long').regex(/^\d+$/, 'Only digits are allowed'),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, 'Use MM/YY'),
  cvv: z.string().regex(/^\d{3,4}$/, '3–4 digits'),
  country: z.string().min(1, 'Country is required'),
});
export type CheckoutValues = z.infer<typeof Schema>;
export const Checkout = () => {
  const form = useForm<CheckoutValues>({
    resolver: zodResolver(Schema),
    // mode: 'onTouched',
    defaultValues: {
      firstname: '',
      middlename: '',
      lastname: '',
      cardname: '',
      cardnumber: '',
      expiry: '',
      cvv: '',
      country: '',
      email: '',
      phonenumber: '',
    },
  });
  const [confirmed, setConfirmed] = useState(false);
  const onSubmit = (data: CheckoutValues) => {
    setConfirmed(true);
  };
  if (confirmed) {
    return (
      <div>
        <BookingConfirmation />
      </div>
    );
  }
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl p-6">
        <div className="grid gap-6 grid-cols-12">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="col-span-12 space-y-6 lg:col-span-8">
              <div className="space-y-6 col-span-8">
                <div>
                  <h1 className="text-xl font-semibold">1. Who's checking in?</h1>
                  <p className="text-muted-foreground">
                    Please tell us the name of the guest staying at the hotel as it appears on the ID that they’ll present at check-in. If the guest has more than one last name, please enter them all.
                  </p>
                </div>

                <CheckGuest />
                <CheckContact />
                <CheckPayment />

                <div>
                  <h2 className="text-sm font-semibold text-foreground">Important information</h2>
                  <ul className="pl-5 list-disc">
                    <li className="text-sm text-muted-foreground">
                      Guests must contact the property in advance for check-in instructions; front desk staff will greet guests on arrival. To make arrangements for check-in please contact the
                      property ahead of time using the information on the booking confirmation. If you are planning to arrive after 3:30 PM please contact the property in advance using the information
                      on the booking confirmation.
                    </li>
                  </ul>

                  <p className="mt-3 text-[13px] leading-5 text-muted-foreground">
                    By clicking on the button below, I confirm I have read the{' '}
                    <a href="#" className="text-[#2563EB]      underline underline-offset-2">
                      Privacy Statement
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-[#2563EB] underline underline-offset-2">
                      Government Travel Advice
                    </a>
                    , and have read and accept the{' '}
                    <a href="#" className="text-[#2563EB] underline underline-offset-2">
                      Rules &amp; Restrictions
                    </a>{' '}
                    and{' '}
                    <a href="#" className=" text-[#2563EB] underline underline-offset-2">
                      Terms of Service
                    </a>
                    .
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" className="bg-[#2563EB] rounded-md" onSubmit={() => setConfirmed(true)}>
                    Complete booking
                  </Button>
                </div>
              </div>
            </form>
          </Form>
          <aside className="lg:col-span-4">
            <div className="sticky top-6">
              <CheckoutSideCard />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
