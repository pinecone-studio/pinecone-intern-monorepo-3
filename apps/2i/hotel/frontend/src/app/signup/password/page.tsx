'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const passSchema = z
  .object({
    password: z.string().min(10, 'Use a minimum of 10 characters'),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    message: 'Passwords do not match',
    path: ['confirm'],
  });

export default function CreatePasswordPage() {
  const router = useRouter();
  const form = useForm<z.infer<typeof passSchema>>({
    resolver: zodResolver(passSchema),
    defaultValues: {
      password: '',
      confirm: '',
    },
  });

  const [serverMsg, setServerMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: z.infer<typeof passSchema>) => {
    setLoading(true);
    setServerMsg(null);

    try {
      router.push('/login');
    } catch (err: any) {
      setServerMsg('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center mb-6">
            <div className="mx-auto h-4 w-4 rounded-full bg-blue-600" />
            <h2 className="mt-3 text-xl font-semibold text-gray-900">Create password</h2>
            <p className="text-sm text-gray-500">Use a minimum of 10 characters, including uppercase letters, lowercase letters, and numbers</p>
          </div>

          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Re-enter password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full h-[40px]" disabled={loading}>
                {loading ? 'Creating…' : 'Continue'}
              </Button>
            </form>
          </Form>

          {serverMsg && <p className="mt-4 text-center text-sm text-red-600">{serverMsg}</p>}
        </div>
      </div>
    </div>
  );
}
