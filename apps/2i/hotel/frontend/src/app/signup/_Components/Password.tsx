'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UseFormReturn } from 'react-hook-form';
import { SignUpFormType } from '../page';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type PasswordType = {
  form: UseFormReturn<SignUpFormType>;
  onSubmit: (_values: SignUpFormType) => void;
};

export const Password = ({ form, onSubmit }: PasswordType) => {
  return (
    <Card className="w-[350px] border-none shadow-none">
      <CardHeader className="flex flex-col items-center">
        <div className="flex gap-2 items-center mb-[22px]">
          <div className="w-[20px] h-[20px] bg-[#2563EB] rounded-full"></div>
          <h1 className="text-[20px]">Pedia</h1>
        </div>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Use a minimum of 6 characters</CardDescription>
      </CardHeader>
      <CardContent className="w-full flex flex-col gap-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input placeholder="confirm password" {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button variant="hotel" type="submit">
              Continue
            </Button>
          </form>
        </Form>
        <div className="w-full flex items-center gap-2">
          <div className="border flex-1"></div>
          <p className="text-[12px] text-[#71717A]">OR</p>
          <div className="border flex-1"></div>
        </div>
        <Button variant="outline">Log in</Button>
        <p className="text-center text-[14px] text-[#71717A] px-[20px]">By clicking continue, you agree to our Terms of Service and Privacy Policy.</p>
      </CardContent>
    </Card>
  );
};
