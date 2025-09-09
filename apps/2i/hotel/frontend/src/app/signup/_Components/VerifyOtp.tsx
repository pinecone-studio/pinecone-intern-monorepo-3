'use client';

import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { SignUpFormType } from '../page';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useSendOtpMutation, useVerifyOtpMutation } from '@/generated';

type OtpType = {
  form: UseFormReturn<SignUpFormType>;
  setIndex: Dispatch<SetStateAction<number>>;
};

export const VerifyOtp = ({ form, setIndex }: OtpType) => {
  const [time, setTime] = useState<number>(15);
  const [sendOtpMutation] = useSendOtpMutation();
  const [verifyOtpMutation] = useVerifyOtpMutation();
  useEffect(() => {
    if (time === 0) return;

    const timer = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [time]);
  const handleSendOtp = async () => {
    try {
      const { data } = await sendOtpMutation({
        variables: {
          email: form.getValues('email'),
        },
      });
      console.log(data?.sendOtp);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const verifyOtp = async () => {
      try {
        const { data } = await verifyOtpMutation({
          variables: {
            email: form.getValues('email'),
            code: form.getValues('otp'),
          },
        });
        console.log(data, 'dara');

        if (data?.verifyOtp.success) {
          setIndex((prev) => prev + 1);
        }
      } catch (err) {
        console.log(err);
      }
    };
    verifyOtp();
  }, [form.watch('otp')]);
  return (
    <Card className="w-[350px] border-none shadow-none">
      <Form {...form}>
        <form className="flex flex-col justify-center items-center gap-6">
          <div className="flex gap-2 items-center">
            <div className="w-[20px] h-[20px] bg-[#2563EB] rounded-full"></div>
            <h1 className="text-[20px]">Pedia</h1>
          </div>
          <CardHeader className="flex flex-col items-center">
            <CardTitle>Confirm email</CardTitle>
            <CardDescription className="text-center">{`To continue, enter the secure code we sent to ${form.watch('email')}. Check junk mail if it’s not in your inbox.`}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={4} pattern={REGEXP_ONLY_DIGITS_AND_CHARS} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          {time !== 0 ? (
            <p>{`Send again (${time})`}</p>
          ) : (
            <Button variant="hotel" type="button" onClick={handleSendOtp}>
              Send again
            </Button>
          )}
        </form>
      </Form>
    </Card>
  );
};
