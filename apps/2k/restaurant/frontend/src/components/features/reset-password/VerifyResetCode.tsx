'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export const StepTwo: React.FC = () => {
  const router = useRouter();

  // StepOne page дээр хадгалсан email-г аваад шалгана
  const storedEmail = localStorage.getItem('emailAddress') || '';

  const formSchema = z.object({
    code: z.string().min(6, { message: '6 оронтой код оруулна уу' }).max(6, { message: '6 оронтой код оруулна уу' }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { code: '' },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Backend-гүй хувилбар: ямар ч код зөв бол дараагийн page руу
    if (values.code === '123456') {
      // frontend dummy verification
      router.push('/reset-password/new-password');
    } else {
      form.setError('code', { type: 'manual', message: 'Код буруу байна' });
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center pt-[105px] gap-8">
      <h1 className="text-[24px] font-semibold text-[#441500]">Нууц үг сэргээх</h1>
      <p className="text-[14px] text-gray-600">{storedEmail ? `${storedEmail} руу илгээгдсэн кодыг оруулна уу` : 'Email олдсонгүй'}</p>

      <div className="flex w-[327px] flex-col gap-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="text" placeholder="6 оронтой код" {...field} data-testid="code-input" />
                  </FormControl>
                  <FormMessage data-testid="code-error" className="text-red-500 text-sm" />
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
