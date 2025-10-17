'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export const StepOne: React.FC = () => {
  const router = useRouter();

  const formSchema = z.object({
    email: z.string().min(1, { message: 'Имэйл хаяг оруулна уу' }).max(50).email({ message: 'Имэйл хаяг буруу байна' }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Backend-гүйгээр frontend-д хадгалах
    localStorage.setItem('emailAddress', values.email);
    router.push('/reset-password/verify-code');
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center pt-[105px] gap-8">
      <h1 className="text-[24px] font-semibold text-[#441500]">Нууц үг сэргээх</h1>

      <div className="flex w-[327px] flex-col gap-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="email" placeholder="Имэйл хаяг" {...field} data-testid="email-input-resetpassword" />
                  </FormControl>
                  <FormMessage data-testid="email-error-resetpassword" className="text-red-500 text-sm" />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-[#441500] text-white text-[14px] hover:bg-[#441500]/90">
              Үргэлжүүлэх
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
