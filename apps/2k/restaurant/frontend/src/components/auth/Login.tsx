'use client';

import React, { useState } from 'react';

import { useForm } from 'react-hook-form';
import axios from 'axios';
import Image from 'next/image';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface LoginFormInputs {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const router = useRouter();
  const form = useForm<LoginFormInputs>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/login', data);
      const token = res.data.token;

      localStorage.setItem('token', token);
      router.push('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
      form.setError('email', { message: 'Имэйл эсвэл нууц үг буруу байна' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen gap-[24px] bg-gray-50">
      <Image src="/mainLogo.png" alt="Logo" width={108} height={104} />

      <div className="flex flex-col w-[327px] items-center gap-[24px]">
        <h1 className="text-[24px] font-semibold text-[#441500]">Нэвтрэх</h1>

        <div className="flex flex-col gap-2 w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-[8px]">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        data-testid="email-input"
                        type="email"
                        placeholder="Имэйл хаяг"
                        {...field}
                        className={`focus-visible:ring-0 focus-visible:ring-offset-0 ${form.formState.errors.email ? 'border-red-500 focus-visible:ring-2 focus-visible:ring-red-500' : ''}`}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        data-testid="password-input"
                        type="password"
                        placeholder="Нууц үг"
                        {...field}
                        className={`focus-visible:ring-0 focus-visible:ring-offset-0 ${form.formState.errors.password ? 'border-red-500 focus-visible:ring-2 focus-visible:ring-red-500' : ''}`}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <Button data-testid="sign-in-button" type="submit" disabled={loading} className="w-full bg-[#441500] text-white text-[14px] hover:bg-[#441500]/90" onClick={() => router.push('/')}>
                {loading ? 'Түр хүлээнэ үү...' : 'Нэвтрэх'}
              </Button>
            </form>
          </Form>

          <Button data-testid="reset-password-button" type="button" onClick={() => router.push('/reset-password')} className="text-black text-[14px] bg-transparent hover:bg-gray-100 hover:text-black">
            Нууц үг мартсан?
          </Button>
        </div>

        <div className="flex gap-[10px] w-full items-center">
          <div className="w-full h-[1px] bg-[#E4E4E7]" />
          <h1 className="text-[12px] text-[#71717A] font-normal">Эсвэл</h1>
          <div className="w-full h-[1px] bg-[#E4E4E7]" />
        </div>

        <Button
          data-testid="sign-up-button"
          type="button"
          onClick={() => router.push('/sign-up')}
          className="w-full bg-transparent border border-[#E4E4E7] text-[#441500] hover:bg-gray-100 hover:text-black"
        >
          Бүргүүлэх
        </Button>
      </div>
    </div>
  );
};

export default Login;
