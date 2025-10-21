'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export const StepThree: React.FC = () => {
  const router = useRouter();

  const formSchema = z
    .object({
      password: z.string().min(6, { message: 'Нууц үг дор хаяж 6 тэмдэгт байх ёстой' }),
      confirmPassword: z.string().min(6, { message: 'Нууц үг дор хаяж 6 тэмдэгт байх ёстой' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Нууц үг таарахгүй байна',
      path: ['confirmPassword'],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Frontend-only хувилбар: localStorage-д хадгалах эсвэл simple success message
    localStorage.setItem('newPassword', values.password);
    alert('Нууц үг амжилттай солигдлоо!');
    router.push('/login'); // Login page руу буцаана
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center pt-[105px] gap-8">
      <h1 className="text-[24px] font-semibold text-[#441500]">Шинэ нууц үг</h1>

      <div className="flex w-[327px] flex-col gap-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="password" placeholder="Шинэ нууц үг" {...field} data-testid="password-input" />
                  </FormControl>
                  <FormMessage data-testid="password-error" className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="password" placeholder="Нууц үг давтах" {...field} data-testid="confirm-password-input" />
                  </FormControl>
                  <FormMessage data-testid="confirm-password-error" className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-[#441500] text-white text-[14px] hover:bg-[#441500]/90">
              Нууц үг солих
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
