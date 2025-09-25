'use client';

import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

export default function SignUpEmailPage() {
  const router = useRouter();

  const emailSchema = z.object({
    email: z.string().trim().email('Зөв имэйл хаяг оруулна уу'),
  });

  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = (values: z.infer<typeof emailSchema>) => {
    router.push('/signup/confirm');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 bg-[#2563EB] rounded-full" />
              <p className="text-xl">Pedia</p>
            </div>
            <h2 className="mt-3 text-xl font-semibold text-gray-900">Create an account</h2>
            <p className="text-sm text-gray-500">Enter your email below to create your account</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full rounded-md bg-blue-600 text-white text-sm font-medium py-2.5 hover:bg-blue-700">
                Continue
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-gray-500">OR</span>
                </div>
              </div>

              <a href="/login" className="w-full inline-flex justify-center rounded-md border border-gray-300 bg-white py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Log in
              </a>
            </form>
          </Form>

          <p className="mt-6 text-center text-[10px] text-gray-400">
            By clicking continue, you agree to our{' '}
            <a className="underline" href="/terms">
              Terms of Service
            </a>{' '}
            and{' '}
            <a className="underline" href="/privacy">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
