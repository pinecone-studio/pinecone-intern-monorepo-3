'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCreateUserMutation } from '@/generated';


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
  const [createUser] = useCreateUserMutation(); // generated hook

  const onSubmit = async (data: SignUpFormInputs) => {
    if (data.password !== data.confirmPassword) {
      form.setError('confirmPassword', { message: 'Нууц үг тохирохгүй байна' });
      return;
    }

    setLoading(true);
    try {
      const { data: res } = await createUser({
        variables: {
          input: {
            username: data.username,
            email: data.email,
            password: data.password,
          },
        },
      });

      if (!res?.createUser?.userId) {
        form.setError('email', { message: 'Бүртгэл амжилтгүй боллоо' });
        return;
      }

      localStorage.setItem('user', JSON.stringify(res.createUser));
      router.push('/sign-in');
    } catch (err: any) {
      console.error('Sign up error:', err);
      form.setError('email', { message: err.message || 'Алдаа гарлаа' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen gap-6 bg-gray-50">
  <Image src="/mainLogo.png" alt="Logo" width={108} height={104} />

  <div className="flex flex-col w-full max-w-[327px] items-center gap-6">
    <h1 className="text-2xl font-semibold text-[#441500]">Бүртгүүлэх</h1>

    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3 w-full">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Хэрэглэгчийн нэр" {...field} />
              </FormControl>
              <FormMessage className="text-red-500 text-sm" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Имэйл хаяг" type="email" {...field} />
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
                <Input type="password" placeholder="Нууц үг" {...field} />
              </FormControl>
              <FormMessage className="text-red-500 text-sm" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="password" placeholder="Нууц үгээ давтан оруулна уу" {...field} />
              </FormControl>
              <FormMessage className="text-red-500 text-sm" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#441500] text-white"
        >
          {loading ? 'Түр хүлээнэ үү...' : 'Бүртгүүлэх'}
        </Button>
      </form>
    </Form>

    <Button
      type="button"
      onClick={() => router.push('/sign-in')}
      className="w-full text-black bg-transparent hover:bg-gray-100"
    >
      Аль хэдийн бүртгэлтэй юу? Нэвтрэх
    </Button>
  </div>
</div>

  );
};

export default SignUp;
