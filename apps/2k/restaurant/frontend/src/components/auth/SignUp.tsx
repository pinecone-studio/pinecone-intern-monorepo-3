'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SignUpFormInputs {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUp: React.FC = () => {
  const router = useRouter();
  const form = useForm<SignUpFormInputs>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: SignUpFormInputs) => {
    if (data.password !== data.confirmPassword) {
      form.setError('confirmPassword', { message: 'Нууц үг тохирохгүй байна' });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('/api/sign-up', data);
      const token = res.data.token;

      localStorage.setItem('token', token);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Sign up failed:', err);
      form.setError('email', { message: err.response?.data?.message || 'Алдаа гарлаа' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen gap-[24px] bg-gray-50">
      {/* Logo */}
      <Image src="/mainLogo.png" alt="Logo" width={108} height={104} />

      {/* SignUp container */}
      <div className="flex flex-col w-[327px] items-center gap-[24px]">
        <h1 className="text-[24px] font-semibold text-[#441500]">Бүртгүүлэх</h1>

        {/* Form */}
        <div className="flex flex-col gap-2 w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-[8px]">
              {/* Username */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Хэрэглэгчийн нэр"
                        {...field}
                        className={`focus-visible:ring-0 focus-visible:ring-offset-0 ${form.formState.errors.username ? 'border-red-500 focus-visible:ring-2 focus-visible:ring-red-500' : ''}`}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Имэйл хаяг"
                        type="email"
                        {...field}
                        className={`focus-visible:ring-0 focus-visible:ring-offset-0 ${form.formState.errors.email ? 'border-red-500 focus-visible:ring-2 focus-visible:ring-red-500' : ''}`}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Нууц үг"
                        type="password"
                        {...field}
                        className={`focus-visible:ring-0 focus-visible:ring-offset-0 ${form.formState.errors.password ? 'border-red-500 focus-visible:ring-2 focus-visible:ring-red-500' : ''}`}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Нууц үгээ давтан оруулна уу"
                        type="password"
                        {...field}
                        className={`focus-visible:ring-0 focus-visible:ring-offset-0 ${form.formState.errors.confirmPassword ? 'border-red-500 focus-visible:ring-2 focus-visible:ring-red-500' : ''}`}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              {/* Sign Up Button */}
              <Button type="submit" disabled={loading} className="w-full bg-[#441500] text-white text-[14px] hover:bg-[#441500]/90">
                {loading ? 'Түр хүлээнэ үү...' : 'Бүртгүүлэх'}
              </Button>
            </form>
          </Form>

          {/* Already have account */}
          <Button type="button" onClick={() => router.push('/sign-in')} className="text-black text-[14px] bg-transparent hover:bg-gray-100 hover:text-black">
            Аль хэдийн бүртгэлтэй юу? Нэвтрэх
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
